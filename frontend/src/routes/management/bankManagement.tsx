import { createFileRoute } from "@tanstack/react-router";
import { BankManagementView } from "../../views/management/BankManagementView";

export const Route = createFileRoute('/bank')({
  component: BankManagementView, // UI 컴포넌트를 가져와서 연결
});