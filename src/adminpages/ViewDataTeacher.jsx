import React, { useEffect, useState } from 'react'

const ViewDataTeacher = () => {
  const [teachers, setTeachers] = useState([]);

  const sampleTeachers = [
    {
      name: "John Doe",
      subject: "Mathematics",
      location: { latitude: -6.200000, longitude: 106.816666 },
      availableDays: ["Monday", "Wednesday", "Friday"]
    },
    {
      name: "Jane Smith",
      subject: "Physics",
      location: { latitude: -7.250445, longitude: 112.768845 },
      availableDays: ["Tuesday", "Thursday"]
    },
    {
      name: "Michael Johnson",
      subject: "Chemistry",
      location: { latitude: -6.917464, longitude: 107.619123 },
      availableDays: ["Monday", "Tuesday"]
    },
    {
      name: "Emily Brown",
      subject: "Biology",
      location: { latitude: -6.973, longitude: 110.418 },
      availableDays: ["Wednesday", "Friday"]
    },
    {
      name: "Chris Evans",
      subject: "History",
      location: { latitude: -8.670458, longitude: 115.212629 },
      availableDays: ["Monday", "Thursday"]
    },
    {
      name: "Anna White",
      subject: "English",
      location: { latitude: -5.147665, longitude: 119.432732 },
      availableDays: ["Tuesday", "Thursday", "Saturday"]
    },
  ];
  
  // Simpan ke localStorage untuk testing
  localStorage.setItem("teacher", JSON.stringify(sampleTeachers));
  

  // Ambil data teacher dari localStorage saat halaman dimuat
  useEffect(() => {
    const storedTeachers = JSON.parse(localStorage.getItem("teacher")) || [];
    setTeachers(storedTeachers);
  }, []);

  // Hapus teacher dari daftar
  const handleDelete = (index) => {
    const updatedTeachers = teachers.filter((_, i) => i !== index);
    setTeachers(updatedTeachers);
    localStorage.setItem("teachers", JSON.stringify(updatedTeachers));
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold mb-4">📋 Teacher List</h2>
      {teachers.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-indigo-500 text-white text-left">
                <th className="border p-3 text-left">#</th>
                <th className="border p-3 text-left">Name</th>
                <th className="border p-3 text-left">Subject</th>
                <th className="border p-3 text-left">Location</th>
                <th className="border p-3 text-left">Available Days</th>
                <th className="border p-3 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {teachers.map((teacher, index) => (
                <tr key={index} className="border hover:bg-gray-50">
                  <td className="border p-3">{index + 1}</td>
                  <td className="border p-3">{teacher.name}</td>
                  <td className="border p-3">{teacher.subject}</td>
                  <td className="border p-3">
                    {teacher.location
                      ? `${teacher.location.latitude}, ${teacher.location.longitude}`
                      : "Not Set"}
                  </td>
                  <td className="border p-3">{teacher.availableDays.join(", ")}</td>
                  <td className="border p-3 text-center">
                    <button
                      onClick={() => handleDelete(index)}
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
      ) : (
        <p className="text-gray-500 mt-4">No teachers available.</p>
      )}
    </div>
  );
}

export default ViewDataTeacher