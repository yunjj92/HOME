package com.homeproject.api.authentication.response;

import com.homeproject.security.webauthn.result.UserRegistrationResult;
import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class StartRegistrationResponse {

    String username;
    String rpId;
    String challenge;
    String userId;
    String displayName;
    String pubKeyCredParams;

    public static StartRegistrationResponse from(UserRegistrationResult userRegistrationResult) {
        return new StartRegistrationResponse(
                userRegistrationResult.userName(),
                userRegistrationResult.creationOptions().getRp().getId(),
                userRegistrationResult.creationOptions().getChallenge().toString(),
                userRegistrationResult.creationOptions().getUser().getId().toString(),
                userRegistrationResult.creationOptions().getUser().getDisplayName(),
                userRegistrationResult.creationOptions().getPubKeyCredParams().toString()
        );
    }

}
