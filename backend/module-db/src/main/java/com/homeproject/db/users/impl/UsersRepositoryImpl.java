package com.homeproject.db.users.impl;

import com.homeproject.db.jooq.tables.pojos.UsersEntity;
import com.homeproject.db.users.UsersRepository;
import com.homeproject.db.users.dto.UserCommand;
import lombok.RequiredArgsConstructor;
import org.jooq.DSLContext;
import org.springframework.stereotype.Repository;

import java.util.Optional;

import static com.homeproject.db.jooq.Tables.V_USERS;
import static com.homeproject.db.jooq.Tables.USERS;
import static org.jooq.impl.DSL.currentOffsetDateTime;

@Repository
@RequiredArgsConstructor
public class UsersRepositoryImpl implements UsersRepository {

    private final DSLContext dsl;

    @Override
    public void insertUser(UserCommand userCommand) {
        dsl.insertInto(USERS)
                .set(USERS.USER_ID, userCommand.userId())
                .set(USERS.CREDENTIAL_ID, userCommand.credentialId())
                .set(USERS.PUBLIC_KEY, userCommand.publicKey())
                .set(USERS.SIGNATURE_COUNT, userCommand.signatureCount())
                .set(USERS.CREATED_BY, userCommand.requestedBy())
                .execute();
    }

    @Override
    public Optional<UsersEntity> getUserByUserId(String userId) {
        return dsl.selectFrom(V_USERS)
                .where(V_USERS.USER_ID.eq(userId))
                .fetchOptionalInto(UsersEntity.class);
    }

    @Override
    public Optional<UsersEntity> getUserByCredentialId(String credentialId) {
        return dsl.selectFrom(V_USERS)
                .where(V_USERS.CREDENTIAL_ID.eq(credentialId))
                .fetchOptionalInto(UsersEntity.class);
    }

    @Override
    public void updateSignatureCount(String userId, Integer signatureCount, String updatedBy) {
        dsl.update(USERS)
                .set(USERS.SIGNATURE_COUNT, signatureCount)
                .set(USERS.UPDATED_AT, currentOffsetDateTime())
                .set(USERS.UPDATED_BY, updatedBy)
                .where(USERS.USER_ID.eq(userId))
                .execute();
    }
}
