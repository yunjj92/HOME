import { createFileRoute } from "@tanstack/react-router";
import { MinistryManagementView } from "../../views/management/MinistryManagementView";

export const Route = createFileRoute('/management/ministry')({
  component: MinistryManagementView, 
});
