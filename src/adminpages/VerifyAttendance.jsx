import React, { useEffect, useState } from "react";
import axios from "axios";
import jsPDF from "jspdf";
import "jspdf-autotable";
import API_URL from "../api";

const VerifyAttendance = () => {
  const [attendanceData, setAttendanceData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState("");
  const [selectedTeacher, setSelectedTeacher] = useState("");

  // Fetch attendance data with required query parameters
  const fetchAttendanceData = async () => {
    try {
      // Optionally, provide default parameters when filters are empty.
      // For example, you might want to fetch records for the current month and a default teacher.
      const teacherParam = selectedTeacher ? selectedTeacher : "all"; 
      // Default to current month (as number string) if no month is selected.
      const currentMonth = new Date().getMonth() + 1; 
      const monthParam = selectedMonth ? selectedMonth : currentMonth.toString();

      const response = await axios.get(`${API_URL}/getAttendanceReport.php`, {
        params: { teacher: teacherParam, month: monthParam },
      });
      setAttendanceData(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      console.error("Error fetching data", error);
      setAttendanceData([]); // Reset data on error
    }
  };

  // Refetch data whenever selected filters change
  useEffect(() => {
    fetchAttendanceData();
  }, [selectedMonth, selectedTeacher]);

  // Further client-side filtering (if needed) based on the filters
  useEffect(() => {
    filterData();
  }, [attendanceData, selectedMonth, selectedTeacher]);

  const filterData = () => {
    let filtered = attendanceData;

    if (selectedMonth) {
      filtered = filtered.filter((item) =>
        new Date(item.date).getMonth() + 1 === parseInt(selectedMonth)
      );
    }

    if (selectedTeacher) {
      filtered = filtered.filter((item) =>
        item.teacher_name.toLowerCase().includes(selectedTeacher.toLowerCase())
      );
    }

    setFilteredData(filtered);
  };

  const calculateTotalFee = () => {
    return Array.isArray(filteredData)
      ? filteredData.reduce((acc, item) => acc + parseFloat(item.fee || 0), 0)
      : 0;
  };

  const handleVerify = async (id) => {
    try {
      await axios.post("http://localhost/api/verifyAttendanceByAdmin.php", { id });
      // Re-fetch the data after successful verification
      fetchAttendanceData();
    } catch (error) {
      console.error("Failed to verify", error);
    }
  };

  const exportPDF = () => {
    const doc = new jsPDF();
    doc.text("Attendance Report", 14, 10);
    doc.autoTable({
      head: [["Date", "Teacher", "Hours", "Fee", "Status"]],
      body: filteredData.map((item) => [
        item.date,
        item.teacher_name,
        item.hours,
        `Rp ${item.fee}`,
        item.status,
      ]),
    });
    doc.text(`Total Fee: Rp ${calculateTotalFee()}`, 14, doc.lastAutoTable.finalY + 10);
    doc.save("attendance_report.pdf");
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Teacher Attendance Records</h2>

      <div className="flex flex-col md:flex-row gap-4 mb-4">
        <select
          value={selectedMonth}
          onChange={(e) => setSelectedMonth(e.target.value)}
          className="p-2 border rounded-md"
        >
          <option value="">Filter by Month</option>
          {[...Array(12)].map((_, i) => (
            <option value={i + 1} key={i}>
              {new Date(0, i).toLocaleString("default", { month: "long" })}
            </option>
          ))}
        </select>

        <input
          type="text"
          placeholder="Search by teacher name"
          value={selectedTeacher}
          onChange={(e) => setSelectedTeacher(e.target.value)}
          className="p-2 border rounded-md"
        />
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-300">
          <thead className="bg-gray-200">
            <tr>
              <th className="p-2 border">Date</th>
              <th className="p-2 border">Teacher</th>
              <th className="p-2 border">Hours</th>
              <th className="p-2 border">Fee</th>
              <th className="p-2 border">Status</th>
              <th className="p-2 border">Action</th>
            </tr>
          </thead>
          <tbody>
            {Array.isArray(filteredData) && filteredData.length > 0 ? (
              filteredData.map((item) => (
                <tr key={item.id} className="text-center border-t">
                  <td className="p-2 border">{item.date}</td>
                  <td className="p-2 border">{item.teacher_name}</td>
                  <td className="p-2 border">{item.hours}</td>
                  <td className="p-2 border">Rp {item.fee}</td>
                  <td className="p-2 border">{item.status}</td>
                  <td className="p-2 border">
                    {item.status !== "Verified" && (
                      <button
                        onClick={() => handleVerify(item.id)}
                        className="px-2 py-1 bg-green-500 text-white rounded"
                      >
                        Verify
                      </button>
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="text-center p-2">
                  No data available for the selected filters.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="mt-4 flex justify-between items-center">
        <p className="text-lg font-semibold">Total Fee: Rp {calculateTotalFee()}</p>
        <button
          onClick={exportPDF}
          className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
        >
          Export to PDF
        </button>
      </div>
    </div>
  );
};

export default VerifyAttendance;
