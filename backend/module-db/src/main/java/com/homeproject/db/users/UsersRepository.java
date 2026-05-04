package com.homeproject.db.users;

import com.homeproject.db.jooq.tables.pojos.UsersEntity;
import com.homeproject.db.users.dto.UserCommand;

import java.util.Optional;

public interface UsersRepository {
    void insertUser(UserCommand userCommand);
    Optional<UsersEntity> getUserByUserId(String userId);
    Optional<UsersEntity> getUserByCredentialId(String credentialId);
    void updateSignatureCount(String userId, Integer signatureCount, String updatedBy);
}
