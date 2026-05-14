package com.homeproject.db.users;

import com.homeproject.db.jooq.tables.pojos.RefreshTokensEntity;

import java.util.Optional;

public interface RefreshTokenRepository {
    void save(RefreshTokensEntity refreshToken);
    Optional<RefreshTokensEntity> findByToken(String token);
    void deleteByToken(String token);
    void deleteByUserId(String userId);
}
