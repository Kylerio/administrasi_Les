import React, { useEffect, useState } from "react";
import axios from "axios";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import API_URL from "../api"; // Ensure this points to the correct API endpoint

const VerifyAttendance = () => {
  const [attendanceData, setAttendanceData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [selectedMonth, setSelectedMonth] = useState("");
  const [selectedTeacher, setSelectedTeacher] = useState("");
  const [selectedStudent, setSelectedStudent] = useState("");

  useEffect(() => {
    fetchAttendanceData();
  }, []);

  useEffect(() => {
    filterData();
  }, [attendanceData, selectedMonth, selectedTeacher, selectedStudent]);

  const fetchAttendanceData = async () => {
    try {
      const response = await axios.get(`${API_URL}/getAttendanceReport.php`, {
        params: {
          teacher: selectedTeacher || "",
          month: selectedMonth,
          student: selectedStudent || "",
        },
      });
      setAttendanceData(response.data);
    } catch (error) {
      console.error("Error fetching data", error);
    }
  };

  const filterData = () => {
    let filtered = attendanceData;

    if (selectedMonth) {
      filtered = filtered.filter((item) =>
        item.date.startsWith(selectedMonth)
      );
    }

    if (selectedTeacher) {
      filtered = filtered.filter((item) =>
        item.teacher_name.toLowerCase().includes(selectedTeacher.toLowerCase())
      );
    }

    if (selectedStudent) {
      filtered = filtered.filter((item) =>
        item.student_name.toLowerCase().includes(selectedStudent.toLowerCase())
      );
    }

    setFilteredData(filtered);
  };

  const calculateTotalFee = () => {
    return filteredData.reduce((acc, item) => {
      const feePerHour = parseFloat(item.fee);
      const hours = parseFloat(item.hours);
      return acc + (feePerHour * hours);
    }, 0);
  };

  const handleVerify = async (id) => {
    try {
      await axios.post("http://localhost/api/verifyAttendanceByAdmin.php", { id });
      fetchAttendanceData();
    } catch (error) {
      console.error("Failed to verify", error);
    }
  };

  const exportPDF = () => {
    const doc = new jsPDF();
  
    doc.text("Attendance Report", 14, 10);
  
    autoTable(doc, {
      head: [["Date", "Teacher", "Student", "Hours", "Fee", "Status"]],
      body: filteredData.map((item) => [
        item.date,
        item.teacher_name,
        item.student_name,
        item.hours,
        formatRupiah(item.fee),
        item.status,
      ]),
      startY: 20,
    });
  
    const finalY = doc.lastAutoTable?.finalY || 30;
    doc.text(`Total Fee: ${formatRupiah(calculateTotalFee())}`, 14, finalY + 10);
  
    doc.save("attendance_report.pdf");
  };
  
  const formatRupiah = (angka) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(angka);
  };
  

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Teacher Attendance Records</h2>

      <div className="flex flex-col md:flex-row gap-4 mb-4">
        {/* Month Filter */}
        <div className="flex items-center mb-2 md:mb-0">
          <label className="mr-2 font-medium">Select Month:</label>
          <input
            type="month"
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
            className="border p-2 rounded-lg"
          />
        </div>

        <input
          type="text"
          placeholder="Search by teacher name"
          value={selectedTeacher}
          onChange={(e) => setSelectedTeacher(e.target.value)}
          className="p-2 border rounded-md"
        />

        <input
          type="text"
          placeholder="Search by student name"
          value={selectedStudent}
          onChange={(e) => setSelectedStudent(e.target.value)}
          className="p-2 border rounded-md"
        />
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-300">
          <thead className="bg-gray-200">
            <tr>
              <th className="p-2 border">Date</th>
              <th className="p-2 border">Teacher</th>
              <th className="p-2 border">Student</th>
              <th className="p-2 border">Hours</th>
              <th className="p-2 border">Fee</th>
              <th className="p-2 border">Status</th>
              <th className="p-2 border">Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredData.map((item) => (
              <tr key={item.id}>
                <td className="p-2 border">{item.date}</td>
                <td className="p-2 border">{item.teacher_name}</td>
                <td className="p-2 border">{item.student_name}</td>
                <td className="p-2 border">{item.hours}</td>
                <td className="p-2 border">{formatRupiah(item.fee)}</td>
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
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-4 flex justify-between items-center">
        <p className="text-lg font-semibold">Total Fee: {formatRupiah(calculateTotalFee())}</p>
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
