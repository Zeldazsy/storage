'use client';
import { ToastContainer, toast } from 'react-toastify';
import { useState, useEffect } from 'react';
import 'react-toastify/dist/ReactToastify.css';

export default function HomePage() {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);

  async function handleUpload() {
    if (!file) return;
    setUploading(true);

    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();
      if (res.ok) {
        toast.success('✅ Uploaded! View at /upload/' + data.filename, { autoClose: false });
      } else {
        toast.error(data.error || '❌ Upload failed');
      }
    } catch (error) {
      toast.error(String(error) || '❌ An error occurred during upload.');
    } finally {
      setUploading(false);
    }
  }

  useEffect(() => {
    if (uploading) {
      toast.info('⏳ Uploading...');
    }
  }, [uploading]);

  return (
    <>
      <main className="relative flex items-center justify-center min-h-screen bg-gradient-to-br from-black via-gray-900 to-black p-12 overflow-hidden">
        <div className="relative z-10 w-full max-w-md backdrop-blur-md bg-gray-800/70 border border-gray-700 rounded-3xl shadow-2xl p-10">
          <h1 className="text-5xl font-bold text-center shimmer mb-4">
            Upload File
          </h1>
          <div className="w-24 h-1 mx-auto bg-gradient-to-r from-gray-500 via-gray-400 to-gray-600 rounded-full mb-10" />

          <div className="mb-8">
            <input
              type="file"
              onChange={(e) => setFile(e.target.files?.[0] || null)}
              className="w-full p-4 bg-gray-700/50 border border-gray-600 rounded-2xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-400 transition duration-300 hover:bg-gray-700/70"
            />
          </div>

          <button
            className={`w-full py-4 bg-gradient-to-r from-gray-500 to-gray-400 text-black rounded-2xl font-semibold text-lg uppercase tracking-wide transition-transform duration-300 transform hover:scale-105 hover:shadow-2xl focus:ring-4 focus:ring-gray-300 ${
              uploading ? 'opacity-50 cursor-not-allowed' : ''
            }`}
            onClick={handleUpload}
            disabled={uploading}
          >
            {uploading ? 'Uploading...' : 'Upload'}
          </button>
        </div>

        <style jsx>{`
          .shimmer {
            background: linear-gradient(
              90deg,
              rgba(255, 255, 255, 0.8) 0%,
              rgba(200, 200, 255, 1) 50%,
              rgba(80, 80, 160, 1) 100%
            );
            background-size: 200% 200%;
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            animation: shimmer 2.5s ease-in-out infinite;
          }
          @keyframes shimmer {
            0% {
              background-position: 200% 0;
            }
            100% {
              background-position: -200% 0;
            }
          }
        `}</style>
      </main>
      <ToastContainer
        position="top-right"
        toastStyle={{
          backgroundColor: '#1f2937', 
          color: 'white',
          borderRadius: '12px',
          boxShadow: '0 4px 14px rgba(0, 0, 0, 0.5)',
        }}
      />
    </>
  );
}
