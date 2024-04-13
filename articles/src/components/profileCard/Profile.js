import React, { useState } from "react";
import { Image } from "react-bootstrap";
import { BiSolidBookmark } from "react-icons/bi";
import { CiBookmark } from "react-icons/ci";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";


import { initUser } from "../../components/Auth/store";

function Profile({ logOutt, handleShowSavedArticles, loading, saveStyle }) {
  let Navigate = useNavigate();

  const userlog = useSelector((state) => state.authReducer.user);
  // console.log("userhallo", userlog);

  const user = JSON.parse(localStorage.getItem("login"));

  // console.log('userlog' , user.email)

  return (
    <div className="w-full">
      {user ? (
        <div className=" overflow-hidden   max-w-xs pt-[20px] ">
          <div className="flex justify-center ">
            <Image
              src={require("../../assets/img/profile.png")}
              className=" w-[70px] h-[70px] rounded-full border-solid border-white border-2 "
            />
          </div>
          <div className="text-center px-3 pb-6 pt-2">
            <h3 className=" text-sm bold font-mon">{user?.username}</h3>
            <p className="mt-2 font-mon  font-light text-sm">{user?.email}</p>
          </div>
          <div className="flex justify-center items-center   pb-3 border-b">
            <div className="text-center mr-3 border-r pr-3 cursor-pointer ">
              <div className="flex justify-center h-[16px] ">
                {saveStyle ? (
                  // <BiSolidBookmark onClick={showSaved} className="w-[14px]" />
                  <img
                    onClick={() => handleShowSavedArticles(false)}
                    src={require("../../assets/img/save-f.png")}
                    className="w-[14px] h-[14px]"
                    alt=""
                  />
                ) : (
                  // <CiBookmark onClick={showSaved} className="w-[14px]" />
                  <img
                    onClick={() => handleShowSavedArticles(true)}
                    src={require("../../assets/img/save.png")}
                    className="w-[14px] h-[14px]"
                    alt=""
                  />
                )}
              </div>

              <span className="font-mon text-sm">Show Saved</span>
            </div>

            <div
              // onClick={save}
              className=" text-center flex items-center  cursor-pointer   "
              onClick={()=>Navigate("/settings")}
            >
              <div    >
                <div className="flex justify-center h-[16px] ">
                  {/* <BiSolidBookmark  className="w-[14px]" /> */}
                  <img
                    src={require("../../assets/img/setting.png")}
                    className="w-[14px] h-[14px]"
                    alt=""
                  />
                </div>
                <span className="font-mon text-sm">User Settings</span>
              </div>
            </div>
          </div>
          <div className="px-2 pb-[10px]" onClick={logOutt}>
            <div className="w-full flex justify-center p-1 mt-2 rounded-full cursor-pointer items-center  hover:bg-gray-100 ">
              <div className=" font-extrabold text-center text-base  text-gray-600 font-ptm flex items-center  cursor-pointer">
                <img
                  src={require("../../assets/img/logout.png")}
                  className="w-[15px] h-[15px] mr-2"
                  alt=""
                />
                Log out
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex justify-center w-full ">
          <div
            onClick={() => Navigate("/signup")}
            className="w-2/4 bg-gray-800 text-white font-ptm font-bold text-center p-[10px]  rounded-l-md cursor-pointer"
          >
            Sign up
          </div>

          <div
            onClick={() => Navigate("/login")}
            className=" w-2/4 font-ptm font-extrabold text-center   p-[10px] text-black  cursor-pointer"
          >
            Log in
          </div>
        </div>
      )}
    </div>
  );
}

export default Profile;
