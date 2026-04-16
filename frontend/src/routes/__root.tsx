import type { QueryClient } from '@tanstack/react-query'
import { createRootRouteWithContext } from '@tanstack/react-router'
import { MainLayout } from '../layouts/MainLayout'
import { TanStackRouterDevtools } from '@tanstack/router-devtools'

// 1. Router Context 타입 정의 (나중에 인증이나 QueryClient를 담을 곳)
interface MyRouterContext {
  queryClient?: QueryClient
}

// 2. Context와 함께 Root Route 생성
export const Route = createRootRouteWithContext<MyRouterContext>()({
  component: () => (
    <>
      <MainLayout />
      <TanStackRouterDevtools />
    </>
  ),
})
