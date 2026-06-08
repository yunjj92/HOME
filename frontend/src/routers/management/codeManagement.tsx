import { createFileRoute } from "@tanstack/react-router";
import { CodeManagementView } from "../../views/management/CodeManagementView";

export const Route = createFileRoute('/code')({
  component: CodeManagementView, // UI 컴포넌트를 가져와서 연결
});