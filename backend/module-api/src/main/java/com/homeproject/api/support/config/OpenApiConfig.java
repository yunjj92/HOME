package com.homeproject.api.support.config;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Info;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class OpenApiConfig {

    @Bean
    public OpenAPI setOpenAPIInfo(){
        return new OpenAPI().info(new Info()
                .title("Project HOME")
                .description("백엔드 멀티 모듈 API 명세서")
        .version("1.0"));
    }

}
