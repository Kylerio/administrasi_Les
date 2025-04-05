import React, { useEffect, useState } from "react";
import API_URL from "../api"; // Import the base API URL

const Fee = () => {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchFees = async () => {
      try {
        const teacherId = localStorage.getItem("id");

        if (!teacherId) {
          throw new Error("Teacher ID not found. Please log in again.");
        }

        // Use API_URL for the endpoint
        const response = await fetch(`${API_URL}/fees.php?teacher_id=${teacherId}`);

        if (!response.ok) {
          throw new Error("Failed to fetch fees. Please check the backend.");
        }

        const data = await response.json();

        if (data.success) {
          // Combine lessons and payments data
          const combinedSessions = data.lessons.map((lesson) => ({
            id: lesson.lesson_id,
            date: lesson.date,
            day: new Date(lesson.date).toLocaleDateString("en-US", { weekday: "long" }),
            duration: parseFloat(lesson.duration),
            rate: 200000, // Example rate, replace with actual logic if needed
            verified: true, // Example status, replace with actual logic if needed
            paid: data.payments.some(
              (payment) => payment.payment_date === lesson.date && payment.amount >= 200000
            ),
          }));

          setSessions(combinedSessions);
        } else {
          throw new Error(data.message || "Failed to fetch fees.");
        }
      } catch (err) {
        console.error("Error fetching fees:", err.message);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchFees();
  }, []);

  // Calculate total fees
  const totalFeePaid = sessions
    .filter((session) => session.paid)
    .reduce((total, session) => total + session.duration * session.rate, 0);

  const totalFeePending = sessions
    .filter((session) => !session.verified)
    .reduce((total, session) => total + session.duration * session.rate, 0);

  const totalFeeUnpaid = sessions
    .filter((session) => session.verified && !session.paid)
    .reduce((total, session) => total + session.duration * session.rate, 0);

  return (
    <div className="p-4 sm:p-6">
      {/* Section Title */}
      <h1 className="text-lg sm:text-xl font-semibold mb-4">Fee Details</h1>

      {loading ? (
        <p className="text-gray-500">Loading...</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : (
        <>
          {/* Summary Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            <div className="bg-white shadow-md rounded-lg p-4 sm:p-6 border border-green-300">
              <p className="text-xs sm:text-sm text-gray-600">Total Fee Paid</p>
              <h2 className="text-lg sm:text-2xl font-bold text-green-600">
                IDR {totalFeePaid.toLocaleString()}
              </h2>
            </div>
            <div className="bg-white shadow-md rounded-lg p-4 sm:p-6 border border-yellow-300">
              <p className="text-xs sm:text-sm text-gray-600">Fee Pending Verification</p>
              <h2 className="text-lg sm:text-2xl font-bold text-yellow-500">
                IDR {totalFeePending.toLocaleString()}
              </h2>
            </div>
            <div className="bg-white shadow-md rounded-lg p-4 sm:p-6 border border-red-300">
              <p className="text-xs sm:text-sm text-gray-600">Fee Not Paid</p>
              <h2 className="text-lg sm:text-2xl font-bold text-red-500">
                IDR {totalFeeUnpaid.toLocaleString()}
              </h2>
            </div>
          </div>

          {/* Fee History Table */}
          <div className="mt-6 bg-white shadow-md rounded-lg overflow-hidden">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-indigo-100 text-indigo-800 text-sm sm:text-base">
                  <th className="p-2 sm:p-4 text-left">Date</th>
                  <th className="p-2 sm:p-4 text-left">Day</th>
                  <th className="p-2 sm:p-4 text-right">Duration</th>
                  <th className="p-2 sm:p-4 text-right">Fee</th>
                  <th className="p-2 sm:p-4 text-center">Status</th>
                </tr>
              </thead>
              <tbody>
                {sessions.map((session) => (
                  <tr key={session.id} className="border-b hover:bg-gray-50">
                    <td className="p-2 sm:p-4">{session.date}</td>
                    <td className="p-2 sm:p-4">{session.day}</td>
                    <td className="p-2 sm:p-4 text-right">{session.duration} Hours</td>
                    <td className="p-2 sm:p-4 text-right">
                      IDR {(session.duration * session.rate).toLocaleString()}
                    </td>
                    <td className="p-2 sm:p-4 text-center">
                      {session.paid ? (
                        <span className="text-green-600 font-semibold">✅ Paid</span>
                      ) : session.verified ? (
                        <span className="text-red-500 font-semibold">🕒 Not Paid</span>
                      ) : (
                        <span className="text-yellow-500 font-semibold">⏳ Pending Verification</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* No Sessions Message */}
          {sessions.length === 0 && (
            <div className="mt-6 p-4 sm:p-6 bg-gray-100 rounded-lg text-center text-gray-500">
              There have been no sessions that generated fees this month.
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Fee;