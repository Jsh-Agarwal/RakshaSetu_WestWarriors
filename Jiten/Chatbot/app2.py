from flask import Flask, request, jsonify
from langchain_core.messages import HumanMessage, AIMessage, SystemMessage, trim_messages
from langchain_core.chat_history import BaseChatMessageHistory
from langchain_core.runnables.history import RunnableWithMessageHistory
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_core.prompts import ChatPromptTemplate, MessagesPlaceholder
import uuid
from typing import Dict, List, Optional
import os
import chromadb
from langchain_google_genai import GoogleGenerativeAIEmbeddings
from langchain_community.document_loaders import WebBaseLoader, PyPDFLoader, DirectoryLoader
from langchain_community.vectorstores import Chroma
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain_core.documents import Document
from langchain.chains import RetrievalQA

app = Flask(__name__)
api = os.getenv("API_KEY")
print(api)
os.environ["GOOGLE_API_KEY"] = "AIzaSyAwXnTMHTU4fARimNk4lDaBJraUbBAuqY4"

# Initialize Google Gemini model
model = ChatGoogleGenerativeAI(
    model="gemini-2.0-flash",
    temperature=0,
    max_tokens=None,
    timeout=None,
    max_retries=2,
    system_instruction="You are a helpful assistant specializing in Indian law. Answer all the questions to the best of your ability using the retrieved context when relevant.",
)

# Initialize Gemini embeddings
embeddings = GoogleGenerativeAIEmbeddings(model="models/embedding-001")

# Directory for Chroma persistence
CHROMA_PERSIST_DIRECTORY = "chroma_db"

# Initialize ChromaDB with Gemini embeddings
def initialize_chroma():
    return Chroma(
        persist_directory=CHROMA_PERSIST_DIRECTORY,
        embedding_function=embeddings
    )

# Function to load documents from a list of URLs
def load_from_urls(urls):
    documents = []
    for url in urls:
        try:
            loader = WebBaseLoader(url)
            docs = loader.load()
            documents.extend(docs)
            print(f"Loaded {len(docs)} documents from {url}")
        except Exception as e:
            print(f"Error loading {url}: {e}")
    return documents

# Function to load documents from a directory of PDFs
def load_from_pdf_directory(directory_path):
    try:
        loader = DirectoryLoader(directory_path, glob="**/*.pdf", loader_cls=PyPDFLoader)
        documents = loader.load()
        print(f"Loaded {len(documents)} documents from {directory_path}")
        return documents
    except Exception as e:
        print(f"Error loading PDFs from {directory_path}: {e}")
        return []

# Function to process documents and store in ChromaDB
def process_and_store_documents(documents, collection_name="indian_law"):
    # Split documents into chunks
    text_splitter = RecursiveCharacterTextSplitter(
        chunk_size=1000,
        chunk_overlap=100
    )
    chunks = text_splitter.split_documents(documents)
    
    # Store in ChromaDB
    vectorstore = Chroma.from_documents(
        documents=chunks,
        embedding=embeddings,
        persist_directory=CHROMA_PERSIST_DIRECTORY,
        collection_name=collection_name
    )
    vectorstore.persist()
    return vectorstore

# Function to load documents and add to ChromaDB
def load_and_index_documents(urls=None, pdf_directory=None):
    documents = []
    
    if urls:
        web_documents = load_from_urls(urls)
        documents.extend(web_documents)
    
    if pdf_directory:
        pdf_documents = load_from_pdf_directory(pdf_directory)
        documents.extend(pdf_documents)
    
    if documents:
        return process_and_store_documents(documents)
    else:
        print("No documents loaded")
        return None

# Create prompt template
prompt = ChatPromptTemplate.from_messages([
    SystemMessage(content="You are a helpful assistant specializing in Indian law. Answer the question based on the context provided. If the context doesn't contain the answer, say you don't know and provide general information if possible."),
    MessagesPlaceholder(variable_name="messages"),
    SystemMessage(content="Context: {context}")
])

# Create the chain
chain = prompt | model

# Create our own simple message history class
class SimpleMessageHistory(BaseChatMessageHistory):
    def __init__(self):
        self.messages = []
    
    def add_message(self, message):
        self.messages.append(message)
    
    def clear(self):
        self.messages = []

# Message trimmer configuration 
trimmer = trim_messages(
    max_tokens=150,
    strategy="last",
    token_counter=model,
    include_system=False,
    allow_partial=False,
    start_on="human"
)

# Storage for message histories
store: Dict[str, SimpleMessageHistory] = {}

def get_session_history(session_id: str) -> BaseChatMessageHistory:
    """Get or create a message history for a session ID."""
    if session_id not in store:
        store[session_id] = SimpleMessageHistory()
    return store[session_id]

# Configure the model with message history
with_message_history = RunnableWithMessageHistory(
    chain,
    get_session_history,
    input_messages_key="messages"
)

def trim_history(session_id: str) -> None:
    """Trim message history using LangChain's trim_messages function."""
    if session_id not in store:
        return
    
    history = store[session_id]
    messages = history.messages
    
    # Filter out any system messages before trimming
    messages = [msg for msg in messages if not isinstance(msg, SystemMessage)]
    
    # Apply trimming
    trimmed_messages = trimmer.invoke(messages)
    
    # Update the store with trimmed messages
    store[session_id].messages = trimmed_messages

# Initialize ChromaDB retriever
def get_retriever(collection_name="indian_law"):
    try:
        vectorstore = Chroma(
            persist_directory=CHROMA_PERSIST_DIRECTORY,
            embedding_function=embeddings,
            collection_name=collection_name
        )
        return vectorstore.as_retriever(search_kwargs={"k": 3})
    except Exception as e:
        print(f"Error initializing retriever: {e}")
        return None

@app.route('/chat/init', methods=['GET'])
def initialize_session():
    """Initialize a new chat session."""
    session_id = str(uuid.uuid4())
    history = get_session_history(session_id)
    
    # Add initial AI message
    initial_message = "Hi! I'm your assistant. How may I help you?"
    history.add_message(AIMessage(content=initial_message))
    
    return jsonify({
        "session_id": session_id,
        "message": initial_message
    })

@app.route('/chat/message', methods=['POST'])
def handle_message():
    """Process a user message and return a response."""
    data = request.json
    
    session_id = data.get('session_id')
    if not session_id or session_id not in store:
        return jsonify({"error": "Invalid or expired session ID"}), 400
    
    user_message = data.get('message', '')
    language = data.get('language', 'English')
    
    if not user_message:
        return jsonify({"error": "Message cannot be empty"}), 400
    
    # Add user message to history
    history = get_session_history(session_id)
    history.add_message(HumanMessage(content=user_message))
    
    # Trim history before processing
    trim_history(session_id)
    
    # Get relevant documents from ChromaDB
    retriever = get_retriever()
    if retriever:
        retrieved_docs = retriever.get_relevant_documents(user_message)
        context = "\n\n".join([doc.page_content for doc in retrieved_docs])
    else:
        context = "No legal context available."
    
    # Update system instruction with language preference
    system_instruction = f"You are a helpful assistant specializing in Indian law. Answer all the questions to the best of your ability in the {language} language. Use the following context for reference: {context}"
    
    # Create a temporary model with language-specific system instruction
    temp_model = ChatGoogleGenerativeAI(
        model="gemini-2.0-flash",
        temperature=0,
        max_tokens=None,
        timeout=None,
        max_retries=2,
        system_instruction=system_instruction,
    )
    
    # Create a simplified prompt that doesn't use additional system messages
    temp_prompt = ChatPromptTemplate.from_messages([
        MessagesPlaceholder(variable_name="messages")
    ])
    
    temp_chain = temp_prompt | temp_model
    
    # Create temporary RunnableWithMessageHistory
    temp_with_message_history = RunnableWithMessageHistory(
        temp_chain,
        get_session_history,
        input_messages_key="messages"
    )
    
    # Process the message with the temporary model
    response = temp_with_message_history.invoke(
        {"messages": [HumanMessage(content=user_message)]},
        config={"configurable": {"session_id": session_id}}
    )
    
    # Add AI response to history
    history.add_message(AIMessage(content=response.content))
    
    return jsonify({
        "session_id": session_id,
        "message": response.content
    })

@app.route('/chat/history', methods=['GET'])
def get_history():
    """Get the message history for a session."""
    session_id = request.args.get('session_id')
    if not session_id or session_id not in store:
        return jsonify({"error": "Invalid or expired session ID"}), 400
    
    history = get_session_history(session_id)
    messages = [{"role": "system" if isinstance(msg, SystemMessage) else 
                       "human" if isinstance(msg, HumanMessage) else "ai", 
                "content": msg.content} 
               for msg in history.messages]
    
    return jsonify({
        "session_id": session_id,
        "history": messages
    })

@app.route('/load_documents', methods=['POST'])
def load_documents_endpoint():
    """Endpoint to load and index documents."""
    data = request.json
    urls = data.get('urls', [])
    pdf_directory = data.get('pdf_directory')
    
    if not urls and not pdf_directory:
        return jsonify({"error": "Please provide URLs or a PDF directory"}), 400
    
    # Load and index documents
    vectorstore = load_and_index_documents(urls, pdf_directory)
    
    if vectorstore:
        return jsonify({"success": True, "message": "Documents loaded and indexed successfully"})
    else:
        return jsonify({"success": False, "message": "Failed to load documents"})

if __name__ == '__main__':
    # Make sure the ChromaDB directory exists
    os.makedirs(CHROMA_PERSIST_DIRECTORY, exist_ok=True)
    app.run(debug=True)