import { createFileRoute } from "@tanstack/react-router";
import { CodeManagementView } from "../../views/management/CodeManagementView";

export const Route = createFileRoute('/management/code')({
  component: CodeManagementView, 
});
