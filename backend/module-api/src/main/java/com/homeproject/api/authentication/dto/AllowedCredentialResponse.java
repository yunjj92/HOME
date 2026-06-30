package com.homeproject.api.authentication.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;

@Builder(toBuilder = true)
@Getter
@AllArgsConstructor
public class AllowedCredentialResponse {

    String type;
    String id;
    String transport;



}
