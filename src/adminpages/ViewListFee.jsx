import React, { useState, useEffect } from "react";
import API_URL from "../api"; // Adjust API URL as needed

const ViewListFee = () => {
  const [fees, setFees] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState("2025-02");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch fees from backend
  const fetchFees = async (month) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`${API_URL}/fetchFees.php`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ selectedMonth: month }),
      });

      if (!response.ok) throw new Error("Failed to fetch fees");

      const result = await response.json();
      if (result.success) {
        setFees(result.data);
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

  useEffect(() => {
    fetchFees(selectedMonth);
  }, [selectedMonth]);

  // Handle payment update
  const handlePayment = async (index, payment_id) => {
    try {
      const response = await fetch(`${API_URL}/updateFeeStatus.php`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ payment_id, status: "Paid" }),
      });

      if (!response.ok) throw new Error("Failed to update status");

      const updatedFees = [...fees];
      updatedFees[index].status = "Paid";
      setFees(updatedFees);
    } catch (err) {
      console.error("Error updating payment status:", err);
    }
  };

  const calculateDeadline = (dateString) => {
    const date = new Date(dateString);
    date.setMonth(date.getMonth() + 1);
    date.setDate(5);
    return date.toISOString().split("T")[0];
  };

  const filteredFees = fees.filter((fee) => fee.date.startsWith(selectedMonth));

  return (
    <div className="p-4">
      <h2 className="text-xl font-semibold mb-4">Teacher Fee - Unpaid</h2>

      <div className="mb-4">
        <label className="mr-2 font-medium">Select Month:</label>
        <input
          type="month"
          value={selectedMonth}
          onChange={(e) => setSelectedMonth(e.target.value)}
          className="border p-2 rounded-lg"
        />
      </div>

      {loading && <p className="text-center text-gray-500">Loading...</p>}
      {error && <p className="text-center text-red-500">{error}</p>}

      <div className="hidden md:block overflow-x-auto mt-4">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-indigo-500 text-white text-left">
              <th className="p-2">Teacher Name</th>
              <th className="p-2">Total Fee</th>
              <th className="p-2">Payment Deadline</th>
              <th className="p-2">Status</th>
              <th className="p-2">Action</th>
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
                  <td className="p-2">{fee.status || "Not Paid"}</td>
                  <td className="p-2">
                    {fee.status === "Paid" ? (
                      <span className="text-green-500 font-semibold">Paid</span>
                    ) : (
                      <button
                        className="bg-green-500 text-white px-3 py-1 rounded-md hover:bg-green-600"
                        onClick={() => handlePayment(index, fee.payment_id)}
                      >
                        💵 Mark as Paid
                      </button>
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="p-4 text-center text-gray-500">
                  There are no unpaid fees for this month.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="md:hidden">
        {filteredFees.length > 0 ? (
          filteredFees.map((fee, index) => (
            <div
              key={index}
              className="border p-4 mb-4 bg-gray-100 rounded-lg shadow-sm"
            >
              <p><strong>Teacher Name:</strong> {fee.teacher}</p>
              <p><strong>Total Fee:</strong> IDR {parseInt(fee.amount).toLocaleString()}</p>
              <p className="text-red-500 font-semibold">
                <strong>Payment Deadline:</strong> {calculateDeadline(fee.date)}
              </p>
              <p><strong>Status:</strong> {fee.status || "Not Paid"}</p>
              <button
                className="mt-2 bg-green-500 text-white px-3 py-1 rounded-md hover:bg-green-600"
                onClick={() => handlePayment(index, fee.payment_id)}
              >
                {fee.status === "Paid" ? "Paid" : "Mark as Paid"}
              </button>
            </div>
          ))
        ) : (
          <p className="text-center text-gray-500">
            There are no unpaid fees for this month.
          </p>
        )}
      </div>
    </div>
  );
};

export default ViewListFee;