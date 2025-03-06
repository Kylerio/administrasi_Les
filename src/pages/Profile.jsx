import React, { useState } from 'react'

const Profile = () => {
    const [teacher] = useState({
        email: "rimuru@teaching.com",
        name: "Rimuru Tempest",
        subjects: ["Matematika", "Fisika"],
        location: "Jakarta Selatan",
        availableDays: ["Senin", "Rabu", "Jumat"],
        profilePicture: "https://randomuser.me/api/portraits/lego/3.jpg",
      });

    return (
        <div className="max-w-3xl mx-auto mt-10 p-6 bg-white shadow-md rounded-lg">
            {/* Profile Header */}
            <div className="flex items-center space-x-6">
                <img
                src={teacher.profilePicture}
                alt="Profile"
                className="w-24 h-24 rounded-full border-4 border-indigo-500"
                />
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">{teacher.name}</h1>
                    <p className="text-gray-600">{teacher.email}</p>
                    <p className="text-gray-500">{teacher.location}</p>
                </div>
            </div>
    
            {/* Divider */}
            <hr className="my-6 border-gray-300" />
    
            {/* Subjects */}
            <div>
                <h2 className="text-lg font-semibold text-gray-900">Mengajar:</h2>
                <ul className="mt-2 flex flex-wrap gap-2">
                    {teacher.subjects.map((subject, index) => (
                        <li key={index} className="bg-indigo-100 text-indigo-600 px-3 py-1 rounded-md text-sm">
                            {subject}
                        </li>
                    ))}
                </ul>
            </div>
    
            {/* Available Days */}
            <div className="mt-6">
                <h2 className="text-lg font-semibold text-gray-900">Hari Tersedia:</h2>
                <ul className="mt-2 flex flex-wrap gap-2">
                    {teacher.availableDays.map((day, index) => (
                        <li key={index} className="bg-gray-200 text-gray-700 px-3 py-1 rounded-md text-sm">
                            {day}
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    )
}

export default Profile