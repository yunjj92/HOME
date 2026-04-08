
import ReactDOM from 'react-dom/client'
import { RouterProvider, createRouter } from '@tanstack/react-router'

// 1. 자동 생성된 라우트 트리를 가져옵니다.
// (파일을 만들고 저장했다면 플러그인이 자동으로 생성해줬을 거예요!)
import { routeTree } from './routeTree.gen.ts'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { BrowserRouter } from 'react-router-dom'
const queryClient = new QueryClient();
// 2. 라우터 인스턴스를 생성합니다.
const router = createRouter({
  routeTree,
  context: {
    // __root.tsx에서 정의했던 MyRouterContext 타입에 맞춰 데이터를 넣습니다.
    // 지금은 비어있어도 되지만, 나중에 auth나 queryClient를 여기서 넘겨줍니다.
  },
})

// 3. 타입 안전성을 위해 라우터 인스턴스의 타입을 등록합니다.
declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}

// 4. 앱 렌더링
const rootElement = document.getElementById('root')!
if (!rootElement.innerHTML) {
  const root = ReactDOM.createRoot(rootElement)
  root.render(
    <BrowserRouter>
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={router} />
      </QueryClientProvider>
       {/* 라우터 프로바이더로 앱을 감싸줍니다. */}
       {/* 이제 라우터가 앱 전체에서 사용할 수 있게 됩니다! */}
       {/* 라우터가 제공하는 context를 통해 useRoute, useSearchParams 등 다양한 훅을 사용할 수 있습니다. */}
       {/* 라우트 컴포넌트에서는 route.loader에서 반환한 데이터도 사용할 수 있습니다. */}
       {/* 예시: const data = useRouteLoaderData() */}
       {/* 라우터가 제공하는 context를 통해 useRoute, useSearchParams 등 다양한 훅을 사용할 수 있습니다. */}
       {/* 라우트 컴포넌트에서는 route.loader에서 반환한 데이터도 사용할 수 있습니다. */}
       {/* 예시: const data = useRouteLoaderData() */}
    </BrowserRouter>,
  )
}