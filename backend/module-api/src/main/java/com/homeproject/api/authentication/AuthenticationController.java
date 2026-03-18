package com.homeproject.api.authentication;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.homeproject.security.jwt.JwtTokenProvider;
import com.homeproject.security.webauthn.WebAuthnService;
import com.yubico.webauthn.AssertionRequest;
import com.yubico.webauthn.AssertionResult;
import com.yubico.webauthn.RegistrationResult;
import com.yubico.webauthn.data.PublicKeyCredential;
import com.yubico.webauthn.data.AuthenticatorAssertionResponse;
import com.yubico.webauthn.data.AuthenticatorAttestationResponse;
import com.yubico.webauthn.data.ClientAssertionExtensionOutputs;
import com.yubico.webauthn.data.ClientRegistrationExtensionOutputs;
import com.yubico.webauthn.data.PublicKeyCredentialCreationOptions;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthenticationController {

    private final WebAuthnService webAuthnService;
    private final JwtTokenProvider jwtTokenProvider;
    private final ObjectMapper objectMapper;

    // In-memory store for challenges. In a production app, use Redis or a proper session.
    private final Map<String, PublicKeyCredentialCreationOptions> registrationOptionsStore = new ConcurrentHashMap<>();
    private final Map<String, AssertionRequest> assertionRequestStore = new ConcurrentHashMap<>();

    @PostMapping("/register/options")
    public String startRegistration(@RequestParam String username) throws Exception {
        PublicKeyCredentialCreationOptions options = webAuthnService.startRegistration(username);
        registrationOptionsStore.put(username, options);
        return objectMapper.writeValueAsString(options);
    }

    @PostMapping("/register/finish")
    public void finishRegistration(@RequestParam String username, @RequestBody String responseJson) throws Exception {
        PublicKeyCredentialCreationOptions options = registrationOptionsStore.get(username);
        if (options == null) {
            throw new RuntimeException("Registration options not found");
        }

        PublicKeyCredential<AuthenticatorAttestationResponse, ClientRegistrationExtensionOutputs> pkc =
                PublicKeyCredential.parseRegistrationResponseJson(responseJson);

        RegistrationResult result = webAuthnService.finishRegistration(username, options, pkc);
        registrationOptionsStore.remove(username);
    }

    @PostMapping("/login/options")
    public String startLogin(@RequestParam String username) throws Exception {
        AssertionRequest request = webAuthnService.startAssertion(username);
        assertionRequestStore.put(username, request);
        return objectMapper.writeValueAsString(request);
    }

    @PostMapping("/login/finish")
    public String finishLogin(@RequestParam String username, @RequestBody String responseJson) throws Exception {
        AssertionRequest request = assertionRequestStore.get(username);
        if (request == null) {
            throw new RuntimeException("Assertion request not found");
        }

        PublicKeyCredential<AuthenticatorAssertionResponse, ClientAssertionExtensionOutputs> pkc =
                PublicKeyCredential.parseAssertionResponseJson(responseJson);

        AssertionResult result = webAuthnService.finishAssertion(username, request, pkc);
        if (result.isSuccess()) {
            assertionRequestStore.remove(username);
            return jwtTokenProvider.createToken(username);
        } else {
            throw new RuntimeException("Authentication failed");
        }
    }
}
