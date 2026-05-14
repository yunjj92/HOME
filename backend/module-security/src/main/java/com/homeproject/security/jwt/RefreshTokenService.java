package com.homeproject.security.jwt;

import com.homeproject.db.jooq.tables.pojos.RefreshTokensEntity;
import com.homeproject.db.users.RefreshTokenRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.OffsetDateTime;

@Service
@RequiredArgsConstructor
public class RefreshTokenService {

    private final RefreshTokenRepository refreshTokenRepository;
    private final JwtTokenProvider jwtTokenProvider;

    @Value("${jwt.refresh-token-validity-in-millis}")
    private long refreshTokenExpirationTime;

    @Transactional
    public TokenResponse createTokens(String userId) {
        String accessToken = jwtTokenProvider.createAccessToken(userId);
        String refreshToken = jwtTokenProvider.createRefreshToken(userId);

        // Delete existing refresh tokens for the user (single session policy)
        refreshTokenRepository.deleteByUserId(userId);

        RefreshTokensEntity refreshTokenEntity = new RefreshTokensEntity();
        refreshTokenEntity.setUserId(userId);
        refreshTokenEntity.setToken(refreshToken);
        refreshTokenEntity.setExpiryDate(OffsetDateTime.now().plusWeeks(2)); // Simplified for now, should use refreshTokenExpirationTime

        refreshTokenRepository.save(refreshTokenEntity);

        return TokenResponse.builder()
                .accessToken(accessToken)
                .refreshToken(refreshToken)
                .build();
    }

    @Transactional
    public TokenResponse refresh(String refreshToken) {
        if (!jwtTokenProvider.validateToken(refreshToken)) {
            throw new RuntimeException("Invalid refresh token");
        }

        RefreshTokensEntity entity = refreshTokenRepository.findByToken(refreshToken)
                .orElseThrow(() -> new RuntimeException("Refresh token not found in database"));

        if (entity.getExpiryDate().isBefore(OffsetDateTime.now())) {
            refreshTokenRepository.deleteByToken(refreshToken);
            throw new RuntimeException("Refresh token expired");
        }

        String userId = entity.getUserId();
        String newAccessToken = jwtTokenProvider.createAccessToken(userId);
        String newRefreshToken = jwtTokenProvider.createRefreshToken(userId);

        // Rotate refresh token
        refreshTokenRepository.deleteByToken(refreshToken);

        RefreshTokensEntity newEntity = new RefreshTokensEntity();
        newEntity.setUserId(userId);
        newEntity.setToken(newRefreshToken);
        newEntity.setExpiryDate(OffsetDateTime.now().plusWeeks(2)); // Match validity

        refreshTokenRepository.save(newEntity);

        return TokenResponse.builder()
                .accessToken(newAccessToken)
                .refreshToken(newRefreshToken)
                .build();
    }

    @Transactional
    public void logout(String refreshToken) {
        refreshTokenRepository.deleteByToken(refreshToken);
    }
}
