import { createFileRoute } from "@tanstack/react-router";
import { RegistrationView } from "../../views/auth/RegistrationView";

export const Route = createFileRoute('/')({
  component: RegistrationView, // UI 컴포넌트를 가져와서 연결
})