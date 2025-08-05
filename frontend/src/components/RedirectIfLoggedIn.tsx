import type { JSX } from "react";
import { Navigate } from "react-router-dom";
import useUserStore from "../store/user.store";

const RedirectIfLoggedIn = ({ children }: { children: JSX.Element }) => {
  const isAuthChecked = useUserStore((state) => state.isAuthChecked);
  const isUserLoggedIn = useUserStore((state) => state.isUserLoggedIn);

  if (!isAuthChecked) return null;

  return isUserLoggedIn ? <Navigate to="/" replace /> : children;
};

export default RedirectIfLoggedIn;
