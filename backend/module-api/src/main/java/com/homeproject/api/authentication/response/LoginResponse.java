package com.homeproject.api.authentication.response;

import com.homeproject.security.webauthn.result.UserLoginResult;
import com.yubico.webauthn.AssertionRequest;
import com.yubico.webauthn.data.PublicKeyCredentialDescriptor;
import com.yubico.webauthn.data.PublicKeyCredentialRequestOptions;
import lombok.AllArgsConstructor;
import lombok.Getter;

import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

@Getter
@AllArgsConstructor
public class LoginResponse {

    String username;
    String challenge;
    String timeout;
    String rpId;
    List<AllowedCredentialResponse> allowCredentials;
    String userVerification;

    public static LoginResponse from(UserLoginResult  userLoginResult) {

        AssertionRequest assertionRequest = userLoginResult.assertionRequest();
        PublicKeyCredentialRequestOptions requestOptions = assertionRequest.getPublicKeyCredentialRequestOptions();

        List<AllowedCredentialResponse> credentials = requestOptions.getAllowCredentials()
                .orElse(Collections.emptyList())
                .stream()
                .map( descriptor ->
                    AllowedCredentialResponse.builder()
                            .id(descriptor.getId().getBase64Url())
                            .type(descriptor.getType().toString())
                            .transport(descriptor.getTransports().toString()).build()
                ).toList();

        return new LoginResponse(userLoginResult.username(),
                requestOptions.getChallenge().getBase64Url(),
                requestOptions.getTimeout().toString(),
                requestOptions.getRpId(),
                credentials,
                requestOptions.getUserVerification().toString());
    }

}
