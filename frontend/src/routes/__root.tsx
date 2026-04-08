import { createRootRouteWithContext, Outlet } from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/router-devtools'

// 1. Router Context 타입 정의 (나중에 인증이나 QueryClient를 담을 곳)
interface MyRouterContext {
  // 여기에 전역적으로 필요한 객체 타입을 정의합니다.
  // 예: auth: AuthStatus
}

// 2. Context와 함께 Root Route 생성
export const Route = createRootRouteWithContext<MyRouterContext>()({
  component: RootComponent,
})

function RootComponent() {
  return (
    <>
      <hr />

      {/* 하위 라우트들이 렌더링되는 지점 (중요!) */}
      <main style={{ padding: '1rem' }}>
        <Outlet />
      </main>

      {/* 개발 모드에서 라우트 구조를 볼 수 있는 도구 (선택 사항) */}
      <TanStackRouterDevtools position="bottom-right" />
    </>
  )
}