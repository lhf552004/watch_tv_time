import { useSigninCheck } from "reactfire";
import LoginContainer from "./LoginContainer";

const AuthCheckContainer = ({ children }) => {
  const { status, data: signInCheckResult } = useSigninCheck();
  if (status === "loading") {
    return <span>loading...</span>;
  }

  if (signInCheckResult.signedIn === true) {
    return children;
  } else {
    return <LoginContainer />;
  }
};

export default AuthCheckContainer;
