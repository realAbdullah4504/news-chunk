import React, { useEffect, useRef, useState } from "react";
import Avatar from "react-avatar";
import Collapse from "react-bootstrap/Collapse";
import { cat, companies, subCategories } from "../../utils/filters";
import { Tab, Tabs } from "react-bootstrap";
import { Badge, IconButton } from "@mui/material";
import BusinessIcon from "@mui/icons-material/Business";
import CategoryIcon from "@mui/icons-material/Category";
import { styled } from "@mui/material/styles";

const StyledBadge = styled(Badge)(({ theme }) => ({
  "& .MuiBadge-badge": {
    // right: -5,
    top: 5,
    border: `2px solid ${theme.palette.background.paper}`,
    padding: "0 4px",
    backgroundColor:'#FE7B66' 
  },
}));
const CompanyItem = ({ company, handleClick, isSelected }) => {
  return (
    <div
      onClick={() => {
        handleClick(company.name);
        // if (loading === true) setLoad(true);
      }}
      className="flex md:justify-center sm:justify-center lg:justify-start hover:bg-gray-100 cursor-pointer pt-1 "
    >
      <div className="flex items-center justify-center">
        <div className="lg:ml-3 lg:mr-3 md:ml-5 md:mr-5 sm:ml-5 sm:mr-5 cursor-pointer">
          <img
            src={company.image}
            width={25}
            height={25}
            className="rounded-full"
            alt=""
          />
        </div>
        <p
          className={`productPageLCatMenu m-0 font-mon sm:hidden md:hidden lg:block ${
            isSelected && "text-black"
          }`}
        >
          {company.name}
        </p>
      </div>
    </div>
  );
};

const SubcategoryItem = ({ subcategory, handleClick, isSelected }) => {
  return (
    <div
      onClick={() => handleClick(subcategory.name)}
      className="flex md:justify-center sm:justify-center lg:justify-start  hover:bg-gray-100 cursor-pointer py-2"
    >
      <div className="flex items-center justify-center">
        <div className="lg:ml-3 lg:mr-3   md:ml-5 md:mr-5 sm:ml-5 sm:mr-5 cursor-pointer">
          {isSelected ? (
            <img
              src={subcategory.imageFilled}
              className="w-[25px] h-[25px] cursor-pointer"
              alt=""
            />
          ) : (
            <img
              src={subcategory.image}
              className="w-[25px] h-[25px] cursor-pointer"
              alt=""
            />
          )}
        </div>
        <p
          className={`productPageLCatMenu m-0 sm:hidden font-mon md:hidden lg:block ${
            isSelected && "text-black"
          }`}
        >
          {subcategory.name}
        </p>
      </div>
    </div>
  );
};

const ScrollView = ({
  handleFilterCategories,
  handleFilterCompanies,
  handleFilterSubCategories,
  category,
  company,
  subCategory,
  loading,
}) => {
  const [chatWidth, setChatWidth] = useState(undefined);
  const [chatWidthR, setChatWidthR] = useState(undefined);
  const [chatHightR, setChatHightR] = useState(undefined);
  const [tabWidth, setTabWidth] = useState(undefined);
  const [tabTop, setTabTop] = useState(undefined);
  const [sidebarTop, setSidebarTop] = useState(undefined);
  const [sidebarTopR, setSidebarTopR] = useState(undefined);
  const [sidebare, setSidebare] = useState("");
  const [open, setOpen] = useState(false);
  const [opene, setOpene] = useState(false);
  const [comC, setComC] = useState();
  const [subC, setSubC] = useState();
  const [subC1, setSubC1] = useState();
  const [comC1, setComC1] = useState();
  const [catC, setCatC] = useState();
  const windowWidth = useRef(window.innerWidth);
  const subcategoriesList = subCategories(category);

  const [scrollingDown, setScrollingDown] = useState(false);

  // console.log('scc' , scrollingDown);

  const [activeTab, setActiveTab] = useState("newsProvider");

  const handleTabChange = (tabName) => {
    setActiveTab(tabName);
  };
  // stick on scroll

  useEffect(() => {
    let lastScrollY = window.pageYOffset;

    const handleScroll = () => {
      const currentScrollY = window.pageYOffset;
      setScrollingDown(currentScrollY > lastScrollY);
      lastScrollY = currentScrollY;
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  // console.log('sub', subcategoriesList, 'cate', category)

  React.useEffect(() => {
    function handleResize() {
      console.log("resized to: ", window.innerWidth, "x", window.innerHeight);
      setSidebare(window.innerWidth);
    }

    window.addEventListener("resize", handleResize);
  });

  useEffect(() => {
    setSidebare(window.innerWidth);
  }, []);

  // useEffect(() => {
  //   if (chatWidth > 70) {
  //     setSidebarTop("217");
  //   } else {
  //     setSidebarTop("217");
  //   }
  // }, [chatWidth]);

  // useEffect(() => {
  //   setTabTop("10");
  // }, [tabWidth]);

  useEffect(() => {
    const chatEl = document.querySelector(".getwidthe").getBoundingClientRect();
    console.log("top", chatEl.top);
    setChatWidth(chatEl.width);
  }, [sidebare]);

  // handle scroll

  const headerStyle = {
    transform: scrollingDown ? "translateY(-120%)" : "translateY(0)",
    transition: "transform 0.3s ease-in-out",
    position: "fixed",
    top: 70,
    
    width: chatWidth,
    backgroundColor: "#ffffff", // Change to your desired background color
    // zIndex: 1000, // Adjust the z-index as needed
    // Add other header styles as needed
  };

  const bottomDivStyle = {
    transform: scrollingDown
      ? `translateY(${sidebare < 1024 ? "-75px" : "-147px"})`
      : "translateY(100px)",
    transition: "transform 0.3s ease-in-out",
    position: "fixed",
    borderRadius: "10px",

    top: sidebare < 1024 ? "145px" : "217px",

    //  top:'217px',

    width: chatWidth,
    backgroundColor: "#ffffff", // Change to your desired background color
    // zIndex: 1000, // Adjust the z-index as needed
    // Add other styles for the bottom div as needed
  };

  // left bar sticky

  // useEffect(() => {
  //   if (!sidebarTop) return;

  //   window.addEventListener("scroll", isSticky);

  //   return () => {
  //     window.removeEventListener("scroll", isSticky);
  //   };
  // }, [sidebarTop]);

  // right bar sticky

  // useEffect(() => {
  //   if (!sidebarTopR) return;

  //   window.addEventListener("scroll", StickyR);

  //   return () => {
  //     window.removeEventListener("scroll", StickyR);
  //   };
  // }, [sidebarTopR]);

  // const isSticky = (e) => {
  //   const chatEl = document.querySelector(".sidebar");
  //   const scrollTop = window.scrollY;
  //   if (scrollTop >= sidebarTop - 10) {
  //     chatEl.classList.add("is-sticky");
  //   } else {
  //     chatEl.classList.remove("is-sticky");
  //   }
  // };

  // right bar

  // const StickyR = (e) => {
  //   const chatT = document.querySelector(".sideBarR");
  //   const scrollTop = window.scrollY;
  //   if (scrollTop >= sidebarTopR - 10) {
  //     chatT.classList.add("stickyR");
  //   } else {
  //     chatT.classList.remove("stickyR");
  //   }
  // };
  return (
    <div className=" lg:w-[25%] md:w-fit sm:w-fit hidden md:block sm:block lg:block   ">
      <div className="ml-5 mr-5  ">
        <div className="lg:w-full md:w-[80px] sm:w-[80px] getwidthe">
          <div className="p-1"></div>
        </div>
        <div className="sidDash">
          {/*left side profile block*/}

          <div
            className=" mt-[10px] fixed  rounded-md pb-2 bg-white borderShadow"
            style={{ width: chatWidth }}
          >
            {/* {sidebare >= 1024 ? ( */}
              <div className={`lg:mb-0 md:mb-0 sm:mb-0 mb-[70px] ${sidebare < 1024 && 'hidden'} `}>
              <div className="w-full z-3 bg-gray-100  z-1 pt-1  px-1  flex justify-center">
                <Tabs
                  justify={true}
                  className="w-full"
                  style={{ borderRadius: 0 }} // Add this style to remove rounded borders
                >
                  {cat.map((category, index) => (
                    <Tab
                      key={index}
                      eventKey={category.catName.toLowerCase()}
                      title={
                        <div
                          onClick={() => {
                            handleFilterCategories(category.catName);
                            setCatC(index);
                          }}
                        >
                          <div className="flex justify-center">
                            <img
                              src={
                                catC === index ? category?.img : category?.img2
                              }
                              className="w-[30px] h-[30px]"
                              alt=""
                            />
                          </div>
                          <div className="text-black font-ptm">
                            {category.catName}
                          </div>
                        </div>
                      }
                    ></Tab>
                  ))}
                </Tabs>
              </div>
            </div>

            {/* ) : ( */}
              <div
                className={`productPageLCatMain lg:hidden md:w-fit sm:w-fit lg:w-fit pb-[10px] ${sidebare >= 1024 && 'hidden'} `}
                style={headerStyle}
              >
                <div className="w-full flex justify-center border-b ">
                  <div className="productPageLCatHeading font-semibold font-ptm sm:hidden md:hidden p-1   mb-0  lg:block ">
                    News Type
                  </div>
                </div>
                <div className="flex lg:justify-start md:justify-center sm:justify-center pb-2 pt-3">
                  <div className="productPageLCatHeading font-ptm sm:hidden md:hidden p-0 mb-0  lg:block ">
                    News Type
                  </div>
                </div>

                {cat.map((data, i) => {
                  return (
                    <div>
                      <div
                        onClick={() => {
                          handleFilterCategories(data?.catName);
                          setCatC(i);
                        }}
                        className="flex md:justify-center sm:justify-center lg:justify-start  hover:bg-gray-100 cursor-pointer py-2"
                      >
                        <div className="flex items-center justify-center">
                          <div className="lg:ml-3 lg:mr-3   md:ml-5 md:mr-5 sm:ml-5 sm:mr-5 cursor-pointer ">
                            <img
                              src={catC === i ? data.img : data.img2}
                              className="w-[25px] h-[25px]  "
                              alt=""
                            />
                          </div>
                          <div
                            className={`productPageLCatMenu m-0 font-ptm sm:hidden md:hidden lg:block ${
                              catC === i && "text-black"
                            }`}
                          >
                            {data.catName}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            {/* )} */}

            {/* {sidebare >= 1024 ? ( */}
              <div
                className={` mt-0 shadow-none   h-fit   overflow-x-hidden  sidebar ${sidebare < 1024 && 'hidden'} `}
                // style={{ width: chatWidth }}
                // style={bottomDivStyle}
              >
                <div className="productPageL     overflow-hidden h-fit   overflow-x-hidden sidebar bg-gray-100">
                  {/* <div className="w-full flex justify-center border-b">
                <span className="text-lg font-semibold font-ptm sm:hidden md:hidden p-1 mb-0 lg:block">
                  Filter News Articles
                </span>
              </div> */}

                  {/* Tab Headers */}
                  <ul
                    className="flex justify-center pb-1 border-t pt-2 border-b bg-gray-100"
                    style={{ cursor: "pointer" }}
                  >
                    <li
                      className={`${
                        activeTab === "newsProvider"
                          // ? "border-t-2 border-blue-500"
                          // : "border-transparent"
                      } -mb-px  font-ptm w-2/4 bg-gray-100`}
                    >
                      <div
                        // href="#"
                        className={`${
                          activeTab === "newsProvider"
                            ? "bg-white text-black"
                            : "bg-gray-100 text-gray-500 hover:bg-white hover:text-black"
                        } py-2 px-2 flex justify-center inline-block flex font-semibold items-center rounded-t-lg`}
                        onClick={(e) => {
                          e.preventDefault();
                          handleTabChange("newsProvider");
                        }}
                      >
                        {/* <BusinessIcon
                          fontSize="large"
                          style={{
                            marginRight: "5px",
                          }}
                        /> */}
                        <img
                            src={require("../../assets/img/newspaper.png")}
                            className="w-[25px] h-[25px] cursor-pointer"
                            alt=""
                          />
                        <StyledBadge
                          badgeContent={company?.length}
                          color="primary"
                        >
                          <div className=" font-ptm sm:hidden md:hidden p-1   mb-0  lg:block ">
                            Provider
                          </div>
                        </StyledBadge>
                      </div>
                    </li>
                    <li
                      className={`${
                        activeTab === "newsCategory"
                          // ? "border-t-2 border-blue-500"
                          // : "border-transparent"
                      } -mb-px mr-1 w-2/4 font-ptm `}
                    >
                      <div
                        // href="#"
                        className={`${
                          activeTab === "newsCategory"
                            ? "bg-white text-black "
                            : "bg-gray-100 text-gray-500 hover:bg-white hover:text-black"
                        } py-2 px-2 inline-block flex justify-center font-semibold flex  items-center rounded-t-lg`}
                        onClick={(e) => {
                          e.preventDefault();
                          handleTabChange("newsCategory");
                        }}
                      >
                        {/* <IconButton> */}
                        {/* <CategoryIcon
                          fontSize="large"
                          style={{
                            marginRight: "5px",
                          }}
                        /> */}
                        <img
                            src={require("../../assets/img/categories.png")}
                            className="w-[25px] h-[25px] cursor-pointer"
                            alt=""
                          />
                        {/* </IconButton> */}
                        <StyledBadge
                          badgeContent={subCategory.length}
                          color="primary"
                        >
                          <div className=" font-ptm sm:hidden md:hidden p-1   mb-0  lg:block ">
                            Category
                          </div>
                        </StyledBadge>
                      </div>
                    </li>
                  </ul>

                  {/* Tab Content */}

                  {activeTab === "newsProvider" && (
                    <div className=" max-h-[50vh] overflow-y-auto ">
                      {companies?.map((compan, index) => (
                        <div key={index} className="py-1">
                          <CompanyItem
                            company={compan}
                            handleClick={handleFilterCompanies}
                            isSelected={company.includes(compan.name)}
                          />
                        </div>
                      ))}
                    </div>
                  )}

                  {activeTab === "newsCategory" && (
                    <div className="max-h-[55vh] overflow-y-auto">
                      {subcategoriesList?.map((subcategory, index) => (
                        <div key={index} className="py-1 ">
                          <SubcategoryItem
                            subcategory={subcategory}
                            handleClick={handleFilterSubCategories}
                            isSelected={subCategory.includes(subcategory.name)}
                          />
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
             {/* ) : ( */}
              <div
                className={`productPageLCatMain h-fit max-h-[80vh]  overflow-auto lg:hidden  overflow-x-hidden pb-[10px] scroll sidebar ${sidebare >= 1024 && 'hidden'}`}
                // style={{ width: chatWidth }}
                style={bottomDivStyle}
              >
                <div className="w-full flex justify-center  border-b ">
                  <span className=" text-lg font-semibold font-ptm sm:hidden md:hidden p-1   mb-0  lg:block ">
                    Filter News Articles
                  </span>
                </div>
                <div className="flex lg:justify-start md:justify-center sm:justify-center pb-2 pt-3">
                  <h5 className="productPageLCatHeading sm:hidden font-ptm md:hidden p-0 mb-0   lg:block ">
                    News Provider
                  </h5>
                </div>

                {companies?.slice(0, 2).map((compan, index) => (
                  <CompanyItem
                    key={index}
                    company={compan}
                    handleClick={handleFilterCompanies}
                    isSelected={company.includes(compan.name)}
                  />
                ))}
                <Collapse in={opene}>
                  <div>
                    {companies?.slice(2).map((compan, index) => (
                      <div key={index} className="py-1">
                        <CompanyItem
                          company={compan}
                          handleClick={handleFilterCompanies}
                          isSelected={company.includes(compan.name)}
                        />
                      </div>
                    ))}
                  </div>
                </Collapse>

                <div className="w-full flex lg:justify-start md:justify-center  sm:justify-center">
                  <p
                    className="lg:ml-3  lg:text-base md:text-xs sm:text-xs hover:text-blue-700 cursor-pointer"
                    onClick={() => {
                      !opene ? setOpene(true) : setOpene(false);
                    }}
                  >
                    {opene ? "Less " : "More"}
                  </p>
                </div>

                <div className="flex lg:justify-start md:justify-center sm:justify-center pb-2 pt-3">
                  <h5 className="productPageLCatHeading font-ptm sm:hidden md:hidden p-0 mb-0  lg:block">
                    News Category
                  </h5>
                </div>

                {subcategoriesList?.slice(0, 2)?.map((subcategory, index) => (
                  <SubcategoryItem
                    key={index}
                    subcategory={subcategory}
                    handleClick={handleFilterSubCategories}
                    isSelected={subCategory.includes(subcategory.name)}
                  />
                ))}
                <Collapse in={open}>
                  <div>
                    {subcategoriesList?.slice(2)?.map((subcategory, index) => (
                      <div key={index} className="py-1">
                        <SubcategoryItem
                          subcategory={subcategory}
                          handleClick={handleFilterSubCategories}
                          isSelected={subCategory.includes(subcategory.name)}
                        />
                      </div>
                    ))}
                  </div>
                </Collapse>

                <div className="w-full flex lg:justify-start md:justify-center sm:justify-center">
                  <p
                    className="lg:ml-3  lg:text-base md:text-xs sm:text-xs hover:text-blue-700 cursor-pointer"
                    onClick={() => {
                      !open ? setOpen(true) : setOpen(false);
                    }}
                  >
                    {open ? "Less " : "More "}
                  </p>
                </div>
              </div>
            {/* )} */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ScrollView;
