package com.homeproject.security.webauthn;

import com.homeproject.db.repository.ConfigRepository;
import com.yubico.webauthn.*;
import com.yubico.webauthn.data.*;
import com.yubico.webauthn.data.exception.Base64UrlException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.util.Arrays;
import java.util.Collections;
import java.util.HashSet;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@Slf4j
@RequiredArgsConstructor
public class WebAuthnService {

    private final ConfigRepository configRepository;

    @Value("${webauthn.relying-party.id}")
    private String rpId;

    @Value("${webauthn.relying-party.name}")
    private String rpName;

    @Value("${webauthn.relying-party.origins}")
    private String origins;

    private RelyingParty getRelyingParty() {
        Set<String> originSet = Arrays.stream(origins.split(","))
                .map(String::trim)
                .collect(Collectors.toSet());

        return RelyingParty.builder()
                .identity(RelyingPartyIdentity.builder()
                        .id(rpId)
                        .name(rpName)
                        .build())
                .credentialRepository(new ConfigCredentialRepository())
                .origins(originSet)
                .build();
    }

    public PublicKeyCredentialCreationOptions startRegistration(String username) {
        UserIdentity user = UserIdentity.builder()
                .name(username)
                .displayName(username)
                .id(new ByteArray(username.getBytes()))
                .build();

        return getRelyingParty().startRegistration(StartRegistrationOptions.builder()
                .user(user)
                .build());
    }

    public RegistrationResult finishRegistration(String username, PublicKeyCredentialCreationOptions options, PublicKeyCredential<AuthenticatorAttestationResponse, ClientRegistrationExtensionOutputs> pkc) throws Exception {
        RegistrationResult response = getRelyingParty().finishRegistration(FinishRegistrationOptions.builder()
                .request(options)
                .response(pkc)
                .build());

        log.info("Registration successful for user: {}", username);
        String credId = response.getKeyId().getId().getBase64Url();
        log.info("Credential ID: {}", credId);

        configRepository.setValue("AUTH_ID", username);
        configRepository.setValue("AUTH_CREDENTIAL_ID", credId);
        configRepository.setValue("AUTH_PUBLIC_KEY", response.getPublicKeyCose().getBase64Url());
        configRepository.setValue("AUTH_SIGNATURE_COUNT", String.valueOf(response.getSignatureCount()));

        return response;
    }

    public AssertionRequest startAssertion(String username) {
        return getRelyingParty().startAssertion(StartAssertionOptions.builder()
                .username(Optional.of(username))
                .build());
    }

    public AssertionResult finishAssertion(String username, AssertionRequest request, PublicKeyCredential<AuthenticatorAssertionResponse, ClientAssertionExtensionOutputs> pkc) throws Exception {
        AssertionResult response = getRelyingParty().finishAssertion(FinishAssertionOptions.builder()
                .request(request)
                .response(pkc)
                .build());

        if (response.isSuccess()) {
             configRepository.setValue("AUTH_SIGNATURE_COUNT", String.valueOf(response.getSignatureCount()));
        }

        return response;
    }

    private class ConfigCredentialRepository implements CredentialRepository {
        @Override
        public Set<PublicKeyCredentialDescriptor> getCredentialIdsForUsername(String username) {
            String storedId = configRepository.getValue("AUTH_ID");
            if (username.equals(storedId)) {
                String credentialId = configRepository.getValue("AUTH_CREDENTIAL_ID");
                if (credentialId != null) {
                    try {
                        return Collections.singleton(PublicKeyCredentialDescriptor.builder()
                                .id(ByteArray.fromBase64Url(credentialId))
                                .build());
                    } catch (Base64UrlException e) {
                        log.error("Failed to decode credential ID", e);
                    }
                }
            }
            return Collections.emptySet();
        }

        @Override
        public Set<RegisteredCredential> lookupAll(ByteArray credentialId) {
             String incomingId = credentialId.getBase64Url();
             String storedCredentialId = configRepository.getValue("AUTH_CREDENTIAL_ID");
             
             log.info("LookupAll - Incoming ID: {}", incomingId);
             log.info("LookupAll - Stored ID: {}", storedCredentialId);

             if (storedCredentialId != null && incomingId.equals(storedCredentialId)) {
                 String publicKey = configRepository.getValue("AUTH_PUBLIC_KEY");
                 String sigCountStr = configRepository.getValue("AUTH_SIGNATURE_COUNT");
                 long signatureCount = sigCountStr != null ? Long.parseLong(sigCountStr) : 0;
                 String storedId = configRepository.getValue("AUTH_ID");
                 
                 try {
                     return Collections.singleton(RegisteredCredential.builder()
                             .credentialId(credentialId)
                             .userHandle(new ByteArray(storedId.getBytes()))
                             .publicKeyCose(ByteArray.fromBase64Url(publicKey))
                             .signatureCount(signatureCount)
                             .build());
                 } catch (Base64UrlException e) {
                     log.error("Failed to decode public key", e);
                 }
             }
             return Collections.emptySet();
        }

        @Override
        public Optional<ByteArray> getUserHandleForUsername(String username) {
             String storedId = configRepository.getValue("AUTH_ID");
             if (username.equals(storedId)) {
                 return Optional.of(new ByteArray(username.getBytes()));
             }
             return Optional.empty();
        }

        @Override
        public Optional<String> getUsernameForUserHandle(ByteArray userHandle) {
            String username = new String(userHandle.getBytes());
            String storedId = configRepository.getValue("AUTH_ID");
            if (username.equals(storedId)) {
                return Optional.of(username);
            }
            return Optional.empty();
        }

        @Override
        public Optional<RegisteredCredential> lookup(ByteArray credentialId, ByteArray userHandle) {
             String incomingId = credentialId.getBase64Url();
             String storedCredentialId = configRepository.getValue("AUTH_CREDENTIAL_ID");
             
             log.info("Lookup - Incoming ID: {}", incomingId);
             log.info("Lookup - Stored ID: {}", storedCredentialId);
             log.info("Lookup - Incoming UserHandle: {}", userHandle.getBase64Url());

             // For single-user project, if the credential ID matches what we have, 
             // we return it even if the userHandle from browser is empty/null
             if (storedCredentialId != null && incomingId.equals(storedCredentialId)) {
                 String publicKey = configRepository.getValue("AUTH_PUBLIC_KEY");
                 String sigCountStr = configRepository.getValue("AUTH_SIGNATURE_COUNT");
                 long signatureCount = sigCountStr != null ? Long.parseLong(sigCountStr) : 0;
                 String storedId = configRepository.getValue("AUTH_ID");
                 
                 try {
                     return Optional.of(RegisteredCredential.builder()
                             .credentialId(credentialId)
                             .userHandle(new ByteArray(storedId.getBytes()))
                             .publicKeyCose(ByteArray.fromBase64Url(publicKey))
                             .signatureCount(signatureCount)
                             .build());
                 } catch (Base64UrlException e) {
                     log.error("Failed to decode public key", e);
                 }
             }
             return Optional.empty();
        }
    }
}
