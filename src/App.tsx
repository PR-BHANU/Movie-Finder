import "./App.css";
import { HomePage } from "./pages/HomePage";
import { Routes, Route } from "react-router-dom";
import { MoviePages } from "./pages/MoviePages";

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/movie/:id" element={<MoviePages type="movie" />} />
        <Route path="/tv/:id" element={<MoviePages type="tv" />} />
      </Routes>
    </>
  );
}

export default App;
