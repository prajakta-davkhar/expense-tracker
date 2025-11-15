import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

export default function Signup() {
  const { signup } = useContext(AuthContext);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Handle input changes
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (formData.password !== formData.confirmPassword) {
      setError("⚠️ Passwords do not match!");
      return;
    }

    try {
      setLoading(true);

      const res = await signup(formData.name, formData.email, formData.password);

      if (!res.success) {
        setError(res.message || "Signup failed. Please try again.");
        return;
      }

      navigate("/dashboard");
    } catch (err) {
      console.error("❌ Signup Error:", err);
      setError("Signup failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900 px-4 transition-colors duration-300">
      <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-lg w-full max-w-md transition-colors duration-300">
        <h2 className="text-3xl font-extrabold text-center mb-6 text-blue-600 dark:text-blue-400">
          Create Account ✨
        </h2>

        <form onSubmit={handleSubmit} className="space-y-5">
          {["name", "email", "password", "confirmPassword"].map((field) => (
            <div key={field}>
              <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">
                {field === "name"
                  ? "Full Name"
                  : field === "email"
                  ? "Email"
                  : field === "password"
                  ? "Password"
                  : "Confirm Password"}
              </label>
              <input
                type={field.includes("password") ? "password" : "text"}
                name={field}
                value={formData[field]}
                onChange={handleChange}
                placeholder={`Enter your ${field.replace(/([A-Z])/g, " $1").toLowerCase()}`}
                required
                autoComplete={field === "email" ? "email" : "new-password"}
                className="w-full p-3 border rounded-lg dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none transition-colors duration-300"
              />
            </div>
          ))}

          {error && <p className="text-red-500 text-sm text-center font-medium mt-2">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3 rounded-lg font-semibold text-white transition ${
              loading ? "bg-blue-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            {loading ? "Creating Account..." : "Sign Up"}
          </button>
        </form>

        <p className="text-sm text-center mt-6 text-gray-600 dark:text-gray-300">
          Already have an account?{" "}
          <button
            onClick={() => navigate("/login")}
            className="text-blue-600 dark:text-blue-400 font-semibold hover:underline"
          >
            Login
          </button>
        </p>
      </div>
    </div>
  );
}
