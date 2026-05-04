package com.homeproject.db.users.dto;

public record UserCommand(
        String userId,
        String credentialId,
        String publicKey,
        Integer signatureCount,
        String requestedBy
) {}
