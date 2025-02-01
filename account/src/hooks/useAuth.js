import { useSelector } from "react-redux";

export const useAuth = () => {
  const isLoggedIn = useSelector((state) => state.login.isLoggedIn);
  return { isLoggedIn };
};
