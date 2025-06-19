





































# qr_generator/generate_qr_codes.py
import spotipy
from spotipy.oauth2 import SpotifyClientCredentials
import qrcode
import os
import csv

CLIENT_ID = os.getenv("SPOTIFY_CLIENT_ID") or "be32799ce1d2447dabe016a8f4c4d1e6"
CLIENT_SECRET = os.getenv("SPOTIFY_CLIENT_SECRET") or "6d3600dc100b4e489f260c64f483f87c"
PLAYLIST_URL = "https://open.spotify.com/playlist/54s1LoPcFzxyfhxefoZS4z"
QR_DIR = "qr_codes"
MAPPING_CSV = "track_mapping.csv"
BASE_URL = "https://spotify-qr.vercel.app/player?id="  # vagy localhost teszthez

sp = spotipy.Spotify(auth_manager=SpotifyClientCredentials(client_id=CLIENT_ID, client_secret=CLIENT_SECRET))

if not os.path.exists(QR_DIR):
    os.makedirs(QR_DIR)

playlist_id = PLAYLIST_URL.split("playlist/")[1].split("?")[0]
tracks = sp.playlist_tracks(playlist_id)["items"]

with open(MAPPING_CSV, "w", newline='', encoding="utf-8") as f:
    writer = csv.writer(f)
    writer.writerow(["Track ID", "Name", "Artist"])
    for item in tracks:
        track = item["track"]
        track_id = track["id"]
        name = track["name"]
        artist = ", ".join([a["name"] for a in track["artists"]])
        url = BASE_URL + track_id

        img = qrcode.make(url)
        img.save(os.path.join(QR_DIR, f"{track_id}.png"))

        writer.writerow([track_id, name, artist])

print("✅ QR-kódok generálva.")
# Példa QR generátor Python szkript