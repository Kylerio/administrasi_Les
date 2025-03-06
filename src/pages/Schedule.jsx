import React, { useState } from 'react'

const Schedule = () => {
  const [filter, setFilter] = useState("all");

  const schedules = [
    { id: 1, date: "2025-03-10", time: "10:00 - 12:00", student: "Budi", location: "Jakarta", mode: "Offline", status: "Verified" },
    { id: 2, date: "2025-03-12", time: "14:00 - 16:00", student: "Siti", location: "Online", mode: "Online", status: "Pending" },
    { id: 3, date: "2025-03-15", time: "09:00 - 11:00", student: "Andi", location: "Bandung", mode: "Offline", status: "Verified" },
  ];

  // Filter jadwal berdasarkan status
  const filteredSchedules = filter === "all" ? schedules : schedules.filter(s => s.status === filter);


  return (
    <div className="p-4">
      <h2 className="text-xl font-semibold mb-4">Jadwal Mengajar</h2>

      {/* Filter */}
      <div className="mb-4">
        <select 
          className="p-2 border rounded-lg" 
          value={filter} 
          onChange={(e) => setFilter(e.target.value)}
        >
          <option value="all">Semua Jadwal</option>
          <option value="Verified">Sudah Verifikasi</option>
          <option value="Pending">Belum Verifikasi</option>
        </select>
      </div>

      {/* Tabel Jadwal di desktop */}
      <div className="hidden md:block overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow-md">
          <thead className="bg-indigo-500 text-white">
            <tr>
              <th className="p-2">Tanggal</th>
              <th className="p-2">Waktu</th>
              <th className="p-2">Murid</th>
              <th className="p-2">Lokasi</th>
              <th className="p-2">Mode</th>
              <th className="p-2">Status</th>
            </tr>
          </thead>
          <tbody>
            {filteredSchedules.length > 0 ? (
              filteredSchedules.map((schedule) => (
                <tr key={schedule.id} className="text-center border-t">
                  <td className="p-2">{schedule.date}</td>
                  <td className="p-2">{schedule.time}</td>
                  <td className="p-2">{schedule.student}</td>
                  <td className="p-2">{schedule.location}</td>
                  <td className="p-2">{schedule.mode}</td>
                  <td className={`p-2 font-semibold ${schedule.status === "Verified" ? "text-green-600" : "text-red-500"}`}>
                    {schedule.status}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="p-4 text-center text-gray-500">Belum ada jadwal tersedia.</td>
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
              <p><strong>Tanggal:</strong> {schedule.date}</p>
              <p><strong>Waktu:</strong> {schedule.time}</p>
              <p><strong>Murid:</strong> {schedule.student}</p>
              <p><strong>Lokasi:</strong> {schedule.location}</p>
              <p><strong>Mode:</strong> {schedule.mode}</p>
              <p className={`font-semibold ${schedule.status === "Verified" ? "text-green-600" : "text-red-500"}`}>
                <strong>Status:</strong> {schedule.status}
              </p>
            </div>
          ))
        ) : (
          <p className="text-center text-gray-500">Belum ada jadwal tersedia.</p>
        )}
      </div>
    </div>
  )
}

export default Schedule