import axios, { type AxiosRequestConfig } from 'axios';

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
  (error) => {
    if (error.response?.status === 401) {
      // 세션 만료 시 로그인 페이지로 이동하거나 토큰 삭제
      localStorage.removeItem('accessToken');
      window.location.href = '/login'; // 로그인 페이지로 리디렉션
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