import type { QueryClient } from '@tanstack/react-query'
import { createRootRouteWithContext } from '@tanstack/react-router'
import { MainLayout } from '../components/common/layouts/MainLayout'
import { TanStackRouterDevtools } from '@tanstack/router-devtools'

interface MyRouterContext {
  queryClient?: QueryClient
}

export const Route = createRootRouteWithContext<MyRouterContext>()({
  component: () => (
    <>
      <MainLayout />
      <TanStackRouterDevtools />
    </>
  ),
})
