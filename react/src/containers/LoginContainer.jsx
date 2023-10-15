// import { useState } from "react";
import { useAuth, useSigninCheck } from "reactfire";
import LoginForm from "../components/auth/LoginForm";
import { signInWithEmailAndPassword } from "firebase/auth";
// import { useNavigate } from "react-router-dom";
// import { useNavigate } from 'react-router-dom'

function LogInContainer() {
  const auth = useAuth();
  const { status, data } = useSigninCheck();
  const error = "";
  if (!status === "success") return null;

  if (data?.signedIn === true) window.location.href = "/";

  // const navigate = useNavigate()
  const handleLogin = async ({ email, password }) => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (error) {
      // setError("Email or Password are incorrect");
    }
  };

  return <LoginForm onSubmit={handleLogin} error={error} />;
}

export default LogInContainer;
