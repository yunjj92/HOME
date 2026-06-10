import { createFileRoute } from "@tanstack/react-router";
import { MainHomeView } from "../views/home/MainHomeView";

export const Route = createFileRoute('/home')({
  component: MainHomeView, 
})
