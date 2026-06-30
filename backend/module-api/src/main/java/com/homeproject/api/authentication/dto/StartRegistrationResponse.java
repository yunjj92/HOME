package com.homeproject.api.authentication.dto;

import com.homeproject.security.webauthn.result.UserRegistrationResult;
import com.yubico.webauthn.data.ByteArray;
import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class StartRegistrationResponse {

    String username;
    String rpId;
    ByteArray challenge;
    ByteArray userId;
    String displayName;
    String pubKeyCredParams;

    public static StartRegistrationResponse from(UserRegistrationResult userRegistrationResult) {
        return new StartRegistrationResponse(
                userRegistrationResult.userName(),
                userRegistrationResult.creationOptions().getRp().getId(),
                userRegistrationResult.creationOptions().getChallenge(),
                userRegistrationResult.creationOptions().getUser().getId(),
                userRegistrationResult.creationOptions().getUser().getDisplayName(),
                userRegistrationResult.creationOptions().getPubKeyCredParams().toString()
        );
    }

}
