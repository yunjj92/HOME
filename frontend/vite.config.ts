import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { tanstackRouter } from '@tanstack/router-plugin/vite'

export default defineConfig({
  plugins: [    
    tanstackRouter({
      target: 'react',
      autoCodeSplitting: true,
    }),
    react(), 
    tailwindcss()],
  server: {
    port: 5173,
    proxy: {
      // 경로가 /api로 시작하는 요청을 대상으로 합니다.
      '/api': {
        target: 'http://localhost:8080', // 백엔드 서버 주소
        changeOrigin: true,             // 대상 서버의 호스트 헤더를 target 주소로 변경
        secure: false,                  // SSL 검증 생략 (개발 환경용)
        // 만약 백엔드 URL에서 /api를 떼고 싶다면 아래 설정 추가
        // rewrite: (path) => path.replace(/^\/api/, '')
      },
    },
  }, 
  test: {
    environment: "jsdom",
    setupFiles: "./src/test/setup.ts",
  },
  build: {
    target: 'es2020' // or 'esnext'
  }
});