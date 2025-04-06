// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract AuditLogger {
    enum LogLevel { INFO, WARNING, ERROR }
    
    struct SystemLog {
        address actor;
        LogLevel level;
        string category;
        string message;
        uint256 timestamp;
    }

    SystemLog[] public logs;
    
    event LogEntryCreated(
        uint256 indexed logId,
        address indexed actor,
        LogLevel level,
        string category
    );

    function logEntry(
        LogLevel level,
        string memory category,
        string memory message
    ) external {
        logs.push(SystemLog({
            actor: msg.sender,
            level: level,
            category: category,
            message: message,
            timestamp: block.timestamp
        }));
        emit LogEntryCreated(logs.length - 1, msg.sender, level, category);
    }

    function getLogsByFilter(
        LogLevel level,
        string memory category
    ) external view returns (SystemLog[] memory) {
        uint256 count = 0;

        // Count matching logs
        for (uint256 i = 0; i < logs.length; i++) {
            if (logs[i].level == level && keccak256(bytes(logs[i].category)) == keccak256(bytes(category))) {
                count++;
            }
        }

        // Populate matching logs
        SystemLog[] memory filteredLogs = new SystemLog[](count);
        uint256 index = 0;
        for (uint256 i = 0; i < logs.length; i++) {
            if (logs[i].level == level && keccak256(bytes(logs[i].category)) == keccak256(bytes(category))) {
                filteredLogs[index] = logs[i];
                index++;
            }
        }

        return filteredLogs;
    }
}