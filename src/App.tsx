import { ToastContainer } from "react-toastify";
import { Player } from "./components/videoForm/Player";
import { MainLayout } from "./layouts/MainLayout";

function App() {
  return (
    <>
      <MainLayout>
        <Player />
      </MainLayout>
      <ToastContainer />
    </>
  );
}

export default App;
