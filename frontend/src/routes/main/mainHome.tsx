import { createFileRoute } from "@tanstack/react-router";
import { MainHomeView } from "../../views/home/MainHomeView";

export const Route = createFileRoute('/home')({
  component: MainHomeView, // UI 컴포넌트를 가져와서 연결
})