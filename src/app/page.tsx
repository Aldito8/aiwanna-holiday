'use client';

import { Upload } from 'lucide-react';
import { useState } from 'react';

type HolidayDestination = {
  nama_tempat: string;
  deskripsi: string;
  lokasi: string;
};

export default function Home() {
  const [prompt, setPrompt] = useState('');
  const [location, setLocation] = useState('');
  const [preview, setPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [destinations, setDestinations] = useState<HolidayDestination[]>([]);

  const createMapUrl = (name: string, location: string) => {
    const query = encodeURIComponent(`${name}, ${location}`);
    return `https://www.google.com/maps/search/?api=1&query=${query}`;
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setPreview(reader.result as string)
      };
      reader.readAsDataURL(file)
    }
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!prompt) return;

    setLoading(true);
    setError(null);
    setDestinations([]);

    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt, location }),
      });

      if (!res.ok) {
        throw new Error('Gagal mendapatkan respon dari server.');
      }

      const data = await res.json();

      setDestinations(data.recommendations);

      // const parsedRecommendations: HolidayDestination[] = JSON.parse(data.recommendations);
      // setDestinations(parsedRecommendations);

    } catch (err: any) {
      setError(err.message || 'Terjadi kesalahan. Coba lagi.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex flex-col items-center min-h-screen bg-gray-900 p-4 sm:p-8">
      <div className="w-full max-w-2xl">
        <h1 className="text-4xl sm:text-5xl font-bold text-center text-white mb-2">
          Wisata Impian
        </h1>
        <p className="text-center text-gray-400 mb-8">
          Dapatkan rekomendasi liburan dengan deskripsi yang Anda sampaikan
        </p>

        <form onSubmit={handleSubmit} className="w-full mb-8 space-y-4">
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Contoh: Pegunungan sejuk untuk keluarga..."
            className="w-full p-4 bg-gray-800 border border-gray-600 text-white rounded-lg shadow-sm focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-shadow duration-200"
            rows={3}
          />
          <h2 className='ml-2 font-semibold'>Atau dengan gambar</h2>
          <label
            htmlFor="image"
            className="flex items-center justify-center border border-gray-600 p-2 rounded-lg w-40 h-12 cursor-pointer"
          >
            <Upload size={20} />
            <span className="text-sm">Masukkan</span>
          </label>

          <input
            id='image'
            type='file'
            accept='image/*'
            className='hidden'
            onChange={handleFileChange} />

          {
            preview && (
              <div className="">
                <img
                  src={preview}
                  className="h-48 rounded-lg shadow" />
              </div>
            )
          }
          <label
            htmlFor='location'
            className='font-semibold ml-2'>
            Lokasi</label>
          <input
            id='location'
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder='Contoh: Jawa Barat'
            className='w-full p-2 bg-gray border border-gray-600 text-white rounded-lg shadow-sm focus:ring-2 focus:ring-teal-500 focus:borrder-teal-500 transition-shadow duration-200' />
          <button
            type="submit"
            disabled={loading || !prompt}
            className="w-full mt-4 px-6 py-3 bg-teal-600 text-white font-semibold rounded-lg shadow-md hover:bg-teal-700 disabled:bg-gray-500 disabled:cursor-not-allowed transition-colors duration-200"
          >
            {loading ? 'Mencari...' : 'Cari Rekomendasi'}
          </button>
        </form>

        {
          error && (
            <div className="text-center p-4 bg-red-900 bg-opacity-50 text-red-300 border border-red-700 rounded-lg">
              <strong>Error:</strong> {error}
            </div>
          )
        }

        <div className="w-full space-y-4">
          {destinations.map((dest, index) => (
            <div
              key={index}
              className="bg-gray-800 border border-gray-700 rounded-lg shadow-lg p-6 animate-fade-in"
            >
              <h3 className="text-xl font-bold text-teal-400">{dest.nama_tempat}</h3>
              <p className="text-sm text-gray-400 font-medium mb-2">{dest.lokasi}</p>
              <p className="text-gray-300 mb-4">{dest.deskripsi}</p>

              <a
                href={createMapUrl(dest.nama_tempat, dest.lokasi)}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center px-4 py-2 bg-gray-700 text-gray-200 text-sm font-medium rounded-md hover:bg-gray-600 transition-colors"
              >
                <svg
                  className="w-4 h-4 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                Lihat di Google Maps
              </a>
      </div>
          ))}
        </div>
      </div >
    </main >
  );
}