package com.homeproject.security.webauthn;

import com.homeproject.db.users.UsersRepository;
import com.homeproject.db.users.dto.UserCommand;
import com.homeproject.security.webauthn.param.FinalizedLoginParam;
import com.homeproject.security.webauthn.param.FinalizedRegistrationParam;
import com.homeproject.security.webauthn.result.UserLoginResult;
import com.homeproject.security.webauthn.result.UserRegistrationResult;
import com.yubico.webauthn.*;
import com.yubico.webauthn.data.*;
import com.yubico.webauthn.data.exception.Base64UrlException;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.Objects;
import java.util.stream.Collectors;

@Service
@Slf4j
public class WebAuthnProcessor {

    private final UsersRepository usersRepository;
    private final RelyingParty relyingParty;

    public WebAuthnProcessor(
            UsersRepository usersRepository,
            @Value("${webauthn.relying-party.id}") String rpId,
            @Value("${webauthn.relying-party.name}") String rpName,
            @Value("${webauthn.relying-party.origins}") String origins
    ) {
        this.usersRepository = usersRepository;

        Set<String> originSet = Arrays.stream(origins.split(","))
                .map(String::trim)
                .collect(Collectors.toSet());

        this.relyingParty = RelyingParty.builder()
                .identity(RelyingPartyIdentity.builder()
                        .id(rpId)
                        .name(rpName)
                        .build())
                .credentialRepository(new DbCredentialRepository())
                .origins(originSet)
                .build();
    }

    public UserRegistrationResult startRegistration(String username) {

        UserIdentity user = UserIdentity.builder()
                .name(username)
                .displayName(username)
                .id(new ByteArray(username.getBytes()))
                .build();

        PublicKeyCredentialCreationOptions credentialCreationOptions = relyingParty.startRegistration(StartRegistrationOptions.builder()
                .user(user)
                .build());

        return new UserRegistrationResult(username,  credentialCreationOptions);
    }

    public RegistrationResult finishRegistration(FinalizedRegistrationParam finalizedRegistrationParam) throws Exception {
        String userName = finalizedRegistrationParam.username();

        RegistrationResult response = relyingParty.finishRegistration(FinishRegistrationOptions.builder()
                .request(finalizedRegistrationParam.options())
                .response(finalizedRegistrationParam.pkc())
                .build());

        log.info("Registration successful for user: {}", userName);
        String credId = response.getKeyId().getId().getBase64Url();
        log.info("Credential ID: {}", credId);

        usersRepository.insertUser(
                new UserCommand(
                        userName,
                        credId,
                        response.getPublicKeyCose().getBase64Url(),
                        (int) (response.getSignatureCount()),
                        userName
                ));

        return response;
    }

    public UserLoginResult startAssertion(String username) {
        AssertionRequest assertionRequest = relyingParty.startAssertion(StartAssertionOptions.builder()
                .username(Optional.of(username))
                .build());

        return new UserLoginResult(username, assertionRequest);
    }

    public AssertionResult finishAssertion(FinalizedLoginParam finalizedLoginParam) throws Exception {
        AssertionResult response = relyingParty.finishAssertion(FinishAssertionOptions.builder()
                .request(finalizedLoginParam.assertionRequest())
                .response(finalizedLoginParam.pkc())
                .build());

        if (response.isSuccess()) {
            usersRepository.updateSignatureCount(
                    finalizedLoginParam.username(),
                    (int) (response.getSignatureCount()),
                    "security-module"
            );
        }

        return response;
    }

    private class DbCredentialRepository implements CredentialRepository {
        @Override
        public Set<PublicKeyCredentialDescriptor> getCredentialIdsForUsername(String username) {
            return usersRepository.getUserByUserId(username)
                    .map(user -> {
                        try {
                            return Collections.singleton(PublicKeyCredentialDescriptor.builder()
                                    .id(ByteArray.fromBase64Url(user.getCredentialId()))
                                    .build());
                        } catch (Base64UrlException e) {
                            log.error("Failed to decode credential ID for user: {}", username, e);
                            return null;
                        }
                    })
                    .filter(Objects::nonNull)
                    .orElse(Collections.emptySet());
        }

        @Override
        public Set<RegisteredCredential> lookupAll(ByteArray credentialId) {
            return usersRepository.getUserByCredentialId(credentialId.getBase64Url())
                    .map(user -> {
                        try {
                            return Collections.singleton(RegisteredCredential.builder()
                                    .credentialId(credentialId)
                                    .userHandle(new ByteArray(user.getUserId().getBytes()))
                                    .publicKeyCose(ByteArray.fromBase64Url(user.getPublicKey()))
                                    .signatureCount(user.getSignatureCount())
                                    .build());
                        } catch (Base64UrlException e) {
                            log.error("Failed to decode public key for user: {}", user.getUserId(), e);
                            return null;
                        }
                    })
                    .filter(Objects::nonNull)
                    .orElse(Collections.emptySet());
        }

        @Override
        public Optional<ByteArray> getUserHandleForUsername(String username) {
            return usersRepository.getUserByUserId(username)
                    .map(user -> new ByteArray(user.getUserId().getBytes()));
        }

        @Override
        public Optional<String> getUsernameForUserHandle(ByteArray userHandle) {
            return Optional.of(new String(userHandle.getBytes()));
        }

        @Override
        public Optional<RegisteredCredential> lookup(ByteArray credentialId, ByteArray userHandle) {
            String userId = new String(userHandle.getBytes());
            return usersRepository.getUserByUserId(userId)
                    .filter(user -> Objects.equals(user.getCredentialId(), credentialId.getBase64Url()))
                    .map(user -> {
                        try {
                            return RegisteredCredential.builder()
                                    .credentialId(credentialId)
                                    .userHandle(userHandle)
                                    .publicKeyCose(ByteArray.fromBase64Url(user.getPublicKey()))
                                    .signatureCount(user.getSignatureCount())
                                    .build();
                        } catch (Base64UrlException e) {
                            log.error("Failed to decode public key for user: {}", user.getUserId(), e);
                            return null;
                        }
                    });
        }
    }
}
