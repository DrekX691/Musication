







































// frontend/src/App.js
import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";

export default function App() {
  const [searchParams] = useSearchParams();
  const [track, setTrack] = useState(null);
  const [audio, setAudio] = useState(null);
  const [loading, setLoading] = useState(true);
  const id = searchParams.get("id");

  useEffect(() => {
    async function fetchTrack() {
      try {
        const res = await fetch(`https://your-backend-url.onrender.com/track/${id}`);
        const data = await res.json();
        setTrack(data);
        setAudio(new Audio(data.url));
        setLoading(false);
      } catch (err) {
        console.error("Hiba a dal betöltésekor", err);
      }
    }
    if (id) fetchTrack();
  }, [id]);

  if (loading) return <div className="text-center">Betöltés...</div>;

  return (
    <div className="min-h-screen flex flex-col justify-center items-center gap-4">
      <div className="text-xl">🎵 {track.name}</div>
      <div className="text-gray-500">👤 {track.artist}</div>
      <div className="flex gap-4 mt-4">
        <button onClick={() => audio.play()} className="bg-green-600 text-white px-4 py-2 rounded">Lejátszás</button>
        <button onClick={() => audio.pause()} className="bg-red-600 text-white px-4 py-2 rounded">Megállítás</button>
        <button onClick={() => window.location.href = "/"} className="bg-gray-600 text-white px-4 py-2 rounded">Új QR</button>
      </div>
    </div>
  );
}
// Példa frontend React komponens