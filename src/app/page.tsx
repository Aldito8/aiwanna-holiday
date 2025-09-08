import Link from 'next/link';
import Image from 'next/image';
import { FileText, Camera, MapPin, Wand2 } from 'lucide-react';

export default function WelcomePage() {
  return (
    <main className="relative flex min-h-screen flex-col items-center justify-center p-6 sm:p-8 text-white">
      <Image
        src="/bg.jpg"
        alt="Pemandangan liburan tropis"
        layout="fill"
        objectFit="cover"
        quality={80}
        className="-z-10"
      />
      <div className="absolute inset-0 bg-black/70 -z-10" />

      <div className="w-full max-w-4xl text-center">
        <h1 className="text-5xl md:text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-sky-200 to-blue-400">
          Selamat Datang di AIWanna
        </h1>

        <p className="mt-4 max-w-2xl mx-auto text-lg text-gray-200">
          Temukan destinasi liburan impian Anda dengan presisi dan inspirasi dari kecerdasan buatan.
        </p>

        <div className="mt-12 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-xl bg-white/5 p-6 backdrop-blur-sm border border-white/10">
            <FileText size={32} className="mx-auto text-sky-300" />
            <h3 className="mt-3 text-lg font-bold">Tulis Deskripsi</h3>
            <p className="mt-1 text-sm text-gray-300">Ceritakan liburan ideal yang Anda inginkan.</p>
          </div>

          <div className="rounded-xl bg-white/5 p-6 backdrop-blur-sm border border-white/10">
            <Camera size={32} className="mx-auto text-sky-300" />
            <h3 className="mt-3 text-lg font-bold">Unggah Gambar</h3>
            <p className="mt-1 text-sm text-gray-300">Berikan referensi visual untuk inspirasi.</p>
          </div>

          <div className="rounded-xl bg-white/5 p-6 backdrop-blur-sm border border-white/10">
            <MapPin size={32} className="mx-auto text-sky-300" />
            <h3 className="mt-3 text-lg font-bold">Prioritas Lokasi</h3>
            <p className="mt-1 text-sm text-gray-300">Tentukan destinasi utama jika ada.</p>
          </div>

          <div className="rounded-xl bg-white/5 p-6 backdrop-blur-sm border border-white/10">
            <Wand2 size={32} className="mx-auto text-sky-300" />
            <h3 className="mt-3 text-lg font-bold">Dapatkan Hasil</h3>
            <p className="mt-1 text-sm text-gray-300">Biarkan AI kami menemukan tempat terbaik.</p>
          </div>
        </div>

        <Link href="/recom" className="mt-12 inline-block">
          <button className="bg-gradient-to-r from-sky-500 to-blue-600 px-10 py-4 text-lg font-bold text-white rounded-full shadow-lg">
            Mulai Rencanakan
          </button>
        </Link>
      </div>
    </main>
  );
}