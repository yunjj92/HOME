import { createFileRoute } from "@tanstack/react-router";
import LoginForm from "../components/authentication/LoginForm";

export const Route = createFileRoute('/login')({
  component: LoginForm, 
})
