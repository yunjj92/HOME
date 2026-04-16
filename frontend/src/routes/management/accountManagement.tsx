import { createFileRoute } from "@tanstack/react-router";
import { AccountManagementView } from "../../views/management/AccountManagementView";

export const Route = createFileRoute('/account')({
  component: AccountManagementView, // UI 컴포넌트를 가져와서 연결
})