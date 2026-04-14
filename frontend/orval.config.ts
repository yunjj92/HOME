import { defineConfig } from 'orval';

export default defineConfig({
  home: {
    input: {
      target: 'http://localhost:8080/v3/api-docs',
    },
    output: {
      target: 'src/api/generated.ts',
      schemas: 'src/api/model',
      client: 'react-query',
      httpClient: 'axios',
      override: {
        query: {
          useQuery: true,
          useInfinite: false,
          useMutation: true,
          useInvalidate: true,
          signal: true,
          // ✅ 여기에 추가하세요!
          options: {
            staleTime: Infinity, // 앱이 켜져 있는 동안 데이터를 'fresh'하게 유지
            refetchOnWindowFocus: false, // 창 포커스 시 재호출 방지
          },
        },
        mutator: {
          path: 'src/custom/config/axios-instance.ts',
          name: 'axiosInstance',
        },
      },
    },
  },
});