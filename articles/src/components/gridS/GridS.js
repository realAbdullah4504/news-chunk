import React, { useState, useRef } from "react";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";
// import Carousel from "react-bootstrap/Carousel";
import moment from "moment";
import Modal from "react-bootstrap/Modal";
import { TbArrowBigUpFilled, TbArrowBigUp } from "react-icons/tb";
import { PiArrowFatUpLight, PiShareFatLight } from "react-icons/pi";
import { BiSolidBookmark } from "react-icons/bi";
import { AiOutlineSend } from "react-icons/ai";
import { VscComment } from "react-icons/vsc";
import { CiBookmark } from "react-icons/ci";
import { useNavigate } from "react-router-dom";
import CloseButton from "react-bootstrap/CloseButton";
import { saveArticles, unSaveArticles } from "../../api/articles";
import { toast } from "react-toastify";
import { unSave } from "../../components/Home/store";
import { useDispatch } from "react-redux";
import Carde from "../card/Card";
import { Card } from "react-bootstrap";
import { checkCompanyLogo } from "../../utils/helpers";

const GridS = ({
  data,
  log,
  users,
  handleSave,
  handleUnSave,
  handleVote,
  showSaveArticle,
  handleCopie,
}) => {
  let Navigate = useNavigate();
  const dispatch = useDispatch();

  const getLocalItems = () => {
    let list = localStorage.getItem("userLog");

    if (list) {
      return JSON.parse(list);
    }
    return [];
  };
  const id = "ali@gmail.com";

  const [expanded, setExpanded] = useState(false);
  const [modalShow, setModalShow] = React.useState(false);
  const [arrow, setArrow] = useState(false);
  const [isHovered, setHover] = useState(false);

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

  const content = expanded ? data?.content : data?.content?.slice(0, 50);
  // const title = expanded ? data?.title : data?.title?.slice(0, 30);
  const title = data?.title;
  const provider = data?.company;
  const timeAgo = moment(data?.date_created).fromNow();

  console.log("company", data.company);
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

  // modal view
  // function MyVerticallyCenteredModal(propss) {
  //   return (

  //   );
  // }

  return (
    <div className="h-full">
      <div class="p-1 h-full">
        <div class="bg-white border-inherit rounded-sm max-w-md h-full cursor-pointer">
          <div>
            {data.images?.length === 0 ? (
              <img
                className={`w-100 object-cover object-center lg:h-[275px] md:h-[300px] sm:h-40 h-36 transition-all duration-200
              `}
                src={require("../../assets/img/noImage.jpg")}
              />
            ) : (
              <Carousel
                swipeable={window.innerWidth > 768}
                emulateTouch={true}
                interval={6000}
                autoPlay={false}
                dynamicHeight={true}
                showStatus={false}
                showIndicators={false}
                showThumbs={false}
                stopOnHover={true}
                useKeyboardArrows={true}
                infiniteLoop={true}
              >
                {data?.images?.map(function (data, index) {
                  return (
                    <div
                      onMouseOver={() => setHover(true)}
                      onMouseLeave={() => setHover(false)}
                      onClick={() => setModalShow(true)}
                      key={index} // Don't forget to add a unique key when mapping
                    >
                      <img
                        className={`w-100 object-cover object-center lg:h-[275px] md:h-[300px] sm:h-40 h-36 transition-all duration-200
          `}
                        // ${   isHovered ? "opacity-50" : ""
                        // }
                        src={data || require("../../assets/img/noImage.jpg")}
                        alt="First slide"
                      />

                      {/* <Card.ImgOverlay
                        onClick={() => setModalShow(true)}
                        className={`${
                          isHovered ? "block" : "hidden"
                        } flex justify-center flex-wrap items-center bg-opacity-50 backdrop-blur-md `}
                        style={{
                          transform: "scaleX(0.9)",
                          transition: "transform 0.3s ease",
                        }}
                      >
                        <div className="flex flex-col flex-wrap  text-white">
                          <Card.Title>{provider}</Card.Title>
                          <Card.Text>{title}</Card.Text>
                          <Card.Text>{timeAgo}</Card.Text>
                        </div>
                      </Card.ImgOverlay> */}
                      {/* </Card> */}
                    </div>
                  );
                })}
              </Carousel>
            )}
          </div>

          <div className="py-2" onClick={() => setModalShow(true)}>
            <div class="flex items-center px-2">
              <img
                className="lg:h-8 md:h-8 sm:h-8  lg:w-8 md:w-8 sm:w-8 w-5 h-5 rounded-full"
                src={checkCompanyLogo(data?.company)}
              />
              {/* <div class="ml-3 "> */}
              <div className="ml-2">
                {/* <span class="text-xs font-mon text-gray-500">
                    {data?.company}{" "}
                  </span> */}
                <div
                  style={{ fontSize: "14px" }}
                  className=" block   font-semibold antialiased font-ptm  leading-tight"
                >
                  {title}{" "}
                </div>
              </div>
              {/* </div> */}
            </div>
            {/* <span class="text-xs font-bold antialiased font-ptm m-2 block leading-tight lg:hidden md:hidden sm:hidden">
              {title}{" "}
            </span> */}
            {/* <div className="w-full flex justify-end">
              <span class="text-xs font-semibold antialiased font-ptm ml-2 mt-1 text-gray-300 mr-3 block leading-tight">
                {timeAgo}
              </span>
            </div> */}
          </div>
        </div>
      </div>
      {/* <MyVerticallyCenteredModal
        show={modalShow}
        onHide={() => setModalShow(false)}
        
      /> */}
      <Modal
        show={modalShow}
        onHide={() => setModalShow(false)}
        dialogClassName="modal-50w"
        aria-labelledby="contained-modal-title-vcenter"
        centered
        backdrop="static"
        style={{ backdropFilter: "blur(4px)" }}
      >
        {/* <Modal.Header  > */}

        {/* </Modal.Header> */}
        {/* <Modal.Body style={{ padding: "1px" }}> */}
        <Modal.Body style={{ padding: "0px" }}>
          <Carde
            data={data}
            log={log}
            users={users}
            handleSave={handleSave}
            handleUnSave={handleUnSave}
            handleVote={handleVote}
            showSaveArticle={showSaveArticle}
            handleCopie={handleCopie}
            grid={true}
            setModalShow={setModalShow}
          />
          
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default GridS;
