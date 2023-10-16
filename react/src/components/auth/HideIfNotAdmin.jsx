import { useSigninCheck } from "reactfire";

const HideIfNotAdmin = ({ children }) => {
  const { status, data } = useSigninCheck({
    requiredClaims: { isAdmin: true },
  });
  if (!status === "success") return null;
  if (status === "success" && data.hasRequiredClaims === true) return children;
  return null;
};

export default HideIfNotAdmin;
