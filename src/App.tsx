import { useEffect } from "react";
import { MainLayout } from "./layouts/MainLayout";

function App() {
  async function handleGetVideo() {
    const res = await fetch("http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4");
    const data = await res.json();

    console.log({ data });
  }

  useEffect(() => {
    handleGetVideo();
  }, []);

  return (
    <MainLayout>
      <video
        src="http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4"
        autoPlay
        muted
        controls
        className=""
      ></video>
    </MainLayout>
  );
}

export default App;
