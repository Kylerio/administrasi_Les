import React, { useEffect, useState } from 'react';
// import L from 'leaflet';
// import 'leaflet/dist/leaflet.css';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import TeacherList from '../components/TeacherList';
import API_URL from '../api';

const CreateSession = () => {
  const [student, setStudent] = useState({
    name: '',
    location: '',
    subject: '',
    days: [],
    date: '',
    startTime: '10:00',
    duration: '1',
    fee: ''
  });

  const daysOptions = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  const startTimes = ["10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00", "17:00", "18:00"];
  const durations = ["1", "2", "3"];

  const [sessionDates, setSessionDates] = useState([]);
  const [locationCoords, setLocationCoords] = useState(null);
  const [teacher, setTeacher] = useState([]);
  const [selectedTeacher, setSelectedTeacher] = useState(null);
  const [session, setSession] = useState([]);

  const handleDayChange = (day) => {
    setStudent((prev) => {
      const updatedDays = prev.days.includes(day)
        ? prev.days.filter((d) => d !== day)
        : [...prev.days, day];

      setSessionDates(generateSessionDates(prev.date, updatedDays));
      return { ...prev, days: updatedDays };
    });
  };

  const generateSessionDates = (startDate, selectedDays) => {
    if (!startDate || selectedDays.length === 0) return [];

    const sessionDates = [];
    const start = new Date(startDate);
    const dayIndexes = selectedDays.map(day => daysOptions.indexOf(day));

    for (let i = 0; i < 4; i++) {
      dayIndexes.forEach((dayIndex) => {
        let newDate = new Date(start);
        let offset = (dayIndex + 1 - start.getDay() + 7) % 7;

        if (offset === 0 && i === 0) {
          sessionDates.push(newDate.toISOString().split("T")[0]);
        } else {
          newDate.setDate(start.getDate() + offset + (i * 7));
          sessionDates.push(newDate.toISOString().split("T")[0]);
        }
      });
    }
    return sessionDates.sort();
  };

  const handleDateChange = (e) => {
    const newDate = e.target.value;
    setStudent(prev => ({ ...prev, date: newDate }));
    setSessionDates(generateSessionDates(newDate, student.days));
  };

  const formatCurrency = (value) => {
    if (!value) return "";
    const number = value.replace(/\D/g, "");
    return new Intl.NumberFormat("id-ID").format(number);
  };

  const handleFeeChange = (e) => {
    const rawValue = e.target.value.replace(/\D/g, "");
    setStudent({ ...student, fee: rawValue });
  };

  useEffect(() => {
    const storedSchedules = JSON.parse(localStorage.getItem("session")) || [];
    const normalizedSchedules = storedSchedules.map((session) => ({
      ...session,
      days: Array.isArray(session.days)
        ? session.days
        : typeof session.days === "string"
        ? session.days.split(", ")
        : [], // Default to an empty array if `days` is undefined or invalid
    }));
    setSession(normalizedSchedules);
  }, []);

  const getDistance = (lat1, lon1, lat2, lon2) => {
    const toRad = (angle) => (angle * Math.PI) / 180;
    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);
    const R = 6371;
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
              Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
              Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  const getCoordinates = async (address) => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}`
      );
      const data = await response.json();

      if (data.length > 0) {
        const { lat, lon } = data[0];
        setLocationCoords({ latitude: parseFloat(lat), longitude: parseFloat(lon) });
        return { latitude: parseFloat(lat), longitude: parseFloat(lon) };
      } else {
        alert("Failed to get location coordinates. Please check the address.");
        return null;
      }
    } catch (error) {
      console.error("Error fetching coordinates:", error);
      alert("An error occurred while fetching location coordinates.");
      return null;
    }
  };

  const handleFindTeacher = async () => {
    if (!student.location || !student.subject || !student.days) {
      alert('Please fill in the form');
      return;
    }

    const coords = await getCoordinates(student.location);
console.log('Student Coordinates:', coords);
if (!coords) return;

    try {
      // Fetch teacher data from the API
      const response = await fetch(`${API_URL}/fetchTeachers.php`);
      const teachers = await response.json();

      if (!response.ok) {
        throw new Error('Failed to fetch teachers');
      }

      // Parse teacher data and filter based on criteria
      const filteredTeacher = teachers
  .map((teacher) => {
    const distance = getDistance(
      coords.latitude,
      coords.longitude,
      parseFloat(teacher.latitude),
      parseFloat(teacher.longitude)
    );

    console.log(`Teacher: ${teacher.name}, Distance: ${distance}, Subject: ${teacher.subject}, Availability: ${teacher.availability}`);

    return {
      ...teacher,
      distance,
    };
  })
  .filter((teacher) => {
    const matchesSubject = teacher.subject.toLowerCase() === student.subject.toLowerCase();
    const matchesAvailability = teacher.availability.split(', ').some((day) => student.days.includes(day));

    console.log(`Matches Subject: ${matchesSubject}, Matches Availability: ${matchesAvailability}`);

    return teacher.distance <= 10 && matchesSubject && matchesAvailability;
  })
  .sort((a, b) => a.distance - b.distance);

      console.log('Filtered teachers:', filteredTeacher);

      setTeacher(filteredTeacher);
    } catch (error) {
      console.error('Error fetching teachers:', error);
      alert('Failed to find teachers. Please try again later.');
    }
  };

  const fetchSchedules = async () => {
    try {
      const response = await fetch(`${API_URL}/fetchSchedules.php`);
      const data = await response.json();
  
      // Normalize the `day_of_week` field to always be an array
      const normalizedSchedules = data.map((session) => ({
        ...session,
        day_of_week: typeof session.day_of_week === "string"
        ? session.day_of_week.split(", ")
        : Array.isArray(session.day_of_week)
          ? session.day_of_week
          : [], // Default to an empty array if `day_of_week` is undefined or invalid
      }));
  
      setSession(normalizedSchedules); // Update the session state with fetched schedules
    } catch (error) {
      console.error("Error fetching schedules:", error);
    }
  };

  useEffect(() => {
    fetchSchedules();
  }, []);

  useEffect(() => {
    if (locationCoords) {
      // Initialize the MapLibre map
      const map = new maplibregl.Map({
        container: 'map', // The ID of the div where the map will be rendered
        style: 'https://basemaps.cartocdn.com/gl/positron-gl-style/style.json', // OpenStreetMap style
        center: [locationCoords.longitude, locationCoords.latitude], // Center the map on the student's location
        zoom: 12,
      });

      // Add a marker for the student's location
      new maplibregl.Marker({ color: 'blue' })
        .setLngLat([locationCoords.longitude, locationCoords.latitude])
        .setPopup(new maplibregl.Popup().setHTML('<b>Student Location</b>'))
        .addTo(map);

      // Add markers for each teacher
      teacher.forEach((t) => {
        new maplibregl.Marker({ color: 'red' })
          .setLngLat([t.longitude, t.latitude])
          .setPopup(
            new maplibregl.Popup().setHTML(
              `<b>Teacher: ${t.name}</b><br>Subject: ${t.subject}<br>Distance: ${t.distance.toFixed(2)} km`
            )
          )
          .addTo(map);
      });

      // Cleanup the map when the component unmounts
      return () => {
        map.remove();
      };
    }
  }, [locationCoords, teacher]);


  const saveSessionToDatabase = async (teacher) => {
    const newSession = {
      studentName: student.name,
      studentLocation: student.location,
      subject: student.subject,
      days: student.days.join(", "),
      date: student.date,
      startTime: student.startTime,
      duration: student.duration,
      fee: student.fee,
      teacherName: teacher.name,
      teacherLocation: teacher.location,
    };
  
    try {
      const response = await fetch(`${API_URL}/createSchedule.php`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newSession),
      });
  
      if (!response.ok) {
        const errorText = await response.text();
        console.error("API Error Response:", errorText);
        throw new Error("Failed to save session to the database");
      }
  
      const result = await response.json();
      if (result.success) {
        alert(`Schedule saved successfully! Teacher: ${teacher.name}`);
        fetchSchedules(); // Refresh schedules after saving
      } else {
        alert("Failed to save session to the database");
      }
    } catch (error) {
      console.error("Error saving session:", error);
      alert("An error occurred while saving the session. Please try again.");
    }
  };

  const handleAssignTeacher = (teacher) => {
    saveSessionToDatabase(teacher);
  };

  
  const handleDeleteSchedule = async (index) => {
    const scheduleToDelete = session[index]; // Get the schedule to delete
  
    try {
      const response = await fetch(`${API_URL}/deleteSchedule.php`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ schedule_id: scheduleToDelete.schedule_id }), // Send the schedule ID
      });
  
      const result = await response.json();
      if (result.success) {
        alert("Schedule deleted successfully!");
  
        // Remove the schedule from the frontend state
        const updatedSchedules = session.filter((_, i) => i !== index);
        setSession(updatedSchedules);
        localStorage.setItem("session", JSON.stringify(updatedSchedules)); // Update localStorage
      } else {
        alert("Failed to delete schedule: " + result.message);
      }
    } catch (error) {
      console.error("Error deleting schedule:", error);
      alert("An error occurred while deleting the schedule. Please try again.");
    }
  };

  return (
    <div className="flex flex-col gap-6 p-6">
      {/* Form Input */}
      <div className="bg-white shadow-md p-6 rounded-lg">
        <h2 className="text-xl font-semibold mb-4">Create a New Schedule</h2>

        <div className="space-y-4">
          {["name", "location", "subject"].map((field) => (
            <div key={field}>
              <label className="block text-sm font-medium capitalize">{field}</label>
              <input
                type="text"
                name={field}
                value={student[field]}
                onChange={(e) => setStudent({ ...student, [field]: e.target.value })}
                className="w-full p-2 border rounded-lg"
                placeholder={`Input ${field}`}
              />
            </div>
          ))}

          <div>
            <label className="block text-sm font-medium">Fee (per hour)</label>
            <input
              type="text"
              name="fee"
              value={formatCurrency(student.fee)}
              onChange={handleFeeChange}
              className="w-full p-2 border rounded-lg"
              placeholder="Input Teacher Fee"
            />
          </div>

          <div>
            <label className="block text-sm font-medium">Select Days</label>
            <div className="flex flex-wrap gap-2">
              {daysOptions.map((day) => (
                <label key={day} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    value={day}
                    checked={student.days.includes(day)}
                    onChange={() => handleDayChange(day)}
                  />
                  <span>{day}</span>
                </label>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium">Start Date (First Session)</label>
            <input
              type="date"
              name="date"
              value={student.date}
              onChange={handleDateChange}
              className="w-full p-2 border rounded-lg"
              placeholder='Select the first session date'
            />
          </div>

          {sessionDates.length > 0 && (
            <div className="bg-gray-100 p-3 rounded-md">
              <h3 className="text-sm font-semibold mb-2">Generated Session Dates:</h3>
              <ul className="text-sm text-gray-700">
                {sessionDates.map((date, index) => (
                  <li key={index}>• {date}</li>
                ))}
              </ul>
            </div>
          )}

          <div className="flex space-x-4">
            <div className="flex-1">
              <label className="block text-sm font-medium">Start Time</label>
              <select
                name="startTime"
                value={student.startTime}
                onChange={(e) => setStudent({ ...student, startTime: e.target.value })}
                className="w-full p-2 border rounded-lg"
              >
                {startTimes.map((time) => (
                  <option key={time} value={time}>
                    {time}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex-1">
              <label className="block text-sm font-medium">Duration (Hours)</label>
              <select
                name="duration"
                value={student.duration}
                onChange={(e) => setStudent({ ...student, duration: e.target.value })}
                className="w-full p-2 border rounded-lg"
              >
                {durations.map((dur) => (
                  <option key={dur} value={dur}>
                    {dur} Hours
                  </option>
                ))}
              </select>
            </div>
          </div>

          <button
            onClick={handleFindTeacher}
            className="w-full px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">
            Find the Nearest Teacher
          </button>
        </div>
      </div>
      
      <div className="p-4 bg-white rounded-lg shadow-md">
        <h2 className="text-lg font-semibold mb-2">Map</h2>
        {locationCoords ? (
          <div id="map" style={{ height: '400px', width: '100%' }}></div>
        ) : (
          <p className="text-gray-500">Map will display here once the location is set.</p>
        )}
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md">
        <TeacherList teacher={teacher} onAssign={handleAssignTeacher} />
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-lg font-semibold text-center">Saved Schedules</h3>
        {session.length > 0 ? (
          <div className="max-h-60 overflow-y-scroll">
            <div className="overflow-x-auto">
              <table className="min-w-full border-collapse border border-gray-300">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="border p-2">Student</th>
                    <th className="border p-2">Subject</th>
                    <th className="border p-2">Teacher</th>
                    <th className="border p-2">Day</th>
                    <th className="border p-2">Date</th>
                    <th className="border p-2">Time</th>
                    <th className="border p-2">Duration</th>
                    <th className="border p-2">Fee</th>
                    <th className="border p-2">Actions</th>
                  </tr>
                </thead>
                <tbody>
                {console.log("Session state:", session)}
                {session.map((session, index) => {
    // Ensure `days` is an array
    const daysArray = Array.isArray(session.day_of_week)
      ? session.day_of_week
      : []; // Default to an empty array if `days` is undefined or invalid

    return (
      <tr key={index} className="border">
        <td className="border p-2">{session.studentName || session.student_name}</td>
        <td className="border p-2">{session.subject}</td>
        <td className="border p-2">{session.teacherName || session.teacher_name}</td>
        <td className="border p-2">{daysArray.join(", ")}</td>
        <td className="border p-2">{session.date}</td>
        <td className="border p-2">{session.start_time}</td>
        <td className="border p-2">{session.duration} hours</td>
        <td className="border p-2">
          {new Intl.NumberFormat("id-ID", {
            style: "currency",
            currency: "IDR",
          }).format(session.fee)}
            </td>
          <button
            onClick={() => handleDeleteSchedule(index)}
            className="px-3 py-1 bg-red-500 text-white rounded-md hover:bg-red-600"
          >
            Delete
          </button>
      </tr>
    );
  })}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <p className="text-gray-500 text-center">There are no schedules yet.</p>
        )}
      </div> 
    </div>
  );
};

export default CreateSession;