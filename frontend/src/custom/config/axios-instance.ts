import axios, { type AxiosRequestConfig } from 'axios';
import { useAuthStore } from '../../components/auth/stores/authStore';
import { getJwtExpiration } from '../../util/jwt';

export const AXIOS_INSTANCE = axios.create({
  // Vite의 환경 변수를 읽어옵니다.
  baseURL: 'http://localhost:8080', // 실제 API 서버 주소로 변경하세요.
  timeout: 5000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// [기능 1] 모든 요청에 토큰 자동 삽입
AXIOS_INSTANCE.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// [기능 2] 401 에러(토큰 만료) 발생 시 처리
AXIOS_INSTANCE.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      const refreshToken = localStorage.getItem('refreshToken');

      if (refreshToken) {
        try {
          // 리프레시 토큰을 사용하여 새로운 엑세스 토큰 요청
          const response = await axios.get('http://localhost:8080/api/auth/refresh', {
            params: { refreshToken },
          });

          // API 응답 구조에 따라 수정 필요 (예: response.data.data.accessToken)
          // 여기서는 backend가 새로운 accessToken과 refreshToken을 준다고 가정
          const { accessToken: newAccessToken, refreshToken: newRefreshToken } = response.data.data;

          if (newAccessToken) {
            localStorage.setItem('accessToken', newAccessToken);
            if (newRefreshToken) {
              localStorage.setItem('refreshToken', newRefreshToken);
            }
            
            // authStore 업데이트
            const userName = localStorage.getItem('userName') || '';
            const expiry = getJwtExpiration(newAccessToken);
            useAuthStore.getState().login(userName, expiry, newRefreshToken || refreshToken);

            // 원래 요청의 헤더를 새로운 토큰으로 업데이트하고 재시도
            originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
            return AXIOS_INSTANCE(originalRequest);
          }
        } catch (refreshError) {
          // 리프레시 실패 시 로그아웃 처리
          useAuthStore.getState().logout();
          localStorage.removeItem('accessToken');
          localStorage.removeItem('refreshToken');
          localStorage.removeItem('userName');
          window.location.href = '/login';
          return Promise.reject(refreshError);
        }
      } else {
        // 리프레시 토큰이 없으면 로그인 페이지로 이동
        useAuthStore.getState().logout();
        localStorage.removeItem('accessToken');
        localStorage.removeItem('userName');
        window.location.href = '/login';
      }
    }
    return Promise.reject(new Error(error.response?.data?.message || 'An error occurred'));
  }
);

export const axiosInstance = <T>(
  config: AxiosRequestConfig,
  options?: AxiosRequestConfig, // Orval이 추가적인 옵션을 전달할 때 사용
): Promise<T> => {
  const source = axios.CancelToken.source();
  
  // Orval이 생성한 설정과 커스텀 설정을 병합하여 요청 실행
  const promise = AXIOS_INSTANCE({
    ...config,
    ...options,
    cancelToken: source.token,
  }).then(({ data }) => data);

  // @ts-expect-error - Orval adds cancel to the promise
  promise.cancel = () => {
    source.cancel('Query was cancelled by React Query');
  };

  return promise;
};
