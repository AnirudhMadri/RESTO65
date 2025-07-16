"use client";

import { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import Header from "@/components/header/page";

export default function PinLoginPage() {
  const [pin, setPin] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const router = useRouter();

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const res = await axios.post("/api/pinlogin", { pin });
      if (res.data.success) {
        setSuccess(true);
        setLoading(false);
        setPin("");
        setTimeout(() => setSuccess(false), 1000);
        router.push("/homepage");
      } else {
        setError("Incorrect PIN");
        setLoading(false);
      }
    } catch (err) {
      setError("Server error");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <Header />
      <div className="bg-white p-8 rounded-xl shadow-md w-full max-w-sm">
        <h2 className="text-2xl text-black font-bold mb-4 text-center">
          Enter 4-Digit PIN
        </h2>
        <input
          type="password"
          maxLength={4}
          value={pin}
          onChange={(e) => setPin(e.target.value)}
          className="w-full px-4 py-2 text-black border rounded-lg text-lg text-center tracking-widest"
          placeholder="••••"
        />
        <button
          onClick={handleSubmit}
          disabled={loading || success}
          className={`w-full mt-6 py-2 rounded-lg font-bold transition flex items-center justify-center
            ${loading ? "bg-purple-800 text-white" : ""}
            ${success ? "bg-green-600 text-white" : ""}
            ${
              !loading && !success
                ? "bg-purple-800 hover:bg-purple-900 text-white"
                : ""
            }
          `}
        >
          {loading ? (
            <svg
              className="animate-spin h-5 w-5 text-white"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
                fill="none"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
              />
            </svg>
          ) : success ? (
            "Success!"
          ) : (
            "Login"
          )}
        </button>
        {error && <p className="text-red-500 text-center mt-4">{error}</p>}
      </div>
    </div>
  );
}
