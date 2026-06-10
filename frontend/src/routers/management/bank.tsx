import { createFileRoute } from "@tanstack/react-router";
import { BankManagementView } from "../../views/management/BankManagementView";

export const Route = createFileRoute('/management/bank')({
  component: BankManagementView, 
});
