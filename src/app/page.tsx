"use client";

import {
  useState,
  FormEvent
} from 'react';

export default function HomePage() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {

  };

  return (
    <div className="grid grid-cols-2 ">
      <div className="flex justify-center items-center w-full min-h-screen">
        <div className="border p-5 rounded rounded-lg border-gray-700">
          <form
            onSubmit={handleSubmit}
            className="flex flex-col space-y-4">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Input prompt"
              disabled={loading}
              className='border p-2 rounded-lg min-w-xl border-gray-700'
            />
            <button
              type="submit"
              disabled={loading}
              className="border rounded-lg bg-gray-500 border-gray-700 py-2 ">
              {loading ? 'Mengirim...' : 'Kirim'}
            </button>
          </form>
        </div>
      </div>

      <div className="flex justify-center items-center w-full min-h-screen">
        {output}
      </div>
    </div>
  );
}