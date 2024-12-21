import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from './pages/Layout';
import Home from './pages/Home';
import MinecraftBlocks from './pages/minecraft_blocks';
import SlidePuzzle from './pages/slide_puzzle';

// This file (and function) is only for adding
// more routes/webpages
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="minecraft" element={<MinecraftBlocks />} />
          <Route path="slide_puzzle" element={<SlidePuzzle />} />
          {/* <Route path="<route_name>" element={<Component_In_Pages_Dir />} /> */}
          {/* ALSO ADD ROUTE TO Navbar DROPDOWN */}
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
