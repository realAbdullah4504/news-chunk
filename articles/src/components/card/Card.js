import React, { useEffect, useState, useRef } from "react";
// import Carousel from "react-bootstrap/Carousel";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import moment from "moment";
import { Tooltip, OverlayTrigger, Button } from "react-bootstrap";

import { AiOutlineSend } from "react-icons/ai";
import { Link, useNavigate } from "react-router-dom";
import { checkCompanyLogo } from "../../utils/helpers";
import { IconButton } from "@mui/material";
import styles from "./card.module.css";

const customButtonStyle = {
  backgroundColor: "#FE7B66", // Background color set to #FE7B66
  borderColor: "#FE7B66", // Border color set to #FE7B66
  color: "white", // Text color, you can adjust this as needed
};

const Card = ({
  data,
  users,
  handleSave,
  handleUnSave,
  handleVote,
  handleCopie,
  showSaveArticle,
  grid = false,
  setModalShow,
}) => {
  if (data.images && Array.isArray(data.images)) {
    // It's safe to access the length property
    var length = data.images.length;
  }

  // console.log("card", length);

  // const [sliderRef] = useKeenSlider()
  const [expanded, setExpanded] = useState(false);
  const [expandedInfo, setExpandedInfo] = useState(false);

  const [voteB, setVoteB] = useState(null);
  const [book, setBook] = useState(showSaveArticle);
  const navigate = useNavigate();

  const [comment, setComment] = useState([
    {
      name: "Ali ahmad",
      message:
        " My self : Afnan Ahmad And i wish my job in Australia can you help with me..? Massage me inbox i wait your reptm..?",
      img: "https://i.imgur.com/8Km9tLL.jpg",
    },
    {
      name: "Ali ahmad",
      message:
        " My self : Afnan Ahmad And i wish my job in Australia can you help with me..? Massage me inbox i wait your reptm..?",
      img: "https://i.imgur.com/8Km9tLL.jpg",
    },
    {
      name: "Ali ahmad",
      message:
        " My self : Afnan Ahmad And i wish my job in Australia can you help with me..? Massage me inbox i wait your reptm..?",
      img: "https://i.imgur.com/8Km9tLL.jpg",
    },
  ]);

  const vote = ["extreme_left", "left", "center", "right", "extreme_right"];
  // console.log('vote', data?.vote)

  const divCount = 5;

  const content = expanded
    ? data?.content
    : data?.content?.split(".")[0].slice(0, 150) || "";
  // console.log(data?.content?.split("."))
  const formattedContent = content.split(".").map((paragraph, index) => (
    <p key={index}>
      {paragraph.trim()}
      {index < content.split(". ").length - 1 && "."}
    </p>
  ));

  const infoGraphic = expandedInfo
    ? `
      <div>
        <p>The following infographic shows users' perceived alignment of the article.</p>
        <p>The highlighted segment indicates how the majority of users perceive the article to be, ranging from left-leaning to more neutral to right-leaning.</p>
        <p>Please log in to vote.</p>
      </div>
    `
    : "";

  const timeAgo = moment(data?.date_created).format("MMMM Do YYYY");

  const id = "ali@gmail.com";

  const toggleExpand = () => {
    setExpanded(!expanded);
  };

  // tooltip

  const tooltip = (
    <Tooltip id="tooltip" placement="right" className="in">
      View full article
    </Tooltip>
  );

  //comment text area

  const [text, setText] = useState("");
  const [comBox, setComBox] = useState("");
  const textareaRef = useRef(null);

  const handleTextChange = (event) => {
    setText(event.target.value);
    adjustTextareaHeight();
  };

  const adjustTextareaHeight = () => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  };

  const comm = () => {
    if (!comBox) {
      setComBox(true);
    } else {
      setComBox(false);
    }
  };
  // useEffect(() => {
  //   const carousel = document.querySelector('.carousel'); // Replace with an appropriate selector for your Carousel component
  //   const isMobile = window.innerWidth <= 768; // Adjust the breakpoint as needed

  //   if (isMobile && carousel) {
  //     const handleTouchStart = (e) => {
  //       e.preventDefault();
  //     };

  //     carousel.addEventListener('touchstart', handleTouchStart);

  //     return () => {
  //       carousel.removeEventListener('touchstart', handleTouchStart);
  //     };
  //   }
  // }, []);
  return (
    <div>
      <div className={`${!grid ? "pb-1 pt-1  " : ""}`}>
        <div
          className={` ${
            !grid ? "bg-white border " : ""
          }rounded-lg max-w-[600px]`}
        >
          <div class={`flex items-center ${grid && "mt-2"} px-3 pb-2 pt-3 `}>
            <img
              class="h-10 w-10 rounded-full"
              src={checkCompanyLogo(data?.company)}
            />
            <div class="relative ml-3 w-full">
              <div className=" relative flex justify-between items-center">
                <div class="productPageLCatHeading font-semibold font-ptm antialiased block leading-tight">
                  {data?.company}{" "}
                  {/* <span className="w-full flex justify-start ml-3"> */}
                  <span class="text-sm  font-ptm  text-gray-300  block leading-tight">
                    {timeAgo}
                  </span>
                  {/* </span> */}
                </div>

                <div class="flex">
                  <OverlayTrigger
                    placement="top"
                    overlay={<Tooltip>View Article</Tooltip>}
                  >
                    <IconButton>
                      <img
                        onClick={() => {
                          window.open(data?.url, "_blank");
                        }}
                        src={require("../../assets/img/share.png")}
                        className="w-[25px] h-[25px] cursor-pointer"
                        alt=""
                      />
                    </IconButton>
                  </OverlayTrigger>
                  {/* {!grid && ( */}
                  <OverlayTrigger
                    placement="top"
                    overlay={<Tooltip>Copy Article Link</Tooltip>}
                  >
                    <IconButton onClick={() => handleCopie(data?.url)}>
                      <img
                        src={require("../../assets/img/per.png")}
                        className="w-[25px] h-[25px] cursor-pointer"
                        alt=""
                      />
                    </IconButton>
                  </OverlayTrigger>
                  {/* )} */}

                  <OverlayTrigger
                    placement="top"
                    overlay={<Tooltip>Save Article</Tooltip>}
                  >
                    <div className="flex">
                      {book ? (
                        <IconButton
                          onClick={async () => {
                            const res = await handleUnSave(
                              data?.id,
                              users?.user_id
                            );
                            if (res) setBook(false);
                          }}
                        >
                          
                          <img
                            src={require("../../assets/img/save-f.png")}
                            className="w-[25px] h-[25px] cursor-pointer"
                            alt=""
                          />
                        </IconButton>
                      ) : (
                        <IconButton
                          onClick={async () => {
                            const res = await handleSave(
                              data?.id,
                              users?.user_id
                            );
                            if (res) setBook(true);
                          }}
                        >
                          <img
                            src={require("../../assets/img/save.png")}
                            className="w-[25px] h-[25px] cursor-pointer"
                            alt=""
                          />
                        </IconButton>
                      )}
                    </div>
                  </OverlayTrigger>

                  {/* {grid && (
                    // <IconButton>
                    <span>
                      <img
                        src={require("../../component/img/close.png")}
                        className="w-[25px] h-[25px] cursor-pointer hover:bg-gray-50 p-1 rounded-sm"
                        alt=""
                        onClick={() => {
                          setModalShow(false);
                        }}
                      />
                    </span>
                    // </IconButton>
                  )} */}
                </div>
                {grid && (
                  // <IconButton>
                  <span className={`${styles.close}`}>
                    <img
                      src={require("../../assets/img/close.png")}
                      className="w-[25px] h-[25px] cursor-pointer hover:bg-gray-50 p-1 rounded-sm"
                      alt=""
                      onClick={() => {
                        setModalShow(false);
                      }}
                    />
                  </span>
                  // </IconButton>
                )}
              </div>
            </div>
          </div>

          <div
            className={`pl-4 ${
              grid ? "pr-4" : "pr-3.5"
            }  flex justify-between mb-1 font-ptm text-base   items-center`}
          >
            <Link
              to={data?.url}
              target="_blank"
              className="font-semibold "
              style={{ fontSize: "14px" }}
            >
              {data?.title}
            </Link>
            {/* {grid && (
              <OverlayTrigger
                placement="top"
                overlay={<Tooltip>Copy Article Link</Tooltip>}
              >
                <IconButton
                  onClick={() => handleCopie(data?.url)}
                  // style={{ padding: "0px 6px" }}
                >
                  <img
                    src={require("../img/per.png")}
                    className="w-[25px] h-[25px] cursor-pointer"
                    alt=""
                  />
                </IconButton>
              </OverlayTrigger>
            )} */}
            {/* <OverlayTrigger
              placement="top"
              overlay={<Tooltip>View Article</Tooltip>}
            >
              <IconButton>
                <img
                  onClick={() => {
                    window.open(data?.url, "_blank");
                  }}
                  src={require("../img/share.png")}
                  className="w-[25px] h-[25px] cursor-pointer"
                  alt=""
                />
              </IconButton>
            </OverlayTrigger> */}
          </div>

          <div>
            <div className="text-gray-500 px-3 font-mon text-sm">
              {formattedContent}
              {/* {content} */}
            </div>

            <div className="my-2">
              <div className="w-[50%]">
                {data?.content?.length > 150 && (
                  <button
                    className="text-xs text-blue-600 mb-3 px-3"
                    onClick={toggleExpand}
                  >
                    {expanded ? "Read less" : "Read more"}
                  </button>
                )}
              </div>
            </div>
          </div>
          <div className="mt-2">
            {/* <Carousel data-bs-theme="dark" controls={length > 0}>
              {data?.images?.map(function (data) {
                return (
                  <Carousel.Item>
                    <img
                      className=" w-100 h-[280px]  object-cover object-center"
                      src={data}
                      alt="First slide"
                    />
                  </Carousel.Item>
                );
              })}
            </Carousel> */}

            {/* {data.images?.length === 0 ? (
              <img
                className=" w-100 h-[270px] object-center"
                src={require("../img/noImage.jpg")}
                alt="No Image"
              />
            ) : ( */}
            <Carousel
              swipeable={grid ? true : window.innerWidth > 768}
              emulateTouch={true}
              interval={6000}
              autoPlay={true}
              dynamicHeight={true}
              showStatus={false}
              showIndicators={false}
              showThumbs={false}
              stopOnHover={true}
              useKeyboardArrows={true}
              infiniteLoop={true}
              className="mx-3"
            >
              {/* Carousel items */}
              {data?.images?.map(function (data) {
                return (
                  <div>
                    <img
                      className=" w-100 h-[280px]  object-cover object-center "
                      src={data}
                      alt="First slide"
                    />
                  </div>
                );
              })}
            </Carousel>
            {/* )} */}
          </div>
          <div
            className="text-gray-900 px-3 font-ptm text-base mt-3 flex font-semibold"
            style={{ fontSize: "14px" }}
          >
            Article Neutrality Calculator
            {/* <OverlayTrigger
              placement="top"
              overlay={
                <Tooltip>
                  The following infographic shows users' perceived alignment of
                  the article The highlighted segment indicates how the majority
                  of users perceive the article to be based ranging from left
                  leaning to more neutral to right leaning
                </Tooltip>
              }
            > */}
            {/* <img
                src={require("../img/info.png")}
                className="w-[20px] h-[20px] ml-2 cursor-pointer"
                alt=""
              /> */}
            {/* </OverlayTrigger> */}
            <img
              onClick={() => {
                setExpandedInfo(!expandedInfo);
              }}
              src={require("../../assets/img/info.png")}
              className="w-[20px] h-[20px] ml-2 cursor-pointer"
              alt=""
            />
          </div>
          <div className="text-gray-500 px-3 font-mon text-sm ">
            <div dangerouslySetInnerHTML={{ __html: infoGraphic }}></div>
          </div>
          {/* <div class="flex justify-end items-center  mx-4 mt-3 mb-2">
            <div class="flex  gap-4">
              <OverlayTrigger placement="bottom" overlay={<Tooltip >View full article</Tooltip>}>
                <img
                  src={require("../img/share.png")}
                  className="w-[25px] h-[25px] cursor-pointer"

                  alt=""
                />
              </OverlayTrigger>
              <OverlayTrigger placement="bottom" overlay={<Tooltip >Share article link</Tooltip>}>
                <img
                  src={require("../img/per.png")}
                  className="w-[25px] h-[25px] cursor-pointer"

                  alt=""
                />
              </OverlayTrigger>
              <OverlayTrigger placement="bottom" overlay={<Tooltip >Save article</Tooltip>}>

                <div class="flex">
                  {book ? (
                    <img
                      src={require("../img/save-f.png")}
                      className="w-[25px] h-[25px] cursor-pointer"
                      onClick={async () => {
                        const res = await handleUnSave(data?.id, users?.user_id)
                        if (res) setBook(false);
                      }}
                      alt=""
                    />
                  ) : (
                    <img
                      src={require("../img/save.png")}
                      className="w-[25px] h-[25px] cursor-pointer"
                      onClick={async () => {
                        const res = await handleSave(data?.id, users?.user_id)
                        if (res) setBook(true);
                      }}
                      alt=""
                    />
                  )}
                </div>
              </OverlayTrigger>
            </div>
          </div> */}
          {/* <div>
            <div className="flex justify-center mt-2 mb-3 ">
              <div className=" rounded-full h-10 gap-3 w-[100%] grid grid-cols-5">
                {Array.from({ length: divCount }, (_, index) => (
                  <div
                    onClick={async () => {
                      const res = await handleVote(
                        data?.id,
                        users?.user_id,
                        vote[index]
                      );
                      if (res) setVoteB(index);
                    }}
                    className={`  border-2 ${
                      index > 0 && index < 4 ? "-skew-x-[30deg]" : ""
                      // } ${index === 0 && " w-[115%]"} ${
                    } ${index === 0 && "translate-x-3"} ${
                      // index === 4 && "-translate-x-[13%] w-[115%]"
                      index === 4 && "-translate-x-3 "
                    } ${index === 3 && "z-1"}  ${
                      index === voteB ? "bC " : "border-black"
                    } ${index < 3 && "border-r-0"} ${
                      index > 3 && "border-l-0"
                    } ${
                      voteB === 4 && index === 3 ? "border-r-gray-500" : ""
                    } ${data?.vote === vote[index] ? "bg " : "bg-white"} 
                    ${voteB === index - 1 && "border-l-gray-500"} ${
                      index === 0 && "rounded-l-full"
                    }
                     ${index === 4 && "rounded-r-full"} cursor-pointer`}
                  ></div>
                ))}
              </div>
            </div>
          </div> */}

          <div>
            <div className="flex justify-center mt-2 mb-3 ">
              <div className=" rounded-full h-10 gap-2  w-[95%] grid grid-cols-5">
                {Array.from({ length: divCount }, (_, index) => (
                  <div
                    onClick={async () => {
                      const res = await handleVote(
                        data?.id,
                        users?.user_id,
                        vote[index]
                      );
                      if (res) setVoteB(index);
                    }}
                    className={` bg-gray-200  border- ${
                      index >= 0 && index <= 4 ? "-skew-x-[30deg]" : ""
                      // } ${index === 0 && " w-[115%]"} ${
                    } ${index === 0 && "translate-x-"} ${
                      // index === 4 && "-translate-x-[13%] w-[115%]"
                      index === 4 && "-translate-x- "
                    } ${index === 3 && "z-1"}  ${
                      index === voteB ? "bC " : ""
                    } ${index < 3 && "border-r-0"} ${
                      index > 3 && "border-l-0"
                    } ${
                      voteB === 4 && index === 3 ? "border-r-gray-500" : ""
                    } ${data?.vote === vote[index] ? "bg " : "bg-gray-100"} 
                    ${voteB === index - 1 && "border-l-gray-500"} ${
                      index === 0 && styles.leftBorder
                    }
                     ${index === 4 && styles.rightBorder} cursor-pointer `}
                  ></div>
                ))}
              </div>
            </div>
          </div>

          {comBox && (
            <div>
              <div className=" flex justify-center px-3">
                <form className="flex items-center w-full">
                  <label for="voice-search" className="sr-only">
                    Comment
                  </label>
                  <div className="relative w-full">
                    <textarea
                      className=" resize-none font-robo text-[14px]  subpixel-antialiased border border-black text-[#000000E6] text-sm rounded-3xl  block w-full pl-3 p-2.5  "
                      rows="1"
                      placeholder="Add your comment..."
                      ref={textareaRef}
                      value={text}
                      onChange={handleTextChange}
                      style={{
                        height: "auto",
                        minHeight: "40px",
                        overflowY: "hidden",
                      }}
                    />
                  </div>
                  <button
                    type="submit"
                    className="inline-flex items-center text-gray-900 py-2.5 pl-3 ml-1 text-sm font-medium  rounded-lg    focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                  >
                    <AiOutlineSend size={30} className="text-gray-600" />
                  </button>
                </form>
              </div>

              <div className="px-3 my-3 ">
                {comment.map((data) => {
                  return (
                    <div className="flex my-3">
                      <img
                        src={data?.img}
                        className="rounded-full mr-1 border-solid w-[40px] h-[40px] border-white border-2 "
                      />

                      <div className="bg-gray-100 w-full p-3 rounded-xl">
                        <div className="flex justify-between">
                          <span className="font-robo text-[14px] font-bold subpixel-antialiased text-[#000000E6] ">
                            {data.name}
                          </span>
                          <span className="font-robo text-[13px]  subpixel-antialiased text-gray-400 ">
                            3w
                          </span>
                        </div>
                        <div className="pt-1">
                          <span className="font-robo text-[14px]  subpixel-antialiased text-[#000000E6] ">
                            {data.message}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Card;
