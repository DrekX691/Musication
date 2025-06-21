// src/App.jsx
import React, { useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useSearchParams,
  useNavigate,
} from "react-router-dom";
import Player from "./Player";
import QrScanner from "C:\Users\DrekX\Desktop\Játék\frontend\src\QrScanner"; // ✅ 1. QR-komponens importálása

function CallbackHandler() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    const code = searchParams.get("code");
    if (code) {
      fetch(`${import.meta.env.VITE_BACKEND_URL}/callback?code=${code}`)
        .then((res) => res.json())
        .then((data) => {
          if (data.access_token) {
            localStorage.setItem("access_token", data.access_token);
            navigate("/player");
          }
        });
    }
  }, []);

  return <div className="text-white">Bejelentkezés...</div>;
}

function Login() {
  const loginUrl = `${import.meta.env.VITE_BACKEND_URL}/login`;
  return (
    <div className="flex flex-col h-screen justify-center items-center bg-black text-white">
      <h1 className="text-3xl font-bold mb-6">Musication</h1>
      <a
        href={loginUrl}
        className="bg-green-500 px-6 py-3 rounded text-white font-bold hover:bg-green-600"
      >
        Bejelentkezés Spotify fiókkal
      </a>
      <a
        href="/scan"
        className="mt-4 underline text-sm text-gray-300 hover:text-white"
      >
        vagy olvass be QR-kódot
      </a>
    </div>
  );
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/callback" element={<CallbackHandler />} />
        <Route path="/player" element={<Player />} />
        <Route path="/scan" element={<QrScanner />} /> {/* ✅ 2. Új útvonal */}
      </Routes>
    </Router>
  );
}

export default App;
