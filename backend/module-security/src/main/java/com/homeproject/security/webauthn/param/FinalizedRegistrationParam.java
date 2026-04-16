package com.homeproject.security.webauthn.param;

import com.yubico.webauthn.data.AuthenticatorAttestationResponse;
import com.yubico.webauthn.data.ClientRegistrationExtensionOutputs;
import com.yubico.webauthn.data.PublicKeyCredential;
import com.yubico.webauthn.data.PublicKeyCredentialCreationOptions;
import jakarta.validation.constraints.NotNull;

public record FinalizedRegistrationParam  (
        String username
        , @NotNull PublicKeyCredentialCreationOptions options
        , PublicKeyCredential<AuthenticatorAttestationResponse, ClientRegistrationExtensionOutputs> pkc
)
{

}
