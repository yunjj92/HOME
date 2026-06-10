import { createFileRoute } from "@tanstack/react-router";
import { RegistrationView } from "../views/authentication/RegistrationView";

export const Route = createFileRoute('/')({
  component: RegistrationView, 
})
