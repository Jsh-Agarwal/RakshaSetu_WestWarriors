import React, { useEffect, useState } from 'react';

const SimpleMap = () => {
  const [diagnosticLogs, setDiagnosticLogs] = useState([]);
  const [apiKeyStatus, setApiKeyStatus] = useState('Checking...');
  
  const addLog = (message) => {
    setDiagnosticLogs(prev => [...prev, `[${new Date().toLocaleTimeString()}] ${message}`]);
  };

  useEffect(() => {
    // Test if window object is available (important for SSR frameworks)
    if (typeof window === 'undefined') {
      addLog('ERROR: Window object not available. Are you using SSR?');
      return;
    }
    addLog('Window object available.');
    
    // Check for existing Google Maps instances
    if (window.google && window.google.maps) {
      addLog('Google Maps already loaded on page.');
    }
    
    // Test DOM access
    try {
      const testDiv = document.createElement('div');
      testDiv.id = 'test-div';
      document.body.appendChild(testDiv);
      document.body.removeChild(testDiv);
      addLog('DOM manipulation working correctly.');
    } catch (e) {
      addLog(`ERROR: DOM manipulation failed: ${e.message}`);
    }
    
    // Test API key
    addLog('Testing API key...');
    fetch(`https://maps.googleapis.com/maps/api/js?key=AIzaSyDkLB2kml7k28-sZxjotxiNi5Q0I96I5-k&callback=console.log`)
      .then(response => {
        if (response.ok) {
          addLog('API key request succeeded.');
          setApiKeyStatus('Valid');
        } else {
          addLog(`API key request failed with status: ${response.status}`);
          setApiKeyStatus('Invalid or restricted');
        }
      })
      .catch(error => {
        addLog(`API key test failed: ${error.message}`);
        setApiKeyStatus('Error testing');
      });
    
    // Try loading the API manually
    const script = document.createElement('script');
    script.src = 'https://maps.googleapis.com/maps/api/js?key=AIzaSyDkLB2kml7k28-sZxjotxiNi5Q0I96I5-k&libraries=places&callback=googleMapCallback';
    script.async = true;
    script.defer = true;
    
    // Create global callback
    window.googleMapCallback = () => {
      addLog('Google Maps API loaded successfully!');
      try {
        const mapDiv = document.getElementById('map-test-container');
        if (mapDiv) {
          const map = new window.google.maps.Map(mapDiv, {
            center: { lat: 28.6, lng: 77.2 },
            zoom: 10,
          });
          addLog('Map instance created successfully');
        } else {
          addLog('ERROR: Map container not found in DOM');
        }
      } catch (e) {
        addLog(`ERROR creating map: ${e.message}`);
      }
    };
    
    script.onerror = () => {
      addLog('ERROR: Google Maps script failed to load');
    };
    
    document.head.appendChild(script);
    
    return () => {
      // Clean up
      if (window.googleMapCallback) {
        window.googleMapCallback = null;
      }
      if (document.getElementById('map-test-container')) {
        document.getElementById('map-test-container').innerHTML = '';
      }
    };
  }, []);

  return (
    <div style={{ padding: '20px', fontFamily: 'monospace' }}>
      <h2>Google Maps Diagnostic Tool</h2>
      
      <div style={{ display: 'flex', marginBottom: '20px' }}>
        <div style={{ flex: 1, marginRight: '20px' }}>
          <h3>API Key Status: <span style={{ color: apiKeyStatus === 'Valid' ? 'green' : 'red' }}>{apiKeyStatus}</span></h3>
          
          <div id="map-test-container" style={{ width: '100%', height: '300px', border: '1px solid #ccc', backgroundColor: '#f0f0f0' }}>
            Map should appear here
          </div>
        </div>
        
        <div style={{ flex: 1 }}>
          <h3>Diagnostic Log:</h3>
          <div style={{ 
            height: '300px', 
            overflowY: 'auto', 
            backgroundColor: '#000', 
            color: '#0f0',
            padding: '10px',
            fontFamily: 'monospace',
            whiteSpace: 'pre-wrap',
            fontSize: '12px'
          }}>
            {diagnosticLogs.map((log, index) => (
              <div key={index}>{log}</div>
            ))}
          </div>
        </div>
      </div>
      
      <div>
        <h3>Common Issues:</h3>
        <ul>
          <li>API key not activated for Maps JavaScript API</li>
          <li>API key has domain restrictions that don't include your development domain</li>
          <li>Billing not enabled on Google Cloud project</li>
          <li>CSS issues preventing map container from displaying (height/width)</li>
          <li>JavaScript errors in other parts of the application</li>
        </ul>
        
        <h3>Next Steps:</h3>
        <ol>
          <li>Check browser console for errors</li>
          <li>Verify API key in Google Cloud Console</li>
          <li>Make sure map container has explicit height/width</li>
          <li>Try in an incognito window to rule out extensions interference</li>
        </ol>
      </div>
    </div>
  );
};

export default SimpleMap;