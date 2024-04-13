import React, { useState } from "react";
import { Image } from "react-bootstrap";
import { BiSolidBookmark } from "react-icons/bi";
import { CiBookmark } from "react-icons/ci";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";

import { initUser } from "../../components/Auth/store";

function MobProfile({ logOutt }) {
  let Navigate = useNavigate();

  const userlog = useSelector((state) => state.authReducer.user);
  // console.log("userhallo", userlog);

  const user = localStorage.getItem("login");

  return (
    <div className="w-full">
      {user ? (
        // <div className=" overflow-hidden   max-w-xs  ">
        //   <div className="px-2 pb-[10px]" onClick={logOutt}>
        //     <div className="w-full flex justify-center p-1 mt-2 rounded-full cursor-pointer items-center  hover:bg-gray-100 ">

        //       <p className="  font-extrabold text-center  text-gray-600 font-ptm flex items-center  cursor-pointer">
        //         <img
        //           src={require("../../assets/img/logout.png")}
        //           className="w-[15px] h-[15px] mr-2"
        //           alt=""
        //         />
        //         Log out
        //       </p>

        //     </div>

        //   </div>
        // </div>

        <div className=" overflow-hidden   max-w-xs  ">
          <div className="px- flex justify-center ">
            <div className="w-full ">
              <div
                onClick={logOutt}
                className="w-full pl-2  bg-gray-80 rounded-t-md justify-center  py-[5px] mt- cursor-pointer items-center  hover:bg-gray-100 "
              >
                <div className="  font-semibold text-center  text-whit  font-ptm flex items-center  cursor-pointer">
                  <img
                    src={require("../../assets/img/logout.png")}
                    className="w-[15px] h-[15px] mr-2"
                    alt=""
                  />
                  Log out
                </div>
              </div>
              <div
                onClick={() => Navigate("/settings?setting=1")}
                className="w-full pl-2 justify-center  mt- rounded-full cursor-pointer items-center py-[5px]  hover:bg-gray-100 "
              >
                <div className="  font-semibold text-center  bg-gray-80 font-ptm flex items-center  cursor-pointer">
                  <img
                    src={require("../../assets/img/setting.png")}
                    className="w-[15px] h-[15px] mr-2"
                    alt=""
                  />
                  User Settings
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        //   <div className="flex justify-center w-full  ">
        //   <div
        //     onClick={logOutt}
        //     className="w-2/4 bg-gray-800 flex items-center text-white font-ptm font-bold text-center p-[10px]  rounded-l-md cursor-pointer"
        //   >
        //      <img
        //              src={require("../../assets/img/logoutW.png")}
        //              className="w-[20px] h-[20px] mr-2"
        //              alt=""
        //            />
        //   Log out
        //   </div>

        //   <div
        //    onClick={ ()=>Navigate("/settings?setting=1")}
        //     className=" w-2/4 flex items-center font-ptm font-extrabold text-center   p-[10px] text-black  cursor-pointer"
        //   >
        //       <img
        //              src={require("../../assets/img/setting.png")}
        //              className="w-[20px] h-[20px] mr-2"
        //              alt=""
        //            />
        //   User Settings
        //   </div>
        // </div>
        // <div className="flex justify-center w-full  ">
        //   <div
        //     onClick={() => Navigate("/signup")}
        //     className="w-2/4 bg-gray-800 text-white font-ptm font-bold text-center p-[10px]  rounded-l-md cursor-pointer"
        //   >
        //     Sign up
        //   </div>

        //   <div
        //     onClick={() => Navigate("/login")}
        //     className=" w-2/4 font-ptm font-extrabold text-center   p-[10px] text-black  cursor-pointer"
        //   >
        //     Log in
        //   </div>
        // </div>
        <div className=" justify-center w-full  ">
          <div
            onClick={() => Navigate("/signup")}
            className="w-2/ bg-gray-800 rounded-t-md text-white font-ptm font-semibold text-center p-[6px]  rounded-l-md cursor-pointer"
          >
            Sign up
          </div>

          <div
            onClick={() => Navigate("/login")}
            className=" w-2/ font-ptm font-semibold rounded-b-md text-center   p-[5px] text-black  cursor-pointer"
          >
            Log in
          </div>
        </div>
      )}
    </div>
  );
}

export default MobProfile;
