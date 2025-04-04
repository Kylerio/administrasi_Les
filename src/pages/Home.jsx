import React, { useState, useEffect } from "react";
import axios from "axios";
import API_URL from "../api"; // Ensure this points to the correct API endpoint

const Home = () => {
  const [teacher, setTeacher] = useState(null); // Store teacher profile
  const [schedules, setSchedules] = useState([]); // Store schedules
  const [sessions, setSessions] = useState([]); // Store session data
  const [error, setError] = useState(""); // Store error message

  useEffect(() => {
    const fetchProfileAndSchedules = async () => {
      try {
        // Retrieve teacher ID and email from localStorage
        const teacherId = localStorage.getItem("id");
        const email = localStorage.getItem("email");

        if (!teacherId || !email) {
          setError("No teacher ID or email found. Please log in again.");
          return;
        }

        // Fetch teacher profile from the backend
        const profileResponse = await axios.post(`${API_URL}/getProfile.php`, {
          teacher_id: teacherId,
          email: email,
        });

        if (profileResponse.data.message === "Profile fetched successfully") {
          setTeacher(profileResponse.data.profile); // Set profile data
        } else {
          setError(profileResponse.data.message || "Failed to fetch profile.");
        }

        // Fetch schedules for the teacher
        const scheduleResponse = await axios.post(`${API_URL}/getSchedules.php`, {
          teacher_id: teacherId,
        });

        console.log("Schedules API Response:", scheduleResponse.data);

        if (scheduleResponse.data.message === "Schedules fetched successfully") {
          // Map the schedules to match the frontend structure
          const mappedSchedules = scheduleResponse.data.schedules.map((schedule) => ({
            day: schedule.day_of_week,
            start_time: schedule.start_time,
            duration: `${schedule.duration} hour${schedule.duration > 1 ? "s" : ""}`,
            subject: schedule.subject,
            student: `Student ID: ${schedule.student_id}`, // Replace with actual student name if available
          }));
          setSchedules(mappedSchedules);
        } else {
          setError(scheduleResponse.data.message || "Failed to fetch schedules.");
        }

        // Mock session data for fee summaries (optional step; integrate backend here if available)
        const mockSessions = [
          { verified: true, hours: 2, rate: 100000 },
          { verified: false, hours: 1.5, rate: 120000 },
          { verified: true, hours: 1, rate: 80000 },
        ];
        setSessions(mockSessions);
      } catch (error) {
        console.error("Error fetching data:", error);
        setError("An error occurred while fetching data.");
      }
    };

    fetchProfileAndSchedules();
  }, []);

  // Calculate total fees and session counts
  const totalFeeVerified = sessions
    .filter((session) => session.verified)
    .reduce((total, session) => total + session.hours * session.rate, 0);

  const totalFeePending = sessions
    .filter((session) => !session.verified)
    .reduce((total, session) => total + session.hours * session.rate, 0);

  const sessionsCompleted = sessions.filter((session) => session.verified).length;
  const sessionsPending = sessions.filter((session) => !session.verified).length;

  if (error) {
    return <p className="text-red-500 text-sm text-center">{error}</p>;
  }

  if (!teacher) {
    return <p className="text-center">Loading profile...</p>;
  }

  return (
    <div className="p-6">
      {/* Profile in Dashboard */}
      <div className="flex items-center space-x-4 bg-white p-4 md:p-6 rounded-lg shadow-md">
        <img
          src={teacher.profile_picture || "https://randomuser.me/api/portraits/lego/3.jpg"}
          alt="Profile Picture"
          className="w-24 h-24 rounded-full"
        />
        <div>
          <h2 className="text-lg font-semibold">Welcome Back, {teacher.name}!</h2>
          <p className="text-sm text-gray-500">
            {teacher.subject || "No Subject"} - {teacher.location || "No Location"}
          </p>
        </div>
      </div>

      {/* Upcoming Schedule */}
      <div className="bg-white mt-6 p-4 md:p-6 rounded-lg shadow-md">
        <h2 className="text-lg font-semibold">Upcoming Schedule</h2>
        {schedules.length === 0 ? (
          <p className="text-center text-gray-500">No schedules available.</p>
        ) : (
          <>
            {/* Desktop Table View */}
            <div className="hidden md:block overflow-x-auto mt-4">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-gray-200 text-left">
                    <th className="p-3">Day</th>
                    <th className="p-3">Start Time</th>
                    <th className="p-3">Duration</th>
                    <th className="p-3">Subject</th>
                    <th className="p-3">Student</th>
                  </tr>
                </thead>
                <tbody>
                  {schedules.map((schedule, index) => (
                    <tr key={index} className="border-b">
                      <td className="p-3">{schedule.day}</td>
                      <td className="p-3">{schedule.start_time}</td>
                      <td className="p-3">{schedule.duration}</td>
                      <td className="p-3">{schedule.subject}</td>
                      <td className="p-3">{schedule.student}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Card View */}
            <div className="md:hidden mt-4 space-y-3">
              {schedules.map((schedule, index) => (
                <div key={index} className="p-4 bg-gray-100 rounded-lg shadow-sm">
                  <p className="text-sm font-semibold">
                    {schedule.day}, {schedule.start_time} | {schedule.duration}
                  </p>
                  <p className="text-base font-bold">{schedule.subject}</p>
                  <p className="text-sm text-gray-600">{schedule.student}</p>
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      {/* Fee Summary */}
      <div className="mt-6 bg-white p-4 md:p-6 rounded-lg shadow-md">
        <h2 className="text-lg md:text-xl font-semibold">Revenue Summary</h2>

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
      </div>
    </div>
  );
};

export default Home;