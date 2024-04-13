import {BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Website from "./Layout/Website";
import { useEffect } from "react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Test from "./components/test";
import Login from "./components/login/Login";

function App() {
  return (
    <>
      <ToastContainer />
      <Router>
        <div>
          <Routes>
            <Route path="/*" element={<Website />}></Route>
            {/* <Route path="/signup" element={<Test />} />
            <Route path="/login" element={<Login />} /> */}
          </Routes>
        </div>
      </Router>
    </>
  );
}

export default App;
