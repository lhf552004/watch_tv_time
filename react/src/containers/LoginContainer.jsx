// import { useState } from "react";
import { useAuth, useSigninCheck } from "reactfire";
import LoginForm from "../components/auth/LoginForm";
import { signInWithEmailAndPassword } from "firebase/auth";
// import { useNavigate } from "react-router-dom";
// import { useNavigate } from 'react-router-dom'
import { useToast } from "@chakra-ui/react";
import { MdAdd, MdCheck, MdClose } from "react-icons/md";
function LogInContainer() {
  const auth = useAuth();
  const { status, data } = useSigninCheck();
  const toast = useToast();
  const error = "";
  if (!status === "success") return null;

  if (data?.signedIn === true) window.location.href = "/";

  // const navigate = useNavigate()
  const handleLogin = async ({ email, password }) => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (error) {
      // setError("Email or Password are incorrect");
      console.log(error.code);
      if (
        error.code === "auth/wrong-password" ||
        error.code === "auth/user-not-found" ||
        error.code === "auth/invalid-login-credentials"
      ) {
        console.log("Invalid login credentials.");
        toast({
          title: "Invalid login credentials.",
          status: "error",
        });
        // Handle invalid credentials error.
        // You can also display the error message to the user using `error.message`.
      } else {
        // Handle other types of errors.
        toast({
          title: `Error ${error}`,
          status: "error",
        });
      }
    }
  };

  return <LoginForm onSubmit={handleLogin} error={error} />;
}

export default LogInContainer;
