import React, { useState , useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setGridView } from "./store";
import Dropdown from 'react-bootstrap/Dropdown';
import Profile from '../profileCard/Profile';
import MobProfile from '../mobProfile/MobProfile';
import { initUser } from "../Auth/store";
import { useLocation } from 'react-router-dom';


const Header = ({ homeClick,gridIconsHidden=false }) => {
  const gridView = useSelector((state) => state?.articles?.gridView);
  const dispatch = useDispatch();


  // const location = useLocation();
  // const queryParams = new URLSearchParams(location.search);
  // const setting = queryParams.get('setting');

  


  return (
    <div className="fixed top-0 left-0 w-full bg-white shadow-md z-50">
      <div className="flex justify-between px-4  h-[70px] items-center">
        <img
          onClick={homeClick}
          style={{ cursor: 'pointer' }}
          src={require("../../assets/img/news.png")}
          className="w-[50px] h-[50px]"
          alt=""
        />
        {/* <img src={require('../img/profile.png')} className=' sm:h-[50px] w-[50px] h-[50px]' alt="" /> */}

        <div className={`flex justify-center ${gridIconsHidden && 'hidden'}`}>
          <div className="py-1 pr-1 cursor-pointer " onClick={() => dispatch(setGridView({ view: false }))}>
            {gridView === true ? (
              <svg
                // width="24px"
                // height="24px"
                width="30px"
                height="30px"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                stroke="#949494"
                stroke-width="0.00024000000000000003"
              >
                <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
                <g
                  id="SVGRepo_tracerCarrier"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                ></g>
                <g id="SVGRepo_iconCarrier">
                  {" "}
                  <path
                    fill-rule="evenodd"
                    clip-rule="evenodd"
                    d="M23 4C23 2.34315 21.6569 1 20 1H4C2.34315 1 1 2.34315 1 4V8C1 9.65685 2.34315 11 4 11H20C21.6569 11 23 9.65685 23 8V4ZM21 4C21 3.44772 20.5523 3 20 3H4C3.44772 3 3 3.44772 3 4V8C3 8.55228 3.44772 9 4 9H20C20.5523 9 21 8.55228 21 8V4Z"
                    fill="#949494"
                  ></path>{" "}
                  <path
                    fill-rule="evenodd"
                    clip-rule="evenodd"
                    d="M23 16C23 14.3431 21.6569 13 20 13H4C2.34315 13 1 14.3431 1 16V20C1 21.6569 2.34315 23 4 23H20C21.6569 23 23 21.6569 23 20V16ZM21 16C21 15.4477 20.5523 15 20 15H4C3.44772 15 3 15.4477 3 16V20C3 20.5523 3.44772 21 4 21H20C20.5523 21 21 20.5523 21 20V16Z"
                    fill="#949494"
                  ></path>{" "}
                </g>
              </svg>
            ) : (
              <svg
                // width="24px"
                // height="24px"
                width="30px"
                height="30px"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                stroke="#000000"
                stroke-width="0.00024000000000000003"
              >
                <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
                <g
                  id="SVGRepo_tracerCarrier"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                ></g>
                <g id="SVGRepo_iconCarrier">
                  {" "}
                  <path
                    fill-rule="evenodd"
                    clip-rule="evenodd"
                    d="M23 4C23 2.34315 21.6569 1 20 1H4C2.34315 1 1 2.34315 1 4V8C1 9.65685 2.34315 11 4 11H20C21.6569 11 23 9.65685 23 8V4ZM21 4C21 3.44772 20.5523 3 20 3H4C3.44772 3 3 3.44772 3 4V8C3 8.55228 3.44772 9 4 9H20C20.5523 9 21 8.55228 21 8V4Z"
                    fill="#000000"
                  ></path>{" "}
                  <path
                    fill-rule="evenodd"
                    clip-rule="evenodd"
                    d="M23 16C23 14.3431 21.6569 13 20 13H4C2.34315 13 1 14.3431 1 16V20C1 21.6569 2.34315 23 4 23H20C21.6569 23 23 21.6569 23 20V16ZM21 16C21 15.4477 20.5523 15 20 15H4C3.44772 15 3 15.4477 3 16V20C3 20.5523 3.44772 21 4 21H20C20.5523 21 21 20.5523 21 20V16Z"
                    fill="#000000"
                  ></path>{" "}
                </g>
              </svg>
            )}
          </div>
          <div className=" cursor-pointer py-1 pl-1" onClick={() => dispatch(setGridView({ view: true }))}>
            {gridView === false ? (
              <svg
                // width="24px"
                // height="24px"
                width="30px"
                height="30px"
                viewBox="0 0 24.00 24.00"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                stroke="#6b6b6b"
              >
                <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
                <g
                  id="SVGRepo_tracerCarrier"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke="#CCCCCC"
                  stroke-width="0.144"
                ></g>
                <g id="SVGRepo_iconCarrier">
                  <path
                    d="M8.4 3H4.6A1.6 1.6 0 0 0 3 4.6v3.8A1.6 1.6 0 0 0 4.6 10h3.8A1.6 1.6 0 0 0 10 8.4V4.6A1.6 1.6 0 0 0 8.4 3Z"
                    fill="#7a7a7a"
                    fill-opacity=".16"
                    stroke="#7a7a7a"
                    stroke-width="1.5"
                    stroke-miterlimit="10"
                  ></path>
                  <path
                    d="M19.4 3h-3.8A1.6 1.6 0 0 0 14 4.6v3.8a1.6 1.6 0 0 0 1.6 1.6h3.8A1.6 1.6 0 0 0 21 8.4V4.6A1.6 1.6 0 0 0 19.4 3ZM8.4 14H4.6A1.6 1.6 0 0 0 3 15.6v3.8A1.6 1.6 0 0 0 4.6 21h3.8a1.6 1.6 0 0 0 1.6-1.6v-3.8A1.6 1.6 0 0 0 8.4 14Z"
                    fill="#ffffff"
                    stroke="#7a7a7a"
                    stroke-width="1.5"
                    stroke-miterlimit="10"
                  ></path>
                  <path
                    d="M19.4 14h-3.8a1.6 1.6 0 0 0-1.6 1.6v3.8a1.6 1.6 0 0 0 1.6 1.6h3.8a1.6 1.6 0 0 0 1.6-1.6v-3.8a1.6 1.6 0 0 0-1.6-1.6Z"
                    fill="#7a7a7a"
                    fill-opacity=".16"
                    stroke="#7a7a7a"
                    stroke-width="1.5"
                    stroke-miterlimit="10"
                  ></path>
                </g>
              </svg>
            ) : (
              <svg
                // width="24px"
                // height="24px"
                width="30px"
                height="30px"
                viewBox="0 0 24.00 24.00"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                stroke="#6b6b6b"
              >
                <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
                <g
                  id="SVGRepo_tracerCarrier"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke="#CCCCCC"
                  stroke-width="0.144"
                ></g>
                <g id="SVGRepo_iconCarrier">
                  <path
                    d="M8.4 3H4.6A1.6 1.6 0 0 0 3 4.6v3.8A1.6 1.6 0 0 0 4.6 10h3.8A1.6 1.6 0 0 0 10 8.4V4.6A1.6 1.6 0 0 0 8.4 3Z"
                    fill="#000000"
                    fill-opacity=".16"
                    stroke="#000000"
                    stroke-width="1.5"
                    stroke-miterlimit="10"
                  ></path>
                  <path
                    d="M19.4 3h-3.8A1.6 1.6 0 0 0 14 4.6v3.8a1.6 1.6 0 0 0 1.6 1.6h3.8A1.6 1.6 0 0 0 21 8.4V4.6A1.6 1.6 0 0 0 19.4 3ZM8.4 14H4.6A1.6 1.6 0 0 0 3 15.6v3.8A1.6 1.6 0 0 0 4.6 21h3.8a1.6 1.6 0 0 0 1.6-1.6v-3.8A1.6 1.6 0 0 0 8.4 14Z"
                    fill="#ffffff"
                    stroke="#000000"
                    stroke-width="1.5"
                    stroke-miterlimit="10"
                  ></path>
                  <path
                    d="M19.4 14h-3.8a1.6 1.6 0 0 0-1.6 1.6v3.8a1.6 1.6 0 0 0 1.6 1.6h3.8a1.6 1.6 0 0 0 1.6-1.6v-3.8a1.6 1.6 0 0 0-1.6-1.6Z"
                    fill="#000000"
                    fill-opacity=".16"
                    stroke="#000000"
                    stroke-width="1.5"
                    stroke-miterlimit="10"
                  ></path>
                </g>
              </svg>
            )}
          </div>



          {/* <div className=" flex items-center  lg:hidden md:hidden sm:hidden  ">
            <Dropdown drop='down-centered' autoClose='outside' className='flex justify-center   '   >
              <Dropdown.Toggle bsPrefix='dropdown' className='bg-transparent  border-0 p-0 h-full     '>
                <img
                  src={require("../../component/img/profilei.png")}
                  className="w-[45px] h-[45px] cursor-pointer"
                  alt=""
                />

              </Dropdown.Toggle>

              <Dropdown.Menu className=' z-1 '>
                <Dropdown.Item className="scrollable-dropdown focus:bg-inherit hover:bg-inherit ">
                  <div className="w-[200px]">
                    <MobProfile logOutt={logOutt} />
                  </div>
                </Dropdown.Item>
              </Dropdown.Menu>

            </Dropdown>
          </div> */}
        </div>
      </div>
    </div>
  );
};

export default Header;
