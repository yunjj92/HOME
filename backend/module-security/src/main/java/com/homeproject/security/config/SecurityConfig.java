package com.homeproject.security.config;

import com.homeproject.security.jwt.JwtAuthenticationFilter;
import com.homeproject.security.jwt.JwtTokenProvider;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
@EnableWebSecurity
@RequiredArgsConstructor
public class SecurityConfig {
    private final JwtTokenProvider jwtTokenProvider;

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
                // 1. CSRF 및 HTTP Basic 인증 비활성화 (JWT를 사용하므로)
                .csrf(AbstractHttpConfigurer::disable)
                .httpBasic(AbstractHttpConfigurer::disable)
                .formLogin(AbstractHttpConfigurer::disable)

                // 2. 세션 정책: Stateless 설정 (JWT의 핵심)
                .sessionManagement(session ->
                        session.sessionCreationPolicy(SessionCreationPolicy.STATELESS)
                )

                // 3. 인가(Authorization) 설정
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers("/api/login", "/api/signup", "/swagger-ui/index.html").permitAll() // 로그인, 회원가입은 허용
                        // 2. Swagger UI 관련 경로 허용
                        .requestMatchers(
                                "/v3/api-docs/**",          // OpenAPI 명세 경로
                                "/swagger-ui/**",           // Swagger UI HTML 페이지
                                "/swagger-ui.html",         // 구버전 호환용
                                "/swagger-resources/**",    // Swagger 자원
                                "/webjars/**"               // static 자원
                        ).permitAll()
                        .anyRequest().authenticated() // 나머지는 인증 필요
                )

                // 4. JWT 필터 추가
                // UsernamePasswordAuthenticationFilter 실행 전에 우리가 만든 jwtAuthenticationFilter를 먼저 실행
                .addFilterBefore(new JwtAuthenticationFilter(jwtTokenProvider),
                        UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

}
