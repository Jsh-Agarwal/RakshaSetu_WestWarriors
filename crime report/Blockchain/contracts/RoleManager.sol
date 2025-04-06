// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/AccessControl.sol";

contract RoleManager is AccessControl {
    bytes32 public constant ADMIN_ROLE = keccak256("ADMIN_ROLE");

    constructor() {
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _grantRole(ADMIN_ROLE, msg.sender);
    }

    // Extended role management functionality
    function grantMultipleRoles(
        address account,
        bytes32[] memory roles
    ) external onlyRole(ADMIN_ROLE) {
        for (uint i = 0; i < roles.length; i++) {
            grantRole(roles[i], account);
        }
    }

    function bulkRoleAssignment(
        address[] memory accounts,
        bytes32 role
    ) external onlyRole(ADMIN_ROLE) {
        for (uint i = 0; i < accounts.length; i++) {
            grantRole(role, accounts[i]);
        }
    }
}