import React, { useState } from "react";

export default function EmailRecipeSender() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState(null); // 'success' | 'error' | null
  const [loading, setLoading] = useState(false);

  const sendEmail = async () => {
    setLoading(true);
    setStatus(null);
    try {
      const response = await fetch(
        "https://recipe-mailer-backend-production.up.railway.app/send-single-email",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email: email }),
        }
      );

      if (response.ok) {
        setStatus("success");
        setEmail(""); // Clear input on success
      } else {
        throw new Error("Failed to send email");
      }
    } catch (err) {
      console.error(err);
      setStatus("error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-20 p-6 bg-white rounded-2xl shadow-lg">
      <h2 className="text-2xl font-semibold mb-4 text-center">🍽️ Get a Random Recipe</h2>
      <input
        type="email"
        placeholder="Enter your email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="w-full px-4 py-2 mb-4 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      <button
        onClick={sendEmail}
        disabled={!email || loading}
        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition duration-200 disabled:opacity-50"
      >
        {loading ? "Sending..." : "Send Me a Recipe 🍳"}
      </button>

      {status === "success" && (
        <p className="mt-4 text-green-600 text-center">✅ Email sent successfully!</p>
      )}
      {status === "error" && (
        <p className="mt-4 text-red-600 text-center">❌ Failed to send email. Please try again.</p>
      )}
    </div>
  );
}
