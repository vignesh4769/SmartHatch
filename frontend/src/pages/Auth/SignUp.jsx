import React, { useState } from "react";
import "../../styles/auth.css";
import InputField from "../../components/InputField";
import Button from "../../components/Button";

function SignUp({ onBack }) {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Sign-Up submitted:", { username, email, password });
  };

  return (
    <div className="container">
      <h2>Sign Up</h2>
      <form onSubmit={handleSubmit} className="form-container">
        <InputField label="Username" type="text" id="username" value={username} onChange={(e) => setUsername(e.target.value)} />
        <InputField label="Email" type="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)} />
        <InputField label="Password" type="password" id="password" value={password} onChange={(e) => setPassword(e.target.value)} />
        <Button text="Sign Up" className="btn btn-outline btn-success" />
      </form>
      <Button text="Back to Login" className="btn btn-outline" onClick={onBack} />
    </div>
  );
}

export default SignUp;
