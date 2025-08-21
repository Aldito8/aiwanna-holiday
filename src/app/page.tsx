'use client';

import { Upload } from 'lucide-react';
import { useState } from 'react';

type HolidayDestination = {
  nama_tempat: string;
  deskripsi: string;
  lokasi: string;
};

type fallbackMessageError = {
  error: string;
}

export default function Home() {
  const [prompt, setPrompt] = useState('');
  const [location, setLocation] = useState('');
  const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [destinations, setDestinations] = useState<HolidayDestination[]>([]);
  const [fallbackMessage, setFallbackMessage] = useState<fallbackMessageError | null>(null);

  const createMapUrl = (name: string, location: string) => {
    const query = encodeURIComponent(`${name}, ${location}`);
    return `https://www.google.com/maps/search/?api=1&query=${query}`;
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImage(file);
      const reader = new FileReader();
      reader.onload = () => setPreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!prompt && !image) return;

    setLoading(true);
    setError(null);
    setDestinations([]);
    setFallbackMessage(null);

    try {
      let body: any = { prompt, location };
      if (image) {
        const base64 = await new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => resolve(reader.result as string);
          reader.onerror = reject;
          reader.readAsDataURL(image);
        });
        body.image = base64;
      }

      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Gagal mendapatkan respon dari server.');
      }

      if (data.recommendations) {
        setDestinations(data.recommendations);
      } else if (data.fallback) {
        setFallbackMessage(JSON.parse(data.fallback));
      } else if (data.error) {
        setError(data.error);
      } else {
        setError("Format respons dari server tidak dikenali.");
      }

    } catch (err: any) {
      setError(err.message || 'Terjadi kesalahan. Coba lagi.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex flex-col items-center min-h-screen bg-gray-900 p-4 sm:p-8">
      <div className="w-full max-w-2xl">
        <h1 className="text-4xl sm:text-5xl font-bold text-center text-white mb-2">Wisata Tujuan</h1>
        <p className="text-center text-gray-400 mb-8">Dapatkan rekomendasi liburan dengan deskripsi atau gambar yang Anda masukkan</p>

        <form onSubmit={handleSubmit} className="w-full mb-8 space-y-4">
          <textarea value={prompt} onChange={(e) => setPrompt(e.target.value)} placeholder="Deskripsi liburan impianmu..." className="w-full p-4 bg-gray-800 border border-gray-600 text-white rounded-lg shadow-sm focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-shadow duration-200" rows={3} />
          <div>
            <label htmlFor="image" className="flex items-center justify-center border-2 border-dashed border-gray-600 p-4 rounded-lg w-full h-24 cursor-pointer hover:bg-gray-800 hover:border-teal-500 transition-all">
              <div className="text-center">
                <Upload size={24} className="mx-auto text-gray-400" />
                <span className="text-sm text-gray-400 mt-1">Klik untuk unggah gambar</span>
              </div>
            </label>
            <input id="image" type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
          </div>
          {preview && <div><img src={preview} alt="Preview" className="h-48 rounded-lg shadow" /></div>}
          <input id="location" value={location} onChange={(e) => setLocation(e.target.value)} placeholder="Prioritas Lokasi (contoh: Bali)" className="w-full p-2 bg-gray-800 border border-gray-600 text-white rounded-lg shadow-sm focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-shadow duration-200" />
          <button type="submit" disabled={loading || (!prompt && !image)} className="w-full mt-4 px-6 py-3 bg-teal-600 text-white font-semibold rounded-lg shadow-md hover:bg-teal-700 disabled:bg-gray-500 disabled:cursor-not-allowed transition-colors duration-200">
            {loading ? 'Mencari...' : 'Cari Rekomendasi'}
          </button>
        </form>

        {error && (
          <div className="text-center p-4 bg-red-900 bg-opacity-50 text-red-300 border border-red-700 rounded-lg">
            <strong>Error:</strong> {error}
          </div>
        )}

        {fallbackMessage && (
          <div className="mt-8 p-6 bg-gray-800 border border-yellow-600 rounded-lg shadow-lg">
            <h3 className="text-lg font-semibold text-yellow-400 text-center pb-4">Pesan</h3>
            <pre className="whitespace-pre-wrap text-left bg-gray-900 p-4 rounded-md font-mono text-sm text-gray-300">
              {fallbackMessage.error}
            </pre>
          </div>
        )}

        <div className="w-full space-y-4 mt-8">
          {destinations.map((dest, index) => (
            <div key={index} className="bg-gray-800 border border-gray-700 rounded-lg shadow-lg p-6 animate-fade-in">
              <h3 className="text-xl font-bold text-teal-400">{dest.nama_tempat}</h3>
              <p className="text-sm text-gray-400 font-medium mb-2">{dest.lokasi}</p>
              <p className="text-gray-300 mb-4">{dest.deskripsi}</p>
              <a href={createMapUrl(dest.nama_tempat, dest.lokasi)} target="_blank" rel="noopener noreferrer" className="inline-flex items-center px-4 py-2 bg-gray-700 text-gray-200 text-sm font-medium rounded-md hover:bg-gray-600 transition-colors">
                📍 Lihat di Google Maps
              </a>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}