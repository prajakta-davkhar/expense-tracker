import { useState } from "react";
import { Link } from "react-router-dom";

export default function ResetPassword() {
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [show, setShow] = useState(false);
  const [strength, setStrength] = useState("");

  const checkStrength = (value) => {
    if (value.length < 6) return "Weak";
    if (/[A-Z]/.test(value) && /[0-9]/.test(value) && /[@$!%*?&#]/.test(value))
      return "Strong";
    return "Medium";
  };

  const handleChange = (value) => {
    setPassword(value);
    setStrength(checkStrength(value));
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 to-blue-100">
      <div className="bg-white shadow-xl rounded-2xl p-8 w-full max-w-md">
        <h1 className="text-2xl font-bold text-center text-indigo-700 mb-6">
          🔒 Reset Password
        </h1>

        <div className="mb-4">
          <label className="block font-medium mb-2">New Password</label>
          <div className="relative">
            <input
              type={show ? "text" : "password"}
              value={password}
              onChange={(e) => handleChange(e.target.value)}
              placeholder="Enter new password"
              className="w-full border rounded-lg px-3 py-2 pr-10 focus:ring-2 focus:ring-indigo-500"
            />
            <span
              className="absolute right-3 top-2 cursor-pointer text-gray-500"
              onClick={() => setShow(!show)}
            >
              {show ? "🙈" : "👁️"}
            </span>
          </div>
          {password && (
            <p
              className={`mt-1 text-sm ${
                strength === "Weak"
                  ? "text-red-500"
                  : strength === "Medium"
                  ? "text-yellow-500"
                  : "text-green-600"
              }`}
            >
              Strength: {strength}
            </p>
          )}
        </div>

        <div className="mb-6">
          <label className="block font-medium mb-2">Confirm Password</label>
          <input
            type="password"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            placeholder="Confirm password"
            className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500"
          />
          {confirm && confirm !== password && (
            <p className="text-sm text-red-500 mt-1">
              Passwords do not match ⚠️
            </p>
          )}
        </div>

        <button className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded-lg font-semibold">
          Reset Password
        </button>

        <div className="text-center mt-4">
          <Link
            to="/settings"
            className="text-sm text-indigo-600 hover:underline"
          >
            ← Back to Settings
          </Link>
        </div>
      </div>
    </div>
  );
}
