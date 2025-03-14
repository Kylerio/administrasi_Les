import React from 'react'
import { useState, useEffect } from "react";

const Home = () => {
  const [pengajar, setPengajar] = useState(null);

  useEffect(() => {
    const storedProfile = localStorage.getItem("userProfile");
    if (storedProfile) {
      setPengajar(JSON.parse(storedProfile));
    }
  }, []);

  const [schedules] = useState([
    { day: "Senin", time: "10:00 - 11:30", subject: "Matematika", student: "Aldi" },
    { day: "Rabu", time: "14:00 - 15:30", subject: "Fisika", student: "Dinda" },
  ]);

  const [sessions] = useState([
    { id: 1, day: "Senin", hours: 1.5, rate: 200000, verified: true },
    { id: 2, day: "Rabu", hours: 1.5, rate: 200000, verified: false },
    { id: 3, day: "Jumat", hours: 2, rate: 200000, verified: true },
    { id: 4, day: "Sabtu", hours: 2, rate: 200000, verified: true },
  ]);

  // Hitung total fee yang sudah diverifikasi
  const totalFeeVerified = sessions
    .filter((session) => session.verified)
    .reduce((total, session) => total + session.hours * session.rate, 0);

  // Hitung total fee yang masih dalam proses
  const totalFeePending = sessions
    .filter((session) => !session.verified)
    .reduce((total, session) => total + session.hours * session.rate, 0);

  // Hitung jumlah sesi yang sudah selesai
  const sessionsCompleted = sessions.filter((session) => session.verified).length;

  // Hitung jumlah sesi yang masih pending
  const sessionsPending = sessions.filter((session) => !session.verified).length;

  return (
    <div className="p-6">
      {/* Profile in Dashboard */}
      {pengajar && (
        <div className='flex items-center space-x-4 bg-white p-4 md:p-6 rounded-lg shadow-md'>
          <img 
          src={pengajar.profilePicture || "https://randomuser.me/api/portraits/lego/3.jpg"} 
          alt="Foto Profile" 
          className="w-24 h-24 rounded-full" 
          />
          <div>
            <h2 className='text-lg font-semibold'>Welcome Back!, {pengajar.name}</h2>
            <p className='text-sm text-gray-500'>{pengajar.subject} - {pengajar.location}</p>
          </div>
        </div>
      )}

      {/* Upcoming Schedule */}
      <div className='bg-white mt-6 p-4 md:p-6 rounded-lg shadow-md'>
        <h2 className='text-lg md:text-xl font-semibold'>Upcoming Schedule</h2>

        {schedules.length === 0 ? (
          <div className="flex flex-col items-center justify-center text-gray-500 mt-4">
            <img src="/empty-schedule.png" alt="No Schedule" className="w-32 h-32 opacity-50" />
            <p className="mt-2 text-sm md:text-base">No schedules have been entered yet.</p>
          </div>
        ) : (
          <>
            {/* Tampilan Tabel untuk Desktop */}
            <div className="hidden md:block overflow-x-auto mt-4">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-indigo-500 text-white text-left">
                    <th className="p-3">Day</th>
                    <th className="p-3">Time</th>
                    <th className="p-3">Subject</th>
                    <th className="p-3">Student</th>
                  </tr>
                </thead>
                <tbody>
                  {schedules.map((schedule, index) => (
                    <tr key={index} className="border-b hover:bg-indigo-50">
                      <td className="p-3">{schedule.day}</td>
                      <td className="p-3">{schedule.time}</td>
                      <td className="p-3">{schedule.subject}</td>
                      <td className="p-3">{schedule.student}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Tampilan Card untuk Mobile */}
            <div className="md:hidden mt-4 space-y-3">
              {schedules.map((schedule, index) => (
                <div key={index} className="p-4 bg-gray-100 rounded-lg shadow-sm">
                  <p className="text-sm font-semibold">{schedule.day}, {schedule.time}</p>
                  <p className="text-base font-bold">{schedule.subject}</p>
                  <p className="text-sm text-gray-600">{schedule.student}</p>
                  <span className={`text-xs px-2 py-1 rounded-md mt-1 inline-block ${schedule.mode === "Online" ? "bg-green-500 text-white" : "bg-blue-500 text-white"}`}>
                    {schedule.mode}
                  </span>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
      

      {/* Fee Summary */}
      <div className="mt-6 bg-white p-4 md:p-6 rounded-lg shadow-md">
        <h2 className="text-lg md:text-xl font-semibold">Revenue Summary</h2>
        
        {/* Card Container */}
        <div className="grid grid-cols-1 mt-4 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">

          {/* Total Fee Verified */}
          <div className="bg-white shadow-md rounded-lg p-4 md:p-6 border border-indigo-300">
            <p className="text-sm text-gray-600">Total Revenue</p>
            <h2 className="text-2xl font-bold text-indigo-600">IDR {totalFeeVerified.toLocaleString()}</h2>
            <p className="text-xs text-gray-500 mt-1">Verified</p>
          </div>

          {/* Fee Pending */}
          <div className="bg-white shadow-md rounded-lg p-4 md:p-6 border border-yellow-300">
            <p className="text-sm text-gray-600">Fee Pending Verification</p>
            <h2 className="text-2xl font-bold text-yellow-500">IDR {totalFeePending.toLocaleString()}</h2>
            <p className="text-xs text-gray-500 mt-1">In Process</p>
          </div>

          {/* Completed Sessions */}
          <div className="bg-white shadow-md rounded-lg p-4 md:p-6 border border-green-300">
            <p className="text-sm text-gray-600">Session Completed</p>
            <h2 className="text-2xl font-bold text-green-600">{sessionsCompleted} Session</h2>
          </div>

          {/* Pending Sessions */}
          <div className="bg-white shadow-md rounded-lg p-4 md:p-6 border border-red-300">
            <p className="text-sm text-gray-600">Session Pending</p>
            <h2 className="text-2xl font-bold text-red-500">{sessionsPending} Session</h2>
          </div>

        </div>

        {/* Jika tidak ada sesi sama sekali */}
        {sessions.length === 0 && (
          <div className="mt-6 p-4 md:p-6 bg-gray-100 rounded-lg text-center text-gray-500">
            📢 There are no scheduled sessions this month. Please check back later.
          </div>
        )}
      </div>

    </div>
  )
}

export default Home