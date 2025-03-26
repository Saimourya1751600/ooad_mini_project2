import React, { useState } from 'react';
import '../styles/LoginSignup.css';

const LoginSignup = () => {
  const [isLogin, setIsLogin] = useState(true);

  return (
    <div className="login-signup">
      <h2>{isLogin ? 'Login' : 'Signup'}</h2>
      <form>
        {!isLogin && <input type="text" placeholder="Username" />}
        <input type="email" placeholder="Email" />
        <input type="password" placeholder="Password" />
        <button type="submit">{isLogin ? 'Login' : 'Signup'}</button>
      </form>
      <p onClick={() => setIsLogin(!isLogin)}>
        {isLogin ? 'New user? Sign up here' : 'Already have an account? Login'}
      </p>
    </div>
  );
};

export default LoginSignup;
