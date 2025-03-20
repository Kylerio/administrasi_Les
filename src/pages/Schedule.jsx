import React, { useState } from 'react'

const Schedule = () => {
  const [filter, setFilter] = useState("all");
  const [schedules, setSchedules] = useState([
    { id: 1, date: "2025-03-10", startTime: "10:00", duration: "1 Hours", student: "Budi", location: "Pesanggrahan", status: "Verified" },
    { id: 2, date: "2025-03-12", startTime: "14:00", duration: "3 Hours", student: "Siti", location: "BXC", status: "Pending" },
    { id: 3, date: "2025-03-15", startTime: "09:00", duration: "2 Hours", student: "Andi", location: "Bintaro", status: "Verified" },
  ]);

  // Filter jadwal berdasarkan status
  const filteredSchedules = filter === "all" ? schedules : schedules.filter(s => s.status === filter);

  // Fungsi untuk verifikasi absen (ubah status menjadi "Completed")
  const handleVerifyAttendance = (id) => {
    const updatedSchedules = schedules.map(schedule =>
      schedule.id === id ? { ...schedule, status: "Completed" } : schedule
    );
    setSchedules(updatedSchedules);
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-semibold mb-4">teacher Schedules</h2>

      {/* Filter */}
      <div className="mb-4">
        <select 
          className="p-2 border rounded-lg" 
          value={filter} 
          onChange={(e) => setFilter(e.target.value)}
        >
          <option value="all">All Schedules</option>
          <option value="Verified">Already Verified</option>
          <option value="Pending">Not Verified</option>
        </select>
      </div>

      {/* Tabel Jadwal di desktop */}
      <div className="hidden md:block overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow-md">
          <thead className="bg-indigo-500 text-white">
            <tr>
              <th className="p-2">Date</th>
              <th className="p-2">Start Time</th>
              <th className="p-2">Duration</th>
              <th className="p-2">Student</th>
              <th className="p-2">Location</th>
              <th className="p-2">Status</th>
              <th className="p-2">Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredSchedules.length > 0 ? (
              filteredSchedules.map((schedule) => (
                <tr key={schedule.id} className="text-center border-t">
                  <td className="p-2">{schedule.date}</td>
                  <td className="p-2">{schedule.startTime}</td>
                  <td className="p-2">{schedule.duration}</td>
                  <td className="p-2">{schedule.student}</td>
                  <td className="p-2">{schedule.location}</td>
                  <td className={`p-2 font-semibold 
                    ${schedule.status === "Verified" ? "text-green-600" : schedule.status === "Completed" ? "text-gray-600" : "text-red-500"}`}>
                    {schedule.status}
                  </td>
                  <td className="p-2">
                    {schedule.status === "Verified" && (
                      <button 
                        onClick={() => handleVerifyAttendance(schedule.id)}
                        className="px-3 py-1 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                      >
                        ✅ Attendance Verification
                      </button>
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="p-4 text-center text-gray-500">No schedule available yet.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Tampilkan list di HP */}
      <div className="md:hidden">
        {filteredSchedules.length > 0 ? (
          filteredSchedules.map((schedule) => (
            <div key={schedule.id} className="border p-4 mb-4 rounded-lg shadow">
              <p><strong>Date:</strong> {schedule.date}</p>
              <p><strong>Start Time:</strong> {schedule.startTime}</p>
              <p><strong>Duration:</strong> {schedule.duration}</p>
              <p><strong>Student:</strong> {schedule.student}</p>
              <p><strong>Location:</strong> {schedule.location}</p>
              <p className={`font-semibold 
                ${schedule.status === "Verified" ? "text-green-600" : schedule.status === "Completed" ? "text-gray-600" : "text-red-500"}`}>
                <strong>Status:</strong> {schedule.status}
              </p>
              {schedule.status === "Verified" && (
                <button 
                  onClick={() => handleVerifyAttendance(schedule.id)}
                  className="w-full mt-2 px-3 py-1 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                >
                  ✅ Attendance Verification
                </button>
              )}
            </div>
          ))
        ) : (
          <p className="text-center text-gray-500">No schedule available yet.</p>
        )}
      </div>
    </div>
  )
}

export default Schedule