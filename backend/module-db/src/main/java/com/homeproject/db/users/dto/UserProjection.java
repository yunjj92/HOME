package com.homeproject.db.users.dto;

import java.time.OffsetDateTime;

public record UserProjection(
        Integer id,
        String userId,
        String credentialId,
        String publicKey,
        Integer signatureCount,
        OffsetDateTime createdAt,
        String createdBy,
        OffsetDateTime updatedAt,
        String updatedBy
) {}
