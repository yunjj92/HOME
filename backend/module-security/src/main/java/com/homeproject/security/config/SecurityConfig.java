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
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.List;

@Configuration
@EnableWebSecurity
@RequiredArgsConstructor
public class SecurityConfig {
    private final JwtTokenProvider jwtTokenProvider;

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
                // 1. CORS 설정 추가
                .cors(cors -> cors.configurationSource(corsConfigurationSource()))

                // 2. CSRF 및 HTTP Basic 인증 비활성화
                .csrf(AbstractHttpConfigurer::disable)
                .httpBasic(AbstractHttpConfigurer::disable)
                .formLogin(AbstractHttpConfigurer::disable)

                // 3. 세션 정책: Stateless 설정
                .sessionManagement(session ->
                        session.sessionCreationPolicy(SessionCreationPolicy.STATELESS)
                )

                // 4. 인가(Authorization) 설정
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers(
                                "/**"
                        ).permitAll()
                        .anyRequest().authenticated()
                )

                // 5. JWT 필터 추가
                .addFilterBefore(new JwtAuthenticationFilter(jwtTokenProvider),
                        UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    // CORS 세부 설정을 위한 Bean 추가
    @Bean
    public CorsConfigurationSource
    corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();

        // 허용할 프론트엔드 도메인 (실제 사용하는 주소로 변경하세요)
        configuration.setAllowedOriginPatterns(List.of("http://localhost:5173", "http://localhost:8080"));

        // 허용할 HTTP 메서드
        configuration.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS"));

        // 허용할 헤더 (Authorization 포함 필수)
        configuration.setAllowedHeaders(List.of("Authorization", "Content-Type", "Cache-Control"));

        // 자격 증명(Cookie 등) 허용 여부
        configuration.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }

}
