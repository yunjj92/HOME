import type { LoginResponse } from "../../../api/model";
import { base64urlToBuffer } from "@github/webauthn-json/extended";

const prepareLoginOptions = (data: LoginResponse): PublicKeyCredentialRequestOptions=> { 

const preparedLoginOptions = {
    
    allowCredentials: data.allowCredentials?.map(cred => ({
        id: base64urlToBuffer(cred.id ?? ""), // base64url 문자열을 ArrayBuffer로 변환
        transports: Array.isArray(cred.transport) ? cred.transport : new Array(cred.transport ?? ""), // transports가 배열인지 확인 후 설정
        type: cred.type as PublicKeyCredentialType || "public-key",
    })) || [],
    challenge: base64urlToBuffer(data.challenge ?? ""),
     // base64url 문자열을 ArrayBuffer로 변환
    timeout: data.timeout,  
    rpId: data.rpId,
    userVerification: data.userVerification,
    
} as PublicKeyCredentialRequestOptions; 


return preparedLoginOptions

}

export { prepareLoginOptions };


