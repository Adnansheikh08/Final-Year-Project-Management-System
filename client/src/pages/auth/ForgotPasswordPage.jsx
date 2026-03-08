import { useState } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { forgotPassword } from "../../store/slices/authSlice";

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errors, setErrors] = useState("");
  const dispatch = useDispatch();
  const { isRequestingForToken } = useSelector((state) => state.auth);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) {
      setErrors("Email is required");
      return;
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
      setErrors("Email is invalid");
      return;
    }
    setErrors("");
    try{
      await dispatch(forgotPassword({ email })).unwrap();
      setIsSubmitted(true);
    }catch(error){
      setErrors(error.error || "Failed to send reset link");
    }

  }

  if (isSubmitted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100"> 
        <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-md text-center">
          <h2 className="text-2xl font-bold mb-4">Reset Link Sent</h2>
          <p className="mb-6">If an account with that email exists, a reset link has been sent.</p>
          <Link to="/login" className="text-indigo-600 hover:text-indigo-800 font-medium">Back to Login</Link>
          <button
              onClick={() => {
                setIsSubmitted(false);
                setEmail("");
              }}
              className="w-full mt-4 bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500" 
            >Request Again
          </button>
        </div>

      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-4">Enter your Email and we will send a reset password link</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              type="email"
              disabled={isRequestingForToken}
              id="email"
             value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
          {errors && (
            <div className="text-red-500 text-sm mb-4">{errors}</div>
          )}
          <button
            type="submit"
            disabled={isRequestingForToken}
            className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            {isRequestingForToken ? "Sending..." : "Send Reset Link"}
          </button>
        </form>
          <div className="mt-4 text-center">
            <Link to="/login" className="text-indigo-600 hover:text-indigo-800 font-medium">Remember you Password?</Link>
          </div>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
