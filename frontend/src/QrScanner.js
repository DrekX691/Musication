// src/QrScanner.js
import React, { useEffect, useRef } from "react";
import { Html5Qrcode } from "html5-qrcode";

function QrScanner() {
  const scannerRef = useRef(null);

  useEffect(() => {
    const qrRegionId = "qr-reader";
    const html5QrCode = new Html5Qrcode(qrRegionId);

    Html5Qrcode.getCameras().then((devices) => {
      if (devices && devices.length) {
        const cameraId = devices[0].id;
        html5QrCode.start(
          cameraId,
          {
            fps: 10,
            qrbox: 250,
          },
          (decodedText) => {
            console.log("QR kód:", decodedText);
            html5QrCode.stop();
            if (decodedText.startsWith("spotify:") || decodedText.includes("spotify.com")) {
              const encoded = encodeURIComponent(decodedText);
              fetch(`${import.meta.env.VITE_BACKEND_URL}/play?track_uri=${encoded}`);
              alert("Zene lejátszása elindítva!");
            } else {
              alert("Ez nem egy Spotify QR kód.");
            }
          },
          (err) => {
            console.warn("QR hiba:", err);
          }
        );
      }
    });

    return () => {
      html5QrCode.stop().catch(() => {});
    };
  }, []);

  return (
    <div className="bg-black text-white h-screen flex flex-col justify-center items-center">
      <h1 className="text-2xl font-bold mb-4">QR-kód olvasó</h1>
      <div id="qr-reader" style={{ width: "300px" }} ref={scannerRef}></div>
    </div>
  );
}

export default QrScanner;
