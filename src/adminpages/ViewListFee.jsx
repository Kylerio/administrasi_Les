import React, { useState, useEffect } from "react";
import API_URL from "../api"; // Import your API base URL

const ViewListFee = () => {
  const [fees, setFees] = useState([]); // State for fees
  const [selectedMonth, setSelectedMonth] = useState("2025-02"); // Default selected month
  const [loading, setLoading] = useState(false); // Loading state
  const [error, setError] = useState(null); // Error state

  // Function to fetch fees from the backend
  const fetchFees = async (month) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`${API_URL}/fetchFees.php`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ selectedMonth: month }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || "Failed to fetch fees");
      }

      const result = await response.json();
      if (result.success) {
        setFees(result.data); // Update fees state with fetched data
      } else {
        throw new Error(result.message || "Failed to fetch fees");
      }
    } catch (err) {
      console.error("Error fetching fees:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Fetch fees when the component mounts or when the selected month changes
  useEffect(() => {
    fetchFees(selectedMonth);
  }, [selectedMonth]);

  // Function to calculate the payment deadline
  const calculateDeadline = (dateString) => {
    const date = new Date(dateString);
    date.setMonth(date.getMonth() + 1); // Move to the next month
    date.setDate(5); // Set to the 5th
    return date.toISOString().split("T")[0]; // Format YYYY-MM-DD
  };

  // Filter fees for the selected month
  const filteredFees = fees.filter((fee) => fee.date.startsWith(selectedMonth));

  return (
    <div className="p-4">
      <h2 className="text-xl font-semibold mb-4">Teacher Fee - Unpaid</h2>

      {/* Month Filter */}
      <div className="mb-4">
        <label className="mr-2 font-medium">Select Month:</label>
        <input
          type="month"
          value={selectedMonth}
          onChange={(e) => setSelectedMonth(e.target.value)}
          className="border p-2 rounded-lg"
        />
      </div>

      {/* Loading and Error States */}
      {loading && <p className="text-center text-gray-500">Loading...</p>}
      {error && <p className="text-center text-red-500">{error}</p>}

      {/* Fee Table - Desktop */}
      <div className="hidden md:block overflow-x-auto mt-4">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-indigo-500 text-white text-left">
              <th className="p-2">Teacher Name</th>
              <th className="p-2">Total Fee</th>
              <th className="p-2">Payment Deadline</th>
            </tr>
          </thead>
          <tbody>
            {filteredFees.length > 0 ? (
              filteredFees.map((fee, index) => (
                <tr key={index} className="border-b hover:bg-indigo-50">
                  <td className="p-2">{fee.teacher}</td>
                  <td className="p-2">IDR {parseInt(fee.amount).toLocaleString()}</td>
                  <td className="p-2 text-red-500 font-semibold">
                    {calculateDeadline(fee.date)}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="3" className="p-4 text-center text-gray-500">
                  There are no fees unpaid for this month.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Fee List - Mobile */}
      <div className="md:hidden">
        {filteredFees.length > 0 ? (
          filteredFees.map((fee, index) => (
            <div
              key={index}
              className="border p-4 mb-4 bg-gray-100 rounded-lg shadow-sm"
            >
              <p>
                <strong>Teacher Name:</strong> {fee.teacher}
              </p>
              <p>
                <strong>Total Fee:</strong> IDR {parseInt(fee.amount).toLocaleString()}
              </p>
              <p className="text-red-500 font-semibold">
                <strong>Payment Deadline:</strong> {calculateDeadline(fee.date)}
              </p>
            </div>
          ))
        ) : (
          <p className="text-center text-gray-500">
            There are no fees unpaid for this month.
          </p>
        )}
      </div>
    </div>
  );
};

export default ViewListFee;