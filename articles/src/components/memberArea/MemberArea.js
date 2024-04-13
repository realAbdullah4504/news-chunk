import React from "react";
import Setting from "./Setting";
import Header from "../Home/Header";
import { useNavigate } from "react-router-dom";

const MemberArea = () => {
  let Navigate = useNavigate();

  return (
    <div>
      <div className="h-[100vh] bg-gray-100 flex mt-[70px] pt-[20px] ">
        <div className="lg:w-[20%] md:w-[30%] lg:block md:block mr-5 ml-5  sm:hidden hidden ">
          <div className="productPageLCatMain h-[200px]  p-2">
            <div
              onClick={() => Navigate("/")}
              className="productPageLCatHeading pl-3 hover:bg-gray-100 cursor-pointer py-2 font-ptm"
            >
              -Newsfeed
            </div>
            <div className="productPageLCatHeading pl-3 hover:bg-gray-100 cursor-pointer py-2 font-ptm">
              -Members Area
            </div>
          </div>
        </div>
        <div className="lg:w-[60%]  md:w-[60%] sm:w-full w-full h-fit mt-[20px] productPageLCatMain bg-white flex justify-center">
          <div className="w-[100%]   mt-[13px] ">
            <Setting />
          </div>
        </div>
      </div>
    </div>
  );
};

export default MemberArea;
