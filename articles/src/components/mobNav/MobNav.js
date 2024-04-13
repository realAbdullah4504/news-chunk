import React, { useState, useEffect, useRef } from "react";
import Modal from "react-bootstrap/Modal";
import Avatar from "react-avatar";
import Dropdown from "react-bootstrap/Dropdown";
import { CSSTransition } from "react-transition-group";
import { companies, subCategories } from "../../utils/filters";
import MobProfile from "../mobProfile/MobProfile";
import { Badge, IconButton } from "@mui/material";
import BusinessIcon from "@mui/icons-material/Business";
import CategoryIcon from "@mui/icons-material/Category";
import BookmarkIcon from "@mui/icons-material/Bookmark";
import styled from "@emotion/styled";
import DropdownComponent from "../DropdownComponent";
// import './subdirectory/YourDropdownAnimation.css';

const StyledBadge = styled(Badge)(({ theme }) => ({
  "& .MuiBadge-badge": {
    // right: -5,
    // top: 5,
    border: `2px solid ${theme.palette.background.paper}`,
    padding: "0 4px",
    backgroundColor: "#FE7B66",
  },
}));

const MobNav = ({
  handleShowSavedArticles,
  homeClick,
  handleCompanyFilter,
  handleSubCategoryFilter,
  category,
  company,
  subCategory,
  saveStyle,
  logOutt,
}) => {
  const [show, setShow] = useState(false);
  const [show2, setShow2] = useState(false);
  const [clickedItems, setClickedItems] = useState(new Set());
  const [clickedItemsC, setClickedItemsC] = useState(new Set());

  // const handleClose = () => {
  //   setShow(false);
  //   setShow2(false);
  // };

  const [comC, setComC] = useState();
  const [subC, setSubC] = useState();

  const [provider, setProvider] = useState(false);
  const [catagory, setCategory] = useState(false);
  const [save, setSave] = useState(false);
  const [selectedProfile, setSelectedProfile] = useState(false);

  const subcategoriesList = subCategories(category);
  const [isHoveredSave, setIsHoveredSave] = useState(false);
  const [isHoveredCompany, setIsHoveredCompany] = useState(false);
  const [isHoveredSubCategory, setIsHoveredSubCategory] = useState(false);
  const [isHoveredProfile, setIsHoveredProfile] = useState(false);

  // const iconColorSave = isHoveredSave || saveStyle ? "black" : "";
  // const iconColorCompany =
  //   isHoveredCompany || provider || company.length ? "black" : "";
  // const iconColorSubCategory =
  //   isHoveredSubCategory || catagory || subCategory.length ? "black" : "";

  const iconImage = "user.png";
  // isHoveredProfile || selectedProfile ? "user-icon.png" : "user.png";

  // console.log("provider", provider);
  // console.log("subcategory", catagory);
  // console.log(isHoveredProfile, selectedProfile);

  return (
    <div className="fixed bottom-0 lg:hidden md:hidden sm:hidden z-10 block">
      <div className="fixed bottom-0 left-0 z-50 w-full h-16 bg-white border-t border-gray-200  ">
        <div className="grid h-full max-w-lg grid-cols-4 mx-auto font-medium">
          <div className="flex justify-center">
            <IconButton
              className="flex flex-col items-center justify-center"
              onMouseOver={() => setIsHoveredSave(true)}
              onMouseLeave={() => setIsHoveredSave(false)}
              // onClick={() => {
              //   handleShowSavedArticles(true);
              // }}
              // onClick={() => setProvider(!provider)}
            >
              {/* <Badge badgeContent={company?.length} color="primary"> */}
              {saveStyle ? (
                // <BookmarkIcon
                //   onClick={() => {
                //     handleShowSavedArticles(false);
                //   }}
                //   fontSize="large"
                //   style={{
                //     color: iconColorSave,
                //   }}
                // />
                <img
                  onClick={() => {
                    handleShowSavedArticles(false);
                    setSave(true);
                  }}
                  src={require("../../assets/img/save-f.png")}
                  className="w-[22px] h-[22px] cursor-pointer"
                  alt=""
                />
              ) : (
                // <BookmarkIcon
                //   onClick={() => {
                //     handleShowSavedArticles(true);
                //   }}
                //   fontSize="large"
                // />
                <img
                  onClick={() => {
                    handleShowSavedArticles(true);
                    setSave(true);
                    // setProvider(false);
                    // setCategory(false);
                  }}
                  src={require("../../assets/img/save.png")}
                  className="w-[20px] h-[20px] cursor-pointer"
                  alt=""
                />
              )}
              {/* </Badge> */}
              {/* <span
                className="text-sm text-gray-500 dark:text-gray-400 font-ptm"
                style={{ color: iconColorSave, fontSize: "10px" }}
              >
                Save
              </span> */}
            </IconButton>
          </div>

          <DropdownComponent
            isOpen={provider}
            setIsOpen={setProvider}
            selectedList={company}
            list={companies}
            handleFilter={handleCompanyFilter}
            icon="newspaper.png"
          />
          <DropdownComponent
            isOpen={catagory}
            setIsOpen={setCategory}
            selectedList={subCategory}
            list={subcategoriesList}
            handleFilter={handleSubCategoryFilter}
            icon="categories.png"
          />
          <DropdownComponent
            isOpen={selectedProfile}
            setIsOpen={setSelectedProfile}
            icon="user.png"
            component={
              <Dropdown.Menu className=" z-1 p-0 ">
                <Dropdown.Item className="scrollable-dropdown focus:bg-inherit hover:bg-inherit p-0 ">
                  <div className="w-[170px]">
                    <MobProfile logOutt={logOutt} />
                  </div>
                </Dropdown.Item>
              </Dropdown.Menu>
            }
          />
        </div>
      </div>
    </div>
  );
};

export default MobNav;
