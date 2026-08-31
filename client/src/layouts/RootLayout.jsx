import { Outlet } from "react-router-dom";
import PageMeta from "../components/common/PageMeta";

export default function RootLayout() {
  return (
    <>
      <PageMeta />

      <Outlet />
    </>
  );
}
