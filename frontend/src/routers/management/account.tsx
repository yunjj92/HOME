import { createFileRoute } from "@tanstack/react-router";
import { AccountManagementView } from "../../views/management/AccountManagementView";

export const Route = createFileRoute('/management/account')({
  component: AccountManagementView, 
})
