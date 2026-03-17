package com.homeproject.security.jwt;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.security.Key;
import java.util.Date;

@Component
public class JwtTokenProvider {
    private final Key key;
    private final long expirationTime;

    // 0.12.x에서는 SecretKey 객체를 직접 다루는 것을 권장합니다.
    public JwtTokenProvider(@Value("${jwt.secret}") String secret,
                            @Value("${jwt.token-validity-in-seconds}") long expirationTime) {
        this.expirationTime = expirationTime;
        // 0.12.x 방식: Keys.hmacShaKeyFor 이용
        this.key = Keys.hmacShaKeyFor(Decoders.BASE64.decode(secret));
    }

    // 토큰 생성: 0.12.x에서는 .claims() 대신 .subject(), .issuedAt() 등을 직접 호출하는 흐름을 권장
    public String createToken(String userId) {
        Date now = new Date();
        Date expiryDate = new Date(now.getTime() + expirationTime);

        return Jwts.builder()
                .subject(userId)
                .issuedAt(now)
                .expiration(expiryDate)
                .signWith(key) // 알고리즘 자동 결정
                .compact();
    }

    // 토큰 검증 및 파싱: parserBuilder()가 사라지고 parser()가 빌더 역할을 겸함
    public boolean validateToken(String token) {
        try {
            Jwts.parser()
                    .verifyWith((SecretKey) key) // 0.12 버전 핵심: verifyWith 사용
                    .build()
                    .parseSignedClaims(token); // parseClaimsJws 대신 사용
            return true;
        } catch (JwtException | IllegalArgumentException e) {
            return false;
        }
    }

    // 인증 정보 가져오기
    public Authentication getAuthentication(String token) {
        Claims claims = Jwts.parser()
                .verifyWith((SecretKey) key)
                .build()
                .parseSignedClaims(token)
                .getPayload(); // getBody() 대신 getPayload() 사용
        
        String userId = claims.getSubject();
        return new UsernamePasswordAuthenticationToken(userId, "", new java.util.ArrayList<>());
    }

}
