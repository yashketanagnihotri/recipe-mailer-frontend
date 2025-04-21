import React, { useState } from "react";

export default function EmailRecipeSender() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState(null); // 'success' | 'error' | null
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [preferences, setPreferences] = useState({
    breakfast: false,
    lunch: false,
    dinner: false,
  });

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
          body: JSON.stringify({ email }),
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

  const sendPreferences = async () => {
    if (!email) {
      alert("Please enter your email.");
      return;
    }

    try {
      const response = await fetch(
        "https://recipe-mailer-backend-production.up.railway.app/register-meal-preference",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email,
            breakfast: preferences.breakfast,
            lunch: preferences.lunch,
            dinner: preferences.dinner,
          }),
        }
      );

      if (response.ok) {
        alert("Preferences saved successfully!");
        setShowModal(false);
      } else {
        alert("Failed to save preferences.");
      }
    } catch (err) {
      console.error(err);
      alert("An error occurred.");
    }
  };

  const togglePreference = (meal) => {
    setPreferences((prev) => ({
      ...prev,
      [meal]: !prev[meal],
    }));
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
      <div className="flex space-x-2">
        <button
          onClick={sendEmail}
          disabled={!email || loading}
          className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition duration-200 disabled:opacity-50"
        >
          {loading ? "Sending..." : "Send Me a Recipe 🍳"}
        </button>
        <button
          onClick={() => setShowModal(true)}
          className="flex-1 bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-lg transition duration-200"
        >
          Set Preferences ⚙️
        </button>
      </div>

      {status === "success" && (
        <p className="mt-4 text-green-600 text-center">✅ Email sent successfully!</p>
      )}
      {status === "error" && (
        <p className="mt-4 text-red-600 text-center">❌ Failed to send email. Please try again.</p>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40  flex items-center justify-center z-50 backdrop-blur-sm">
          <div className="bg-white rounded-xl p-6 w-full max-w-md shadow-xl">
            <h3 className="text-xl font-semibold mb-4 text-center">📩 Meal Preferences</h3>

            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 mb-4 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />

            <div className="flex flex-col space-y-2 mb-4">
              {["breakfast", "lunch", "dinner"].map((meal) => (
                <label key={meal} className="inline-flex items-center">
                  <input
                    type="checkbox"
                    checked={preferences[meal]}
                    onChange={() => togglePreference(meal)}
                    className="mr-2"
                  />
                  {meal.charAt(0).toUpperCase() + meal.slice(1)}
                </label>
              ))}
            </div>

            <div className="flex justify-end space-x-2">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 bg-gray-300 rounded-lg hover:bg-gray-400"
              >
                Cancel
              </button>
              <button
                onClick={sendPreferences}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Save Preferences
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
