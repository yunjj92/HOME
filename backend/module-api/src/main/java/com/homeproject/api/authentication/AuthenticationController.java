package com.homeproject.api.authentication;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.homeproject.api.authentication.dto.FinalizedRegistrationRequest;
import com.homeproject.api.authentication.dto.LoginResponse;
import com.homeproject.api.authentication.dto.StartRegistrationResponse;
import com.homeproject.api.support.exception.ApiErrorCode;
import com.homeproject.api.support.exception.ApiException;
import com.homeproject.api.support.wrapper.ApiResponse;
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
        UserRegistrationResult userRegistrationResult = webAuthnProcessor.startRegistration(username);
        registrationOptionsStore.put(username, userRegistrationResult.creationOptions());
        return ApiResponse.success(StartRegistrationResponse.from(userRegistrationResult));
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
            throw new ApiException(ApiErrorCode.AUTH_LOGIN_FAILED);
        }
    }

    @PostMapping("/login/finish")
    public ApiResponse<TokenResponse> finishLogin(@RequestParam String username, @RequestBody String responseJson) throws Exception {
        AssertionRequest request = assertionRequestStore.get(username);

        if (request == null) {
            throw new ApiException(ApiErrorCode.AUTH_CHALLENGE_EXPIRED);
        }

        AssertionResult result;
        try {
            FinalizedLoginParam finalizedLoginParam = new FinalizedLoginParam(username, request, PublicKeyCredential.parseAssertionResponseJson(responseJson));

            result = webAuthnProcessor.finishAssertion(finalizedLoginParam);
        } catch (Exception e) {
            throw new ApiException(ApiErrorCode.AUTH_ASSERTION_INVALID);
        }

        if(!result.isSuccess()) {
            throw new ApiException(ApiErrorCode.AUTH_LOGIN_FAILED);
        }

        assertionRequestStore.remove(username);
        return ApiResponse.success(refreshTokenService.createTokens(username));
    }

    @PostMapping("/refresh")
    public ApiResponse<TokenResponse> refresh(@RequestParam String refreshToken) {
        return ApiResponse.success(refreshTokenService.refresh(refreshToken));
    }

    @PostMapping("/logout")
    public ApiResponse<Void> logout(@RequestParam String refreshToken) {
        refreshTokenService.logout(refreshToken);
        return ApiResponse.success(null);
    }
}
