import { useState } from "react";
import Form from "./Form";
import type { FormValues } from "./Form";

import "./App.css";

function App() {
  const [isLogin, setIsLogin] = useState(false);

  const handleFormSubmit = (data: FormValues) => {
    console.log("Data from child form:", data);
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-xl flex flex-col items-center">
        {isLogin ? (
          <>
            <Form
              includeEmail={true}
              includePassword={true}
              onSubmit={handleFormSubmit}
              header="Welcome Back"
              txt="Enter your email below to sign in to your account"
            />
            <p className="my-6 text-sm  text-gray-300">
              Don't have an account?{" "}
              <button
                onClick={() => setIsLogin(false)}
                className="text-[#2072d6] underline cursor-pointer"
              >
                Sign Up
              </button>
            </p>
          </>
        ) : (
          <>
            <Form
              includeFirstName={true}
              includeLastName={true}
              includeEmail={true}
              includePassword={true}
              includeConfirmPassword={true}
              onSubmit={handleFormSubmit}
              header="Welcome"
              txt="Pleas sign up"
            />
            <p className="my-6 text-sm text-gray-300">
              Already have an account?{" "}
              <button
                onClick={() => setIsLogin(true)}
                className="text-[#2072d6] underline cursor-pointer"
              >
                Sign In
              </button>
            </p>
          </>
        )}
      </div>
    </div>
  );
}

export default App;
