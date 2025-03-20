import React, { use, useEffect, useState } from 'react'
import MapDisplay from '../components/MapDisplay'
import TeacherList from '../components/TeacherList'

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
  })

  // Opsi pilihan hari dalam seminggu
  const daysOptions = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

  // Opsi pilihan start time
  const startTimes = ["10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00", "17:00", "18:00"];

  // Opsi pilihan durasi
  const durations = ["1", "2", "3"];

  const [sessionDates, setSessionDates] = useState([]);

  const [locationCoords, setLocationCoords] = useState(null)
  const [teacher, setTeacher] = useState([])
  const [selectedTeacher, setSelectedTeacher] = useState(null)
  const [session, setSession] = useState([])

  // Fungsi untuk menghandle perubahan checkbox hari
  const handleDayChange = (day) => {
    setStudent((prev) => {
      const updatedDays = prev.days.includes(day)
        ? prev.days.filter((d) => d !== day)
        : [...prev.days, day];

      setSessionDates(generateSessionDates(prev.date, updatedDays));
      return { ...prev, days: updatedDays };
    });
  };

  // Fungsi untuk generate daftar tanggal sesi
  const generateSessionDates = (startDate, selectedDays) => {
    if (!startDate || selectedDays.length === 0) return [];

    const sessionDates = [];
    const start = new Date(startDate);
    const dayIndexes = selectedDays.map(day => daysOptions.indexOf(day));

    

    for (let i = 0; i < 4; i++) { // Misal, buat sesi selama 4 minggu
      dayIndexes.forEach((dayIndex) => {
        let newDate = new Date(start);
        let offset = (dayIndex + 1 - start.getDay() + 7) % 7;

        if(offset === 0 && i === 0) {
          sessionDates.push(newDate.toISOString().split("T")[0]);
        } else{
          newDate.setDate(start.getDate() + offset + (i * 7));
          sessionDates.push(newDate.toISOString().split("T")[0]);
        }
      });
    }
    return sessionDates.sort();
  };

  // Handle perubahan tanggal sesi pertama
  const handleDateChange = (e) => {
    const newDate = e.target.value;
    setStudent(prev => ({ ...prev, date: newDate }));
    setSessionDates(generateSessionDates(newDate, student.days));
  };

  // Format angka IDR saat mengetik
  const formatCurrency = (value) => {
    if (!value) return "";
    const number = value.replace(/\D/g, ""); // Hanya ambil angka
    return new Intl.NumberFormat("id-ID").format(number);
  };
  
  const handleFeeChange = (e) => {
    const rawValue = e.target.value.replace(/\D/g, ""); // Ambil angka saja
    setStudent({ ...student, fee: rawValue });
  };

  // mengambil data session jika ada
  useEffect(() => {
    const storedSchedules = JSON.parse(localStorage.getItem('session')) || []
    setSession(storedSchedules)
  }, [])

  // fungsi Haversine (menghitung jarak antara dua titik koordinat)
  const getDistance = (lat1, lon1, lat2, lon2) => {
    const toRad = (angle) => (angle * Math.PI) / 180
    const dLat = toRad(lat2 - lat1)
    const dLon = toRad(lon2 - lon1)
    const R = 6371
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
              Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
              Math.sin(dLon / 2) * Math.sin(dLon / 2)
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
    return R * c
  }

  // fungsi mencari pengajar terdekat
  const handleFindTeacher = () => {
    if(!student.location || !student.subject || !student.days) {
      alert('Please fill in the form')
      return
    }

    //uji coba pake data
    const mockLocation = {
      latitude: -6.200000,
      longitude: 106.816666
    }
    setLocationCoords(mockLocation)

    const allTeacher = [
      {
        name: 'Budi',
        subject: 'Math',
        location: { latitude: -6.202393, longitude: 106.815978 },
        availableDays: ['Monday', 'Wednesday']
      },
      {
        name: 'Rimuru',
        subject: 'English',
        location: { latitude: -6.201111, longitude: 106.817111 },
        availableDays: ['Tuesday', 'Thursday']
      },
      {
        name: 'Rain',
        subject: 'Biology',
        location: { latitude: -6.250000, longitude: 106.860000 },
        availableDays: ['Friday', 'Wednesday']
      },
      {
        name: 'Meliodas',
        subject: 'Physics',
        location: { latitude: -6.230000, longitude: 106.840000 },
        availableDays: ['Monday', 'Thursday']
      },
    ]

    console.log("student location: ", student.location)

    // data semua pengajar di filter dari jarak, subject, days
    const filteredTeacher = allTeacher
      .map(teacher => ({
        ...teacher,
        distance: getDistance(mockLocation.latitude, mockLocation.longitude, teacher.location.latitude, teacher.location.longitude)
      }))
      .filter(teacher => 
        teacher.distance <= 10 &&
        teacher.subject.toLowerCase() === student.subject.toLowerCase() &&
        teacher.availableDays.includes(student.days)
      )
      .sort((a, b) => a.distance - b.distance)

    console.log("filtered teacher: ", filteredTeacher)

    setTeacher(filteredTeacher)
  }

  // Simpan Jadwal ke LocalStorage
  const saveSessionToLocalStorage = (teacher) => {
    const newSession = {
        studentName: student.name,
        studentLocation: student.location,
        subject: student.subject,
        days: student.days,
        date: student.date,
        startTime: student.startTime,
        duration: student.duration,
        fee: student.fee,
        teacherName: teacher.name,
        teacherLocation: teacher.location,
    };

    // Ambil jadwal lama dari localStorage
    const updatedSchedules = [...session, newSession];

    // Simpan kembali ke localStorage
    localStorage.setItem("session", JSON.stringify(updatedSchedules));

    // Update state agar tampilan berubah
    setSession(updatedSchedules);
    setSelectedTeacher(teacher);
    alert(`Jadwal berhasil disimpan! Pengajar: ${teacher.name}`);
  };
  
  // Assign Pengajar
  const handleAssignTeacher = (teacher) => {
    saveSessionToLocalStorage(teacher);
  };

  //handle delete saved schedule
  const handleDeleteSchedule = (index) => {
    const updatedSchedules = session.filter((_, i) => i !== index);
    setSession(updatedSchedules);
    localStorage.setItem("session", JSON.stringify(updatedSchedules));
  };

  return (
    <div className="flex flex-col gap-6 p-6">
      {/* Form Input */}
      <div className="bg-white shadow-md p-6 rounded-lg">
        <h2 className="text-xl font-semibold mb-4">Create a New Schedule</h2>

        <div className="space-y-4">
          {/* Input Nama, Lokasi, dan Subject */}
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

          {/* Input Fee Pengajar */}
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

          {/* Pilihan Hari (Checkbox) */}
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

          {/* Input Tanggal Mulai */}
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

          {/* Menampilkan daftar sesi yang dihasilkan */}
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

          {/* Pilihan Start Time dan Duration */}
          <div className="flex space-x-4">
            {/* Start Time */}
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

            {/* Duration */}
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
      
      {/* Map Display */}
      <div className="p-4 bg-white rounded-lg shadow-md">
        <h2 className='text-lg font-semibold mb-2'>Map</h2>
        {locationCoords && <MapDisplay location={locationCoords} teacher={teacher} />}
      </div>

      {/* Teacher List */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <TeacherList teacher={teacher} onAssign={handleAssignTeacher} />
      </div>

      {/* Jadwal yang Sudah Dibuat */}
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
                    <th className="border p-2">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {session.map((session, index) => (
                    <tr key={index} className="border">
                      <td className="border p-2">{session.studentName}</td>
                      <td className="border p-2">{session.subject}</td>
                      <td className="border p-2">{session.teacherName}</td>
                      <td className="border p-2">{session.days.join(", ")}</td>
                      <td className="border p-2">{session.date}</td>
                      <td className="border p-2">{session.startTime}</td>
                      <td className="border p-2">{session.duration} hours</td>
                      <td className="border p-2">
                        <button
                          onClick={() => handleDeleteSchedule(index)}
                          className="px-3 py-1 bg-red-500 text-white rounded-md hover:bg-red-600"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <p className="text-gray-500 text-center">There are no schedules yet.</p>
        )}
      </div> 
    </div>
  )
}

export default CreateSession