import React, { useEffect, useRef, useState } from 'react';
import AgoraRTC from 'agora-rtc-sdk-ng';
import { X, Loader } from 'lucide-react';

const LiveStreamPlayer = ({ channelName, onClose }) => {
  const videoRef = useRef(null);
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    let client = null;
    let remoteVideoTrack = null;

    const connectToAgora = async () => {
      const appId = import.meta.env.VITE_AGORA_APP_ID;
      if (!appId || appId === 'YOUR_AGORA_APP_ID_HERE') {
        setError("Agora App ID is missing from .env");
        return;
      }

      try {
        client = AgoraRTC.createClient({ mode: "rtc", codec: "vp8" });

        client.on("user-published", async (user, mediaType) => {
          await client.subscribe(user, mediaType);
          console.log("Subscribed to user:", user.uid);
          
          if (mediaType === "video") {
            remoteVideoTrack = user.videoTrack;
            remoteVideoTrack.play(videoRef.current);
            setIsConnected(true);
          }
        });

        client.on("user-unpublished", (user) => {
          console.log("User unpublished:", user.uid);
          setIsConnected(false);
        });

        // Instructors join as audience
        await client.setClientRole("audience");
        await client.join(appId, channelName, null, null);
      } catch (err) {
        console.error("Failed to connect to Agora:", err);
        setError("Failed to connect to live stream.");
      }
    };

    connectToAgora();

    return () => {
      if (remoteVideoTrack) {
        remoteVideoTrack.stop();
      }
      if (client) {
        client.leave();
      }
    };
  }, [channelName]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="bg-[#0F172A] w-full max-w-4xl rounded-2xl overflow-hidden shadow-2xl border border-slate-700 flex flex-col">
        <div className="p-4 flex justify-between items-center bg-slate-800 border-b border-slate-700">
          <div className="flex items-center space-x-3">
            <div className="w-2.5 h-2.5 bg-red-500 rounded-full animate-pulse"></div>
            <h3 className="text-white font-bold tracking-wider">LIVE FEED: {channelName}</h3>
          </div>
          <button onClick={onClose} className="p-2 bg-slate-700 hover:bg-slate-600 rounded-full text-white transition">
            <X size={20} />
          </button>
        </div>
        
        <div className="relative aspect-video bg-black flex items-center justify-center">
          {error ? (
            <div className="text-red-400 font-bold flex flex-col items-center">
               <span className="mb-2">⚠️ {error}</span>
               <p className="text-sm text-slate-500">Check your .env configuration.</p>
            </div>
          ) : !isConnected ? (
            <div className="text-blue-400 flex flex-col items-center">
              <Loader className="animate-spin mb-3" size={32} />
              <span>Waiting for student's video feed...</span>
            </div>
          ) : null}
          
          <div ref={videoRef} className="absolute inset-0 w-full h-full object-cover"></div>
        </div>
      </div>
    </div>
  );
};

export default LiveStreamPlayer;
