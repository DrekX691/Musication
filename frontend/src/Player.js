import React, { useEffect, useState } from "react";

const Player = ({ trackUri }) => {
  const [player, setPlayer] = useState(null);

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://sdk.scdn.co/spotify-player.js";
    script.async = true;
    document.body.appendChild(script);

    window.onSpotifyWebPlaybackSDKReady = () => {
      const token = localStorage.getItem("spotify_access_token");
      const player = new window.Spotify.Player({
        name: "Musication Player",
        getOAuthToken: cb => { cb(token); },
        volume: 0.5
      });

      setPlayer(player);

      player.addListener("ready", ({ device_id }) => {
        console.log("Ready with Device ID", device_id);
        // Automatikusan elindítjuk a zenét
        playTrack(token, device_id, trackUri);
      });

      player.addListener("not_ready", ({ device_id }) => {
        console.log("Device ID has gone offline", device_id);
      });

      player.connect();
    };
  }, [trackUri]);

  const playTrack = (token, device_id, uri) => {
    fetch(`https://api.spotify.com/v1/me/player/play?device_id=${device_id}`, {
      method: "PUT",
      body: JSON.stringify({ uris: [uri] }),
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      }
    }).then(res => {
      if (!res.ok) {
        console.error("Nem sikerült elindítani a zenét:", res.statusText);
      }
    });
  };

  return (
    <div>
      <p>Spotify zenelejátszó aktiválva</p>
    </div>
  );
};

export default Player;
