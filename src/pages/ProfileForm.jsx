import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';

const ProfileForm = () => {
    const [name, setName] = useState("");
    const [subject, setSubject] = useState("");
    const [location, setLocation] = useState("");
    const [availableDays, setAvailableDays] = useState([]);
    const [profilePicture, setProfilePicture] = useState(null);
    const navigate = useNavigate();

    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (file){
            setProfilePicture(URL.createObjectURL(file));
        }
    }

    const handleSubmit = (e) => {
        e.preventDefault();

        const profileData = {
            name,
            subject,
            location,
            availableDays,
            profilePicture
        }

        localStorage.setItem("userProfile", JSON.stringify(profileData));
        navigate("/");
    }

    return (
        <div className="flex justify-center items-center h-screen bg-gray-100">
            <div className="bg-white p-6 rounded-lg shadow-md w-96">
                <h2 className="text-xl font-semibold text-center mb-4">Lengkapi Profil</h2>

                {/* Upload Gambar */}
                <div className="flex flex-col items-center">
                    {profilePicture && <img src={profilePicture} alt="Profile" className="w-24 h-24 rounded-full mb-2" />}
                    <input type="file" accept="image/*" onChange={handleImageUpload} className="mb-4" />
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <input type="text" placeholder="Nama" className="w-full p-2 border rounded-lg" value={name} onChange={(e) => setName(e.target.value)} required />
                    <input type="text" placeholder="Mata Pelajaran" className="w-full p-2 border rounded-lg" value={subject} onChange={(e) => setSubject(e.target.value)} required />
                    <input type="text" placeholder="Lokasi" className="w-full p-2 border rounded-lg" value={location} onChange={(e) => setLocation(e.target.value)} required />
          
                    {/* Pilihan Hari */}
                    <label className="block text-sm font-medium">Hari Tersedia</label>
                    <select multiple className="w-full p-2 border rounded-lg" onChange={(e) => setAvailableDays([...e.target.selectedOptions].map(option => option.value))}>
                        <option value="Senin">Senin</option>
                        <option value="Selasa">Selasa</option>
                        <option value="Rabu">Rabu</option>
                        <option value="Kamis">Kamis</option>
                        <option value="Jumat">Jumat</option>
                        <option value="Sabtu">Sabtu</option>
                        <option value="Minggu">Minggu</option>
                    </select>

                    <button type="submit" className="w-full bg-green-600 text-white p-2 rounded-lg hover:bg-green-700 transition">Simpan Profil</button>
                </form>
            </div>
        </div>
    )
}

export default ProfileForm