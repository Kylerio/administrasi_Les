import React, { use, useEffect, useState } from 'react'
import MapDisplay from '../components/MapDisplay'
import TeacherList from '../components/TeacherList'

const CreateSession = () => {
  const [student, setStudent] = useState({
    name: '',
    location: '',
    subject: '',
    day: '',
    date: '',
    time: '',
  })

  const [locationCoords, setLocationCoords] = useState(null)
  const [teacher, setTeacher] = useState([])
  const [selectedTeacher, setSelectedTeacher] = useState(null)
  const [session, setSession] = useState([])

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
    if(!student.location || !student.subject || !student.day) {
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
        teacher.availableDays.includes(student.day)
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
        day: student.day,
        date: student.date,
        time: student.time,
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

  return (
    <div className="flex flex-col gap-6 p-6">
      {/* Form Input */}
      <div className="bg-white shadow-md p-6 rounded-lg">
        <h2 className="text-xl font-semibold mb-4">Create a New Schedule</h2>

        <div className="space-y-4">
          {["name", "location", "subject", "day", "date", "time"].map((field) => (
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
          <ul className="mt-2 space-y-2">
            {session.map((session, index) => (
              <li key={index} className="p-2 bg-white shadow-sm rounded-md border border-green-300">
                <p><strong>{session.studentName}</strong> studies <strong>{session.subject}</strong> with <strong>{session.teacherName}</strong></p>
                <p className="text-sm text-gray-600">Day: {session.day}, Date: {session.date}, Time: {session.time}</p>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500 text-center">There are no schedules yet.</p>
        )}
      </div> 
    </div>
  )
}

export default CreateSession