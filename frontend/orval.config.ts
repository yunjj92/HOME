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
      mode: 'split',
      override: {
        query: {
          useQuery: true,
          useInfinite: false,
          useMutation: true,
        },
        mutator: {
          path: 'src/custom/config/axios-instance.ts',
          name: 'axiosInstance',
        },
      },
    },
  },
});