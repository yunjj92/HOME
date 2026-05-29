import { createFileRoute } from "@tanstack/react-router";
import { MinistryManagementView } from "../../views/management/MinistryManagementView";

export const Route = createFileRoute('/ministry')({
  component: MinistryManagementView, // UI 컴포넌트를 가져와서 연결
});