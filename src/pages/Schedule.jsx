import React, { useState, useEffect } from "react";
import axios from "axios";
import API_URL from "../api";

const Schedule = () => {
  const [filter, setFilter] = useState("all");
  const [schedules, setSchedules] = useState([]);
  const [loading, setLoading] = useState(true); // Loading state
  const [error, setError] = useState("");
  const [verifyingIds, setVerifyingIds] = useState([]); // Tracks IDs currently being verified

  useEffect(() => {
    const fetchSchedules = async () => {
      try {
        const teacherId = localStorage.getItem("id");

        if (!teacherId) {
          setError("No teacher ID found. Please log in again.");
          setLoading(false);
          return;
        }

        const response = await axios.post(`${API_URL}/getSchedules.php`, {
          teacher_id: teacherId,
        });

        if (response.data.message === "Schedules fetched successfully") {
          const mappedSchedules = response.data.schedules.map((schedule) => ({
            id: schedule.id, schedule_id  : schedule.schedule_id,
            date: schedule.date,
            startTime: schedule.start_time,
            duration: `${schedule.duration} hour${schedule.duration > 1 ? "s" : ""}`,
            student: schedule.student || "Unknown Student",
            location: schedule.location || "No Location",
            status: schedule.status || "Pending",
          }));
          setSchedules(mappedSchedules);
        } else {
          setError(response.data.message || "Failed to fetch schedules.");
        }
      } catch (err) {
        console.error("Error fetching schedules:", err);
        setError("An error occurred while fetching schedules.");
      } finally {
        setLoading(false);
      }
    };

    fetchSchedules();
  }, []);

  const filteredSchedules =
    filter === "all" ? schedules : schedules.filter((s) => s.status === filter);

  const handleVerifyAttendance = async (id) => {
    if (!id) {
      console.error("Schedule ID is required to verify attendance.");
      return;
    }
    
    // Add the id to verifyingIds so we can disable the button during the update
    setVerifyingIds(prev => [...prev, id]);

    try {
      const response = await axios.post(
        `${API_URL}/updateScheduleStatus.php`,
        { schedule_id: id },
        { headers: { "Content-Type": "application/json" } }
      );

      if (response.data.success) {
        const updatedSchedules = schedules.map((schedule) =>
          schedule.id === id ? { ...schedule, status: "Verified" } : schedule
        );
        setSchedules(updatedSchedules);
      } else {
        console.error("Failed to update schedule status:", response.data.message);
      }
    } catch (err) {
      console.error("Error updating schedule status:", err);
    } finally {
      // Remove the ID from verifyingIds when the verification is complete (success or error)
      setVerifyingIds(prev => prev.filter(sid => sid !== id));
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-semibold mb-4">Teacher Schedules</h2>

      {/* Error Display */}
      {error && (
        <p className="mb-4 text-red-500 font-semibold">
          {error}
        </p>
      )}

      {/* Loading Indicator */}
      {loading ? (
        <p className="text-center">Loading schedules...</p>
      ) : (
        <>
          {/* Filter Dropdown */}
          <div className="mb-4">
            <select
              className="p-2 border rounded-lg"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
            >
              <option value="all">All Schedules</option>
              <option value="Verified">Verified</option>
              <option value="Pending">Pending</option>
            </select>
          </div>

          {/* Desktop Table View */}
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
                      <td
                        className={`p-2 font-semibold ${
                          schedule.status === "Verified"
                            ? "text-green-600"
                            : "text-red-500"
                        }`}
                      >
                        {schedule.status}
                      </td>
                      <td className="p-2">
                        {schedule.status === "Pending" && (
                          <button
                            onClick={() => handleVerifyAttendance(schedule.id)}
                            className="px-3 py-1 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                            disabled={schedule.status === "Verified" || verifyingIds.includes(schedule.id)}
                          >
                            {verifyingIds.includes(schedule.id) ? "Verifying..." : "✅ Verify Attendance"}
                          </button>
                        )}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="7" className="p-4 text-center text-gray-500">
                      No schedules available yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Mobile Card View */}
          <div className="md:hidden">
            {filteredSchedules.length > 0 ? (
              filteredSchedules.map((schedule) => (
                <div key={schedule.id} className="border p-4 mb-4 rounded-lg shadow">
                  <p>
                    <strong>Date:</strong> {schedule.date}
                  </p>
                  <p>
                    <strong>Start Time:</strong> {schedule.startTime}
                  </p>
                  <p>
                    <strong>Duration:</strong> {schedule.duration}
                  </p>
                  <p>
                    <strong>Student:</strong> {schedule.student}
                  </p>
                  <p>
                    <strong>Location:</strong> {schedule.location}
                  </p>
                  <p
                    className={`font-semibold ${
                      schedule.status === "Verified"
                        ? "text-green-600"
                        : "text-red-500"
                    }`}
                  >
                    <strong>Status:</strong> {schedule.status}
                  </p>
                  {schedule.status === "Pending" && (
                    <button
                      onClick={() => handleVerifyAttendance(schedule.id)}
                      className="w-full mt-2 px-3 py-1 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                      disabled={schedule.status === "Verified" || verifyingIds.includes(schedule.id)}
                    >
                      {verifyingIds.includes(schedule.id) ? "Verifying..." : "✅ Verify Attendance"}
                    </button>
                  )}
                </div>
              ))
            ) : (
              <p className="text-center text-gray-500">
                No schedules available yet.
              </p>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default Schedule;
