import { createFileRoute } from "@tanstack/react-router";
import LoginForm from "../../components/auth/LoginForm";

export const Route = createFileRoute('/login')({
  component: LoginForm, // UI 컴포넌트를 가져와서 연결
})