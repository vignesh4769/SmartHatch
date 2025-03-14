import React, { useState } from "react";
import "../../styles/auth.css";
import SignUp from "./SignUp";
import ForgotPassword from "./ForgotPassword";
import InputField from "../../components/InputField";
import Button from "../../components/Button";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showSignUp, setShowSignUp] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Login submitted:", { email, password });
  };

  if (showSignUp) {
    return <SignUp onBack={() => setShowSignUp(false)} />;
  }

  if (showForgotPassword) {
    return <ForgotPassword onBack={() => setShowForgotPassword(false)} />;
  }

  return (
    <div className="container">
      <h2>Login</h2>
      <form onSubmit={handleSubmit} className="form-container">
        <InputField label="Email" type="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)} />
        <InputField label="Password" type="password" id="password" value={password} onChange={(e) => setPassword(e.target.value)} />
        <Button text="Login" className="btn btn-outline btn-info" />
      </form>
      <div>
        <Button text="Forgot Password?" className="btn btn-outline btn-error" onClick={() => setShowForgotPassword(true)} />
        <p>
          Don't have an account?{" "}
          <Button text="Sign Up" className="link-button" onClick={() => setShowSignUp(true)} />
        </p>
      </div>
    </div>
  );
}

export default Login;
