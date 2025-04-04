import React, { useEffect, useState } from 'react';
import API_URL from '../api'; // Import your API base URL

const ViewDataTeacher = () => {
  const [teachers, setTeachers] = useState([]);

  // Location mapping: convert place names to latitude and longitude
  const locationMapping = {
    Jakarta: { latitude: -6.200000, longitude: 106.816666 },
    Bintaro: { latitude: -6.268230, longitude: 106.764840 },
    BSD: { latitude: -6.305968, longitude: 106.672272 },
    Bandung: { latitude: -6.914744, longitude: 107.609810 },
    STAN: { latitude: -6.267222, longitude: 106.753889 },
  };

  // Fetch teacher data from the API
  useEffect(() => {
    const fetchTeachers = async () => {
      try {
        const response = await fetch(`${API_URL}/fetchTeachers.php`);
        const data = await response.json();

        // Filter out teachers with the role "admin"
        const filteredTeachers = data.filter((teacher) => teacher.role !== 'admin');
        setTeachers(filteredTeachers);
      } catch (error) {
        console.error('Error fetching teacher data:', error);
      }
    };

    fetchTeachers();
  }, []);

  // Delete a teacher from the database and update the frontend
  const handleDelete = async (teacherId, index) => {
    try {
      const response = await fetch(`${API_URL}/deleteTeacher.php`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id: teacherId }), // Send the teacher's ID
      });

      const result = await response.json();

      if (result.message === 'Teacher deleted successfully') {
        const updatedTeachers = teachers.filter((_, i) => i !== index);
        setTeachers(updatedTeachers); // Update the UI
      } else {
        console.error(result.message);
      }
    } catch (error) {
      console.error('Error deleting teacher:', error);
    }
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
                <th className="border p-3 text-left">Availability</th>
                <th className="border p-3 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {teachers.map((teacher, index) => {
                const location = locationMapping[teacher.location] || { latitude: 'Not Set', longitude: 'Not Set' };
                return (
                  <tr key={index} className="border hover:bg-gray-50">
                    <td className="border p-3">{index + 1}</td>
                    <td className="border p-3">{teacher.name}</td>
                    <td className="border p-3">{teacher.subject}</td>
                    <td className="border p-3">
                      {location.latitude !== 'Not Set'
                        ? `${location.latitude}, ${location.longitude}`
                        : teacher.location}
                    </td>
                    <td className="border p-3">
                      {teacher.availability || 'No availability listed'}
                    </td>
                    <td className="border p-3 text-center">
                      <button
                        onClick={() => handleDelete(teacher.teacher_id, index)}
                        className="px-3 py-1 bg-red-500 text-white rounded-md hover:bg-red-600"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="text-gray-500 mt-4">No teachers available.</p>
      )}
    </div>
  );
};

export default ViewDataTeacher;
