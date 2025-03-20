import React, { useState } from 'react'

const ViewListFee = () => {
    // Data fee teacher (contoh data)
    const [fees, setFees] = useState([
        { id: 1, teacher: "Pak Budi", amount: 500000, date: "2025-02-10", status: "Unpaid" },
        { id: 2, teacher: "Bu Siti", amount: 800000, date: "2025-02-15", status: "Unpaid" },
        { id: 3, teacher: "Pak Andi", amount: 600000, date: "2025-03-05", status: "Unpaid" },
        { id: 4, teacher: "Bu Rina", amount: 450000, date: "2025-03-10", status: "Paid" }, // Sudah dibayar, tidak akan ditampilkan
    ]);

     // State untuk filter bulan
    const [selectedMonth, setSelectedMonth] = useState("2025-02");

    // Fungsi untuk menghitung deadline pembayaran (tanggal 5 bulan berikutnya)
    const calculateDeadline = (dateString) => {
        const date = new Date(dateString);
        date.setMonth(date.getMonth() + 1); // Pindah ke bulan berikutnya
        date.setDate(5); // Set tanggal 5
        return date.toISOString().split("T")[0]; // Format YYYY-MM-DD
    };

    // Filter fee berdasarkan bulan yang dipilih & status "Unpaid"
    const filteredFees = fees.filter(fee => 
        fee.date.startsWith(selectedMonth) && fee.status === "Unpaid"
    );

    return (
        <div className="p-4">
            <h2 className="text-xl font-semibold mb-4">Teacher Fee - Unpaid</h2>

            {/* Filter Bulan */}
            <div className="mb-4">
                <label className="mr-2 font-medium">Select Month:</label>
                <input 
                    type="month"
                    value={selectedMonth}
                    onChange={(e) => setSelectedMonth(e.target.value)}
                    className="border p-2 rounded-lg"
                />
            </div>

            {/* Tabel Fee - Desktop */}
            <div className="hidden md:block overflow-x-auto mt-4">
                <table className="w-full border-collapse">
                    <thead>
                        <tr className="bg-indigo-500 text-white text-left">
                            <th className="p-2">Teacher Name</th>
                            <th className="p-2">Total Fee</th>
                            <th className="p-2">Payment Deadline</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredFees.length > 0 ? (
                            filteredFees.map((fee) => (
                                <tr key={fee.id} className="border-b hover:bg-indigo-50">
                                    <td className="p-2">{fee.teacher}</td>
                                    <td className="p-2">IDR {fee.amount.toLocaleString()}</td>
                                    <td className="p-2 text-red-500 font-semibold">{calculateDeadline(fee.date)}</td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="4" className="p-4 text-center text-gray-500">There are no fees unpaid for this month.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* List untuk Mobile */}
            <div className="md:hidden">
                {filteredFees.length > 0 ? (
                    filteredFees.map((fee) => (
                        <div key={fee.id} className="border p-4 mb-4 bg-gray-100 rounded-lg shadow-sm">
                            <p><strong>Teacher Name:</strong> {fee.teacher}</p>
                            <p><strong>Total Fee:</strong> IDR {fee.amount.toLocaleString()}</p>
                            <p className="text-red-500 font-semibold">
                                <strong>Payment Deadline:</strong> {calculateDeadline(fee.date)}
                            </p>
                        </div>
                    ))
                ) : (
                    <p className="text-center text-gray-500">There are no fees unpaid for this month.</p>
                )}
            </div>
        </div>
    )
}

export default ViewListFee