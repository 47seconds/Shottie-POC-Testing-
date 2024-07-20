import { useRef } from 'react';
import VideoPlayer from './components/VideoPlayer';

function App() {
  const videoPlayer = useRef(null);
  const shottieLink = "http://localhost:3000/uploads/shotties/StWGbEknxy/index.m3u8";

  const VideoPlayerOptions = {
    controls: true,
    responsive: true,
    fluid: true,
    sources: [
      {
        src: shottieLink,
        type: "application/x-mpegURL"
      }
    ]
  }

  const handlePlayerReady = (player) => {
    videoPlayer.current = player;

    // handling player
    player.on("waiting", () => {
      videojs.log("player is waiting");
    });

    player.on("dispose", () => {
      videojs.log("player will dispose");
    });
  }

  return (
    <>
      <h1>Shottie</h1>
      <VideoPlayer options={VideoPlayerOptions} onReady={handlePlayerReady}/>
    </>
  )
}

export default App
