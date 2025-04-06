// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/utils/Strings.sol";

contract CrimeLedger is AccessControl {
    bytes32 public constant CITIZEN_ROLE = keccak256("CITIZEN_ROLE");
    bytes32 public constant POLICE_ROLE = keccak256("POLICE_ROLE");
    bytes32 public constant ADMIN_ROLE = keccak256("ADMIN_ROLE");

    bool public paused;

    enum VerificationStatus { Submitted, InReview, Verified, Rejected }
    enum InvestigationStatus { Pending, InProgress, Completed }

    struct Evidence {
        string uri;
        string evidenceType;
        uint256 timestamp;
        string metadata;
    }

    struct CrimeReport {
        uint256 citizenId;
        bytes32 nameHash; // Salted hash of citizen name
        string encryptedNameIPFS; // IPFS URI for encrypted name
        string currentLocation;
        string crimeLocation;
        string description;  // Text description of the crime
        uint256 trustScore;
        Evidence[] evidence;
        uint256 crimeTime;  // When did the crime happen
        uint256 reportTime; // When was it reported
        VerificationStatus status;
        address reporter;
        bool isVerified;
        InvestigationStatus investigationStatus;
    }

    struct VerificationComment {
        address officer;
        string comment;
        uint256 timestamp;
    }

    uint256 public reportCounter;
    mapping(uint256 => CrimeReport) public reports;
    mapping(uint256 => VerificationComment[]) public verificationComments;
    mapping(bytes32 => bool) public rolePermissions;

    event ReportSubmitted(uint256 indexed reportId, address indexed reporter);
    event StatusChanged(uint256 indexed reportId, VerificationStatus newStatus);
    event CommentAdded(uint256 indexed reportId, address indexed officer);

    // Add field permission constants
    bytes32 public constant FIELD_NAME = keccak256("FIELD_NAME");
    bytes32 public constant FIELD_LOCATION = keccak256("FIELD_LOCATION");
    bytes32 public constant FIELD_EVIDENCE = keccak256("FIELD_EVIDENCE");

    // Access control constants
    bytes32 public constant PUBLIC_DATA = keccak256("PUBLIC_DATA");
    bytes32 public constant SENSITIVE_DATA = keccak256("SENSITIVE_DATA");
    bytes32 public constant RESTRICTED_DATA = keccak256("RESTRICTED_DATA");

    constructor() {
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _grantRole(ADMIN_ROLE, msg.sender);
        // Set ADMIN_ROLE as admin for other roles
        _setRoleAdmin(POLICE_ROLE, ADMIN_ROLE);
        _setRoleAdmin(CITIZEN_ROLE, ADMIN_ROLE);
        
        // Setup default field permissions
        rolePermissions[FIELD_NAME | POLICE_ROLE] = true;
        rolePermissions[FIELD_LOCATION | POLICE_ROLE] = true;
        rolePermissions[FIELD_EVIDENCE | POLICE_ROLE] = true;
        rolePermissions[FIELD_LOCATION | CITIZEN_ROLE] = true;

        // Setup layered permissions
        rolePermissions[PUBLIC_DATA | bytes32(0)] = true; // Everyone can access public data
        rolePermissions[SENSITIVE_DATA | CITIZEN_ROLE] = true;
        rolePermissions[SENSITIVE_DATA | POLICE_ROLE] = true;
        rolePermissions[RESTRICTED_DATA | POLICE_ROLE] = true;
    }

    modifier whenNotPaused() {
        require(!paused, "Contract paused");
        _;
    }

    // Submit new crime report (Citizens only)
    function submitReport(
        uint256 citizenId,
        bytes32 nameHash,
        string memory encryptedNameIPFS,
        string memory currentLocation,
        string memory crimeLocation,
        string memory description,
        Evidence[] memory evidence,
        uint256 crimeTime
    ) external onlyRole(CITIZEN_ROLE) whenNotPaused {
        CrimeReport storage newReport = reports[reportCounter];
        newReport.citizenId = citizenId;
        newReport.nameHash = nameHash;
        newReport.encryptedNameIPFS = encryptedNameIPFS;
        newReport.currentLocation = currentLocation;
        newReport.crimeLocation = crimeLocation;
        newReport.description = description;
        newReport.crimeTime = crimeTime;
        newReport.reportTime = block.timestamp;
        newReport.status = VerificationStatus.Submitted;
        newReport.reporter = msg.sender;

        // Store evidence
        for(uint i = 0; i < evidence.length; i++) {
            newReport.evidence.push(Evidence({
                uri: evidence[i].uri,
                evidenceType: evidence[i].evidenceType,
                timestamp: block.timestamp,
                metadata: evidence[i].metadata
            }));
        }

        emit ReportSubmitted(reportCounter, msg.sender);
        reportCounter++;
    }

    // Update report status (Police only)
    function updateStatus(
        uint256 reportId,
        VerificationStatus newStatus
    ) external onlyRole(POLICE_ROLE) {
        require(reportId < reportCounter, "Invalid report ID");
        reports[reportId].status = newStatus;
        emit StatusChanged(reportId, newStatus);
    }

    // Add verification comment (Police only)
    function addComment(
        uint256 reportId,
        string memory comment
    ) external onlyRole(POLICE_ROLE) {
        verificationComments[reportId].push(VerificationComment({
            officer: msg.sender,
            comment: comment,
            timestamp: block.timestamp
        }));
        emit CommentAdded(reportId, msg.sender);
    }

    // Granular data access control
    function getReportData(
        uint256 reportId,
        string[] memory fields
    ) external view returns (bytes[] memory result) {
        require(reportId < reportCounter, "Invalid report ID");
        require(hasAccess(msg.sender, fields), "Access denied");

        result = new bytes[](fields.length);
        for (uint i = 0; i < fields.length; i++) {
            bytes32 fieldHash = keccak256(abi.encodePacked(fields[i]));
            if (fieldHash == FIELD_NAME) {
                result[i] = abi.encode(reports[reportId].nameHash);
            } else if (fieldHash == FIELD_LOCATION) {
                result[i] = abi.encode(reports[reportId].crimeLocation);
            } else if (fieldHash == FIELD_EVIDENCE) {
                result[i] = abi.encode(reports[reportId].evidence);
            }
        }
        return result;
    }

    function hasAccess(
        address user,
        string[] memory fields
    ) internal view returns (bool) {
        for (uint i = 0; i < fields.length; i++) {
            bytes32 fieldHash = keccak256(abi.encodePacked(fields[i]));
            bytes32 permissionKey = fieldHash | (hasRole(POLICE_ROLE, user) ? POLICE_ROLE : CITIZEN_ROLE);
            if (!rolePermissions[permissionKey]) {
                return false;
            }
        }
        return true;
    }

    function emergencyPause() external onlyRole(ADMIN_ROLE) {
        paused = true;
    }

    function unpause() external onlyRole(ADMIN_ROLE) {
        paused = false;
    }

    // Remove duplicate getPublicReportData function and keep only this one
    function getPublicReportData(uint256 reportId) external view returns (
        string memory location,
        uint256 time
    ) {
        require(reportId < reportCounter, "Invalid report ID");
        CrimeReport storage report = reports[reportId];
        return (
            report.crimeLocation,
            report.crimeTime
        );
    }

    // Full report access (only reporter or police)
    function getFullReport(uint256 reportId) external view returns (
        uint256 citizenId,
        string memory currentLocation,
        string memory crimeLocation,
        string memory description,
        Evidence[] memory evidence,
        uint256 crimeTime,
        uint256 reportTime,
        VerificationStatus status,
        InvestigationStatus investigationStatus,
        bool isVerified
    ) {
        require(reportId < reportCounter, "Invalid report ID");
        CrimeReport storage report = reports[reportId];
        require(
            hasRole(POLICE_ROLE, msg.sender) || 
            report.reporter == msg.sender,
            "Unauthorized access"
        );
        
        return (
            report.citizenId,
            report.currentLocation,
            report.crimeLocation,
            report.description,
            report.evidence,
            report.crimeTime,
            report.reportTime,
            report.status,
            report.investigationStatus,
            report.isVerified
        );
    }
}