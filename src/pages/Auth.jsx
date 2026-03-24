import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginUser, registerUser } from "../appwriteAuth";

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (isLogin) {
        await loginUser(email, password);
      } else {
        await registerUser(email, password, name);
        await loginUser(email, password);
      }

      navigate("/");
      window.location.reload();
    } catch (error) {
      alert(error?.message || "Something went wrong.");
    }
  };

  return (
    <main>
      <div className="pattern" />

      <div className="wrapper auth-page">
        <div className="auth-card">
          <h1>{isLogin ? "Login" : "Register"}</h1>

          <form onSubmit={handleSubmit} className="auth-form">
            {!isLogin && (
              <input
                type="text"
                placeholder="Your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            )}

            <input
              type="email"
              placeholder="Your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <input
              type="password"
              placeholder="Your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            <button type="submit">
              {isLogin ? "Login" : "Create Account"}
            </button>
          </form>

          <p className="switch-auth" onClick={() => setIsLogin(!isLogin)}>
            {isLogin
              ? "Don't have an account? Register"
              : "Already have an account? Login"}
          </p>
        </div>
      </div>
    </main>
  );
};

export default Auth;