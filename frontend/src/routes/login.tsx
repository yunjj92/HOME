import { createFileRoute } from '@tanstack/react-router'
import LoginForm from '../components/login/loginForm'

export const Route = createFileRoute('/login')({
  component: LoginComponent
})

function LoginComponent() { return <LoginForm /> }
export default Route