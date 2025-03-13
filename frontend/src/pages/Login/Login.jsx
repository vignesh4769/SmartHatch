// import React, { useState } from "react";
// import "./Login.css";
// import SignUp from "./SignUp";
// import ForgotPassword from "./ForgotPassword";

// function Login() {
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [showSignUp, setShowSignUp] = useState(false);
//   const [showForgotPassword, setShowForgotPassword] = useState(false);

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     console.log("Login submitted:", { email, password });
//   };

//   if (showSignUp) {
//     return <SignUp onBack={() => setShowSignUp(false)} />;
//   }

//   if (showForgotPassword) {
//     return <ForgotPassword onBack={() => setShowForgotPassword(false)} />;
//   }

//   return (
//     <div className="login-container">
//       <h2>Login</h2>
//       <form onSubmit={handleSubmit}>
//         <div className="form-group">
//           <label htmlFor="email">Email:</label>
//           <input
//             type="email"
//             id="email"
//             value={email}
//             onChange={(e) => setEmail(e.target.value)}
//             required
//           />
//         </div>
//         <div className="form-group">
//           <label htmlFor="password">Password:</label>
//           <input
//             type="password"
//             id="password"
//             value={password}
//             onChange={(e) => setPassword(e.target.value)}
//             required
//           />
//         </div>
//         <button type="submit" className="login-button">
//           Login
//         </button>
//       </form>
//       <div className="login-footer">
//         <button
//           className="link-button"
//           onClick={() => setShowForgotPassword(true)}
//         >
//           Forgot Password?
//         </button>
//         <p>
//           Don't have an account?{" "}
//           <button className="link-button" onClick={() => setShowSignUp(true)}>
//             Sign Up
//           </button>
//         </p>
//       </div>
//     </div>
//   );
// }

// export default Login;
