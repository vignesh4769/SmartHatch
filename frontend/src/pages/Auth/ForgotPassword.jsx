import React, { useState } from "react";
import "../../styles/auth.css";
import InputField from "../../components/InputField";
import Button from "../../components/Button";

function ForgotPassword({ onBack }) {
  const [email, setEmail] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Password reset email sent to:", email);
  };

  return (
    <div className="container">
      <h2>Forgot Password</h2>
      <form onSubmit={handleSubmit} className="form-container">
        <InputField label="Email" type="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)} />
        <Button text="Reset Password" className="btn btn-outline btn-info" />
      </form>
      <Button text="Back to Login" className="btn btn-outline" onClick={onBack} />
    </div>
  );
}

export default ForgotPassword;
