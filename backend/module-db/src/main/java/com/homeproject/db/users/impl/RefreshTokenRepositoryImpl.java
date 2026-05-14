package com.homeproject.db.users.impl;

import com.homeproject.db.jooq.tables.pojos.RefreshTokensEntity;
import com.homeproject.db.users.RefreshTokenRepository;
import lombok.RequiredArgsConstructor;
import org.jooq.DSLContext;
import org.springframework.stereotype.Repository;

import java.util.Optional;

import static com.homeproject.db.jooq.Tables.REFRESH_TOKENS;

@Repository
@RequiredArgsConstructor
public class RefreshTokenRepositoryImpl implements RefreshTokenRepository {

    private final DSLContext dsl;

    @Override
    public void save(RefreshTokensEntity refreshToken) {
        dsl.insertInto(REFRESH_TOKENS)
                .set(dsl.newRecord(REFRESH_TOKENS, refreshToken))
                .execute();
    }

    @Override
    public Optional<RefreshTokensEntity> findByToken(String token) {
        return dsl.selectFrom(REFRESH_TOKENS)
                .where(REFRESH_TOKENS.TOKEN.eq(token))
                .fetchOptionalInto(RefreshTokensEntity.class);
    }

    @Override
    public void deleteByToken(String token) {
        dsl.deleteFrom(REFRESH_TOKENS)
                .where(REFRESH_TOKENS.TOKEN.eq(token))
                .execute();
    }

    @Override
    public void deleteByUserId(String userId) {
        dsl.deleteFrom(REFRESH_TOKENS)
                .where(REFRESH_TOKENS.USER_ID.eq(userId))
                .execute();
    }
}
