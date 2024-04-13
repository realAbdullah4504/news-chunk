import React, { useEffect } from "react";
import { Routes, Route, useLocation, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

import Home from "../components/Home";
import Test from "../components/test";
import Login from "../components/login/Login";
import { Suspense } from "react";
import { Spinner } from "react-bootstrap";
import MemberArea from "../components/memberArea/MemberArea";
import YourComponent from "../components/YourComponent";
import Header from "../components/Home/Header";
import DropdownComponent from "../components/DropdownComponent";
import ResetPassword from "../components/ResetPassword";

const ScrollToTop = () => {
  const { path } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [path]);
};
function Loading() {
  return <Spinner animation="border" />;
}
export default function Website() {
  const Navigate = useNavigate();
  const { isAuthenticated } = useSelector((state) => state.authReducer);
  console.log("auth", isAuthenticated);

  const location = useLocation();

  // Determine if the current route is '/signup' or '/login'
  const isSignupOrLoginRoute =
    location.pathname === "/signup" ||
    location.pathname === "/login" ||
    location.pathname === "/settings" ||
    location.pathname.startsWith("/reset_password/");

  const homeClick = () => {
    Navigate("/");
  };

  return (
    <>
      <ScrollToTop />

      {isSignupOrLoginRoute && (
        <Header homeClick={homeClick} gridIconsHidden={true} />
      )}
      <Routes>
        {/* <Route path="/" element={<Home />} /> */}
        {/* <Route element={<ProtectedRoute isAuthenticated={isAuthenticated} />}>
       
        </Route> */}

        <Route exact path="/" element={<Home />} />
        <Route path="/signup" element={<Test />} />
        <Route path="/login" element={<Login />} />
        <Route path="/settings" element={<MemberArea />} />
        {/* <Route path="/basic" element={<DropdownComponent />} /> */}

        <Route path="/reset_password/:key" element={<ResetPassword />} />
      </Routes>
      {/* <MobNav /> */}
    </>
  );
}
