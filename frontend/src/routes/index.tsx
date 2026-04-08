import { createFileRoute } from '@tanstack/react-router'
import RegistrationForm from '../components/auth/registrationForm'

// 1. createFileRoute 함수에 현재 파일의 경로를 정확히 입력합니다.
// 팁: TanStack Router 플러그인이 켜져 있다면 자동 완성이 지원됩니다!
export const Route = createFileRoute('/')({
  component: HomeComponent,
})

function HomeComponent() {
  return (
    <div style={{ padding: '2rem', textAlign: 'center' }}>
      <RegistrationForm />
    </div>
  )
}