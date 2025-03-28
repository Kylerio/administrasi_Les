import React, { useState } from 'react'

const Fee = () => {
    const [sessions] = useState([
        { id: 1, date: "2025-03-01", day: "Senin", duration: 1.5, rate: 200000, verified: true, paid: true },
        { id: 2, date: "2025-03-05", day: "Rabu", duration: 1.5, rate: 200000, verified: false, paid: false },
        { id: 3, date: "2025-03-10", day: "Jumat", duration: 2, rate: 200000, verified: true, paid: false },
        { id: 4, date: "2025-03-15", day: "Sabtu", duration: 2, rate: 200000, verified: true, paid: true },
      ]);

    // Hitung total pendapatan yang sudah dibayar
    const totalFeePaid = sessions
        .filter((session) => session.paid)
        .reduce((total, session) => total + session.duration * session.rate, 0);

    // Hitung total fee yang masih menunggu verifikasi
    const totalFeePending = sessions
        .filter((session) => !session.verified)
        .reduce((total, session) => total + session.duration * session.rate, 0);

    // Hitung total fee yang sudah diverifikasi tapi belum dibayar
    const totalFeeUnpaid = sessions
        .filter((session) => session.verified && !session.paid)
        .reduce((total, session) => total + session.duration * session.rate, 0);
    
    return (
        <div className="p-4 sm:p-6">
            {/* Section Title */}
            <h1 className="text-lg sm:text-xl font-semibold mb-4">Fee Details</h1>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">

                {/* Total Fee Dibayar */}
                <div className="bg-white shadow-md rounded-lg p-4 sm:p-6 border border-green-300">
                    <p className="text-xs sm:text-sm text-gray-600">Total Fee Paid</p>
                    <h2 className="text-lg sm:text-2xl font-bold text-green-600">IDR {totalFeePaid.toLocaleString()}</h2>
                </div>

                {/* Total Fee Menunggu Verifikasi */}
                <div className="bg-white shadow-md rounded-lg p-4 sm:p-6 border border-yellow-300">
                    <p className="text-xs sm:text-sm text-gray-600">Fee Pending Verification</p>
                    <h2 className="text-lg sm:text-2xl font-bold text-yellow-500">IDR {totalFeePending.toLocaleString()}</h2>
                </div>

                {/* Total Fee Sudah Diverifikasi Tapi Belum Dibayar */}
                <div className="bg-white shadow-md rounded-lg p-4 sm:p-6 border border-red-300">
                    <p className="text-xs sm:text-sm text-gray-600">Fee Not Paid</p>
                    <h2 className="text-lg sm:text-2xl font-bold text-red-500">IDR {totalFeeUnpaid.toLocaleString()}</h2>
                </div>

            </div>

            {/* Tabel Riwayat Fee */}
            <div className="mt-6 bg-white shadow-md rounded-lg overflow-hidden">
                <table className="w-full border-collapse">
                    <thead>
                        <tr className="bg-indigo-100 text-indigo-800 text-sm sm:text-base">
                            <th className="p-2 sm:p-4 text-left">Date</th>
                            <th className="p-2 sm:p-4 text-left">Day</th>
                            <th className="p-2 sm:p-4 text-right">Duration</th>
                            <th className="p-2 sm:p-4 text-right">Fee</th>
                            <th className="p-2 sm:p-4 text-center">Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {sessions.map((session) => (
                            <tr key={session.id} className="border-b hover:bg-gray-50">
                                <td className="p-2 sm:p-4">{session.date}</td>
                                <td className="p-2 sm:p-4">{session.day}</td>
                                <td className="p-2 sm:p-4 text-right">{session.duration} Hours</td>
                                <td className="p-2 sm:p-4 text-right">IDR {(session.duration * session.rate).toLocaleString()}</td>
                                <td className="p-2 sm:p-4 text-center">
                                    {session.paid ? (
                                        <span className="text-green-600 font-semibold">✅ Paid</span>
                                    ) : session.verified ? (
                                        <span className="text-red-500 font-semibold">🕒 Not Paid</span>
                                    ) : (
                                        <span className="text-yellow-500 font-semibold">⏳ Pending Verification</span>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Jika tidak ada sesi */}
            {sessions.length === 0 && (
                <div className="mt-6 p-4 sm:p-6 bg-gray-100 rounded-lg text-center text-gray-500">
                    There have been no sessions that generated fees this month.
                </div>
            )}
        </div>
    )
}

export default Fee