import React from 'react'

const TeacherList = ({ teacher, onAssign }) => {
  return (
    <div className="mt-4">
            <h3 className="text-lg font-semibold text-center">Nearest Teacher</h3>
            {teacher.length > 0 ? (
                <div className="flex flex-col gap-4">
                    {teacher.map((teacher, index) => (
                        <div key={index} className="p-3 border border-blue-300 rounded-lg shadow-sm bg-white flex flex-col items-center">
                            <p className="font-bold text-center">{teacher.name}</p>
                            <p className="text-sm text-gray-600">Subject: {teacher.subject}</p>
                            <p className="text-sm text-gray-600">Distance: {teacher.distance.toFixed(2)} km</p>
                            <button
                                onClick={() => onAssign(teacher)}
                                className="mt-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 w-full text-sm">
                                Assign
                            </button>
                        </div>
                    ))}
                </div>
            ) : (
                <p className="text-gray-500 text-center">No Teacher has found yet.</p>
            )}
        </div>
  )
}

export default TeacherList