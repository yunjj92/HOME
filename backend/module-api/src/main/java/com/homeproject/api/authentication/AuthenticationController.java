package com.homeproject.api.authentication;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.homeproject.api.authentication.request.FinalizedRegistrationRequest;
import com.homeproject.api.authentication.response.LoginResponse;
import com.homeproject.api.authentication.response.StartRegistrationResponse;
import com.homeproject.api.wrapper.ApiResponse;
import com.homeproject.security.jwt.JwtTokenProvider;
import com.homeproject.security.jwt.RefreshTokenService;
import com.homeproject.security.jwt.TokenResponse;
import com.homeproject.security.webauthn.WebAuthnProcessor;
import com.homeproject.security.webauthn.param.FinalizedLoginParam;
import com.homeproject.security.webauthn.param.FinalizedRegistrationParam;
import com.homeproject.security.webauthn.result.UserLoginResult;
import com.homeproject.security.webauthn.result.UserRegistrationResult;
import com.yubico.webauthn.AssertionRequest;
import com.yubico.webauthn.AssertionResult;
import com.yubico.webauthn.data.PublicKeyCredential;
import com.yubico.webauthn.data.PublicKeyCredentialCreationOptions;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Tag(name="auth", description  = "사용자 인증 및 로그인 API")
@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthenticationController {

    private final WebAuthnProcessor webAuthnProcessor;
    private final JwtTokenProvider jwtTokenProvider;
    private final RefreshTokenService refreshTokenService;
    private final ObjectMapper objectMapper;
    // In-memory store for challenges. In a production app, use Redis or a proper session.
    private final Map<String, PublicKeyCredentialCreationOptions> registrationOptionsStore = new ConcurrentHashMap<>();


    private final Map<String, AssertionRequest> assertionRequestStore = new ConcurrentHashMap<>();

    @Operation
    @PostMapping("/register/options")
    public ApiResponse<StartRegistrationResponse> startRegistration(@RequestParam String username){
        try {
            UserRegistrationResult userRegistrationResult = webAuthnProcessor.startRegistration(username);
            registrationOptionsStore.put(username, userRegistrationResult.creationOptions());
            return ApiResponse.success(StartRegistrationResponse.from(userRegistrationResult));
        } catch (Exception e) {
            return ApiResponse.error(e.getMessage(), "");
        }
    }

    @PostMapping("/register/finish")
    public void finishRegistration(@RequestBody FinalizedRegistrationRequest finalizedRegistrationRequest) throws Exception {
        String username = finalizedRegistrationRequest.getUsername();
        FinalizedRegistrationParam finalizedRegistrationParam
                = new FinalizedRegistrationParam(
                username,
                registrationOptionsStore.get(username),
                PublicKeyCredential.parseRegistrationResponseJson(finalizedRegistrationRequest.getResponseJson())
        );

        webAuthnProcessor.finishRegistration(finalizedRegistrationParam);
        registrationOptionsStore.remove(username);

    }

    @PostMapping("/login/options")
    public ApiResponse<LoginResponse> startLogin(@RequestParam String username){
        try{
            UserLoginResult loginResult = webAuthnProcessor.startAssertion(username);
            assertionRequestStore.put(username, loginResult.assertionRequest());
            return ApiResponse.success(LoginResponse.from(loginResult));
        } catch (Exception e) {
            return ApiResponse.error(e.getMessage(), "");
        }
    }

    @PostMapping("/login/finish")
    public ApiResponse<TokenResponse> finishLogin(@RequestParam String username, @RequestBody String responseJson) throws Exception {

        try {
            AssertionRequest request = assertionRequestStore.get(username);
            if (request == null) {
                throw new RuntimeException("Assertion request not found");
            }

            FinalizedLoginParam finalizedLoginParam = new FinalizedLoginParam(username, request, PublicKeyCredential.parseAssertionResponseJson(responseJson));

            AssertionResult result = webAuthnProcessor.finishAssertion(finalizedLoginParam);

            if(!result.isSuccess()) {
                throw new RuntimeException("Authentication failed");
            }

            assertionRequestStore.remove(username);
            return ApiResponse.success(refreshTokenService.createTokens(username));
        } catch (Exception e) {
            return ApiResponse.error(e.getMessage(), "");
        }
    }

    @PostMapping("/refresh")
    public ApiResponse<TokenResponse> refresh(@RequestParam String refreshToken) {
        try {
            return ApiResponse.success(refreshTokenService.refresh(refreshToken));
        } catch (Exception e) {
            return ApiResponse.error(e.getMessage(), "");
        }
    }

    @PostMapping("/logout")
    public ApiResponse<Void> logout(@RequestParam String refreshToken) {
        try {
            refreshTokenService.logout(refreshToken);
            return ApiResponse.success(null);
        } catch (Exception e) {
            return ApiResponse.error(e.getMessage(), "");
        }
    }

}
