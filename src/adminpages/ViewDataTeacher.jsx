import React, { useEffect, useState } from 'react'

const ViewDataTeacher = () => {
  const [teachers, setTeachers] = useState([]);

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
          <table className="w-full border-collapse border border-gray-300">
            <thead>
              <tr className="bg-gray-100">
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
                      ❌ Delete
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