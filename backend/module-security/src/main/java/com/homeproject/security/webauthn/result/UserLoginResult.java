package com.homeproject.security.webauthn.result;


import com.yubico.webauthn.AssertionRequest;

public record UserLoginResult(String username, AssertionRequest assertionRequest) {
}
