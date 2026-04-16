package com.homeproject.security.webauthn.result;

import com.yubico.webauthn.data.PublicKeyCredentialCreationOptions;

public record UserRegistrationResult(
        String userName,
        PublicKeyCredentialCreationOptions creationOptions
) {

}
