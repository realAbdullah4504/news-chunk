import styled from "@emotion/styled";
import { Badge, IconButton } from "@mui/material";
import React, { useState, useRef, useEffect } from "react";
import Dropdown from "react-bootstrap/Dropdown";

const StyledBadge = styled(Badge)(({ theme }) => ({
  "& .MuiBadge-badge": {
    // right: -5,
    // top: 5,
    border: `2px solid ${theme.palette.background.paper}`,
    padding: "0 4px",
    backgroundColor: "#FE7B66",
  },
}));
const DropdownComponent = ({
  isOpen = false,
  setIsOpen,
  selectedList = [],
  list = [],
  handleFilter,
  icon = "",
  component,
}) => {
  const dropdownRef = useRef(null);
  

  const handleClick = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setIsOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClick);
    return () => {
      document.removeEventListener("mousedown", handleClick);
    };
  }, []);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div ref={dropdownRef} className="flex justify-center">
      <Dropdown
        show={isOpen}
        onClick={(e) => e.stopPropagation()}
        drop="up-centered"
      >
        <Dropdown.Toggle
          bsPrefix="dropdown"
          className="bg-transparent  border-0 p-0 h-full"
          id="dropdown-basic"
          onClick={toggleDropdown}
        >
          <IconButton className="flex flex-col items-center justify-center">
            <StyledBadge badgeContent={selectedList?.length} color="primary">
              <img
                src={require(`../assets/img/${icon}`)}
                className="w-[25px] h-[25px] cursor-pointer"
                alt=""
              />
            </StyledBadge>
          </IconButton>
        </Dropdown.Toggle>
        {component ? (
          component
        ) : (
          <Dropdown.Menu
            className="sm:h-[100px] max-h-[75vh] overflow-y-auto fade"
            style={{ minWidth: "220px", maxWidth: "400px" }}
          >
            {list?.map((data, i) => {
              return (
                <Dropdown.Item
                  key={i}
                  className="scrollable-dropdown focus:bg-inherit whitespace-wrap "
                >
                  <div
                    onClick={() => {
                      handleFilter(data?.name);
                    }}
                    className="flex md:justify-center sm:justify-center lg:justify-start my-1 hover:bg-gray-100 cursor-pointer "
                  >
                    <img
                      src={data?.image}
                      className="w-[20px] h-[20px] cursor-pointer"
                      alt=""
                    />

                    <div
                      className={`productPageLCatMenu font-mon mb-0  sm:hidden md:hidden lg:block ${
                        selectedList.includes(data.name) && "text-black"
                      }`}
                    >
                      {data.name}
                    </div>
                  </div>
                </Dropdown.Item>
              );
            })}
          </Dropdown.Menu>
        )}
      </Dropdown>
    </div>
  );
};

export default DropdownComponent;
