import { base64urlToBuffer } from "@github/webauthn-json/extended";
import type { StartRegistrationResponse } from "../../../api/model";


/**
 * 백엔드 데이터를 WebAuthn 옵션으로 변환하는 함수
 */
const prepareCreationOptions = (data: StartRegistrationResponse): CredentialCreationOptions => {

  return {
    publicKey: {
      // 1. RP 정보
      rp: {
        id: data.rpId,
        name: "home-project", // 서비스 이름
      },
      // 2. 유저 정보 (ID는 반드시 Buffer여야 함)
      user: {
        id:base64urlToBuffer(data.userId ?? ""), // userId가 없으면 기본값 사용
        name: data.username ?? "",
        displayName: data.displayName ?? "",
      },
      // 3. 챌린지 (반드시 Buffer여야 함)
      challenge: base64urlToBuffer(data.challenge ?? ''), // challenge가 없으면 기본값 사용
      
      // 4. 필수 알고리즘 설정
      pubKeyCredParams: [
        { type: "public-key", alg: -7 },   // ES256 (P-256)
        { type: "public-key", alg: -257 }, // RS256
      ],
      
      timeout: 60000,
      attestation: "none",
      authenticatorSelection: {
        residentKey: "preferred",
        userVerification: "preferred",
      },
    },
  };
};

export { prepareCreationOptions };