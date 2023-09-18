import React from "react";
import Home from "./components/Home";
import { Routes, Route } from "react-router-dom";
import Room from "./components/Room";
import "./app.css"

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path={`/room/:id`} element={<Room />}></Route>
    </Routes>
  );
}

export default App;
