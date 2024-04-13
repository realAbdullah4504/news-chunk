const dropdownRef = useRef(null);
useEffect(() => {
    // Add an event listener for clicks outside the dropdown
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setProvider(false);
        setCategory(false);
        setSelectedProfile(false);
      }
      console.log("event", event);
    }

    // Attach the event listener
    document.addEventListener("mousedown", handleClickOutside);

    // Clean up the event listener when the component unmounts
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

<Dropdown
            drop="up"
            autoClose={false}
            className="flex justify-center"
            show={provider}
            ref={dropdownRef}
            // onBlur={(e) => {
            //   // Check if the click target is outside the dropdown menu
            //   console.log("e", e);
            //   if (!e.currentTarget.contains(e.relatedTarget)) {
            //     setProvider(false);
            //   }
            // }}
          >
            <Dropdown.Toggle
              bsPrefix="dropdown"
              className="bg-transparent  border-0 p-0 h-full     "
            >
              <IconButton
                className="flex flex-col items-center justify-center"
                onMouseOver={() => setIsHoveredCompany(true)}
                onMouseLeave={() => setIsHoveredCompany(false)}
                onClick={(e) => {
                  e.stopPropagation();
                  setProvider(!provider);
                  // setCategory(false);
                  // setSave(false);
                }}
                // onBlur={() => setProvider(false)}
              >
                <StyledBadge badgeContent={company?.length} color="primary">
                  {/* <BusinessIcon
                    fontSize="large"
                    style={{
                      color: iconColorCompany,
                    }}
                  /> */}
                  <img
                    src={require("../../assets/img/newspaper.png")}
                    className="w-[25px] h-[25px] cursor-pointer"
                    style={{
                      color: iconColorCompany,
                    }}
                    alt=""
                  />
                </StyledBadge>
                {/* <span
                  className="text-sm text-gray-500 dark:text-gray-400 font-ptm"
                  style={{ color: iconColorCompany, fontSize: "10px" }}
                >
                  Provider
                </span> */}
              </IconButton>
            </Dropdown.Toggle>

            <Dropdown.Menu
              className="sm:h-[100px] max-h-[75vh] overflow-y-auto fade"
              // onBlur={() => setProvider(false)}
            >
              {companies.map((data, i) => {
                return (
                  <Dropdown.Item
                    key={i}
                    // href="#/action-1"
                    className="scrollable-dropdown focus:bg-inherit whitespace-wrap "
                  >
                    {/* <div> */}
                    <div
                      onClick={() => {
                        // setComC(i)
                        handleCompanyFilter(data?.name);
                        // setProvider(true);
                      }}
                      className="flex md:justify-center sm:justify-center lg:justify-start my-1 hover:bg-gray-100 cursor-pointer "
                    >
                      {/* <div className="flex items-center justify-center"> */}

                      {/* <div className="lg:ml-3 lg:mr-3   md:ml-5 md:mr-5 sm:ml-5 sm:mr-5 cursor-pointer "></div> */}
                      <img
                        src={data?.image}
                        className="w-[20px] h-[20px] cursor-pointer"
                        alt=""
                      />

                      <div
                        className={`productPageLCatMenu font-mon mb-0  sm:hidden md:hidden lg:block ${
                          company.includes(data.name) && "text-black"
                        }`}
                      >
                        {data.name}
                      </div>
                      {/* </div> */}
                    </div>
                    {/* </div> */}
                  </Dropdown.Item>
                );
              })}
            </Dropdown.Menu>
          </Dropdown>



          <Dropdown
            autoClose={false}
            className="flex justify-center"
            drop="up-centered"
            show={catagory}
            ref={dropdownRef}
            // onBlur={(e) => {
            //   // Check if the click target is outside the dropdown menu
            //   console.log("e", e);
            //   if (!e.currentTarget.contains(e.relatedTarget)) {
            //     setCategory(false);
            //   }
            // }}
          >
            <Dropdown.Toggle
              bsPrefix="dropdown"
              className="bg-transparent border-0 p-0 h-full "
            >
              <IconButton
                className="flex flex-col items-center justify-center "
                onMouseOver={() => setIsHoveredSubCategory(true)}
                onMouseLeave={() => setIsHoveredSubCategory(false)}
                onClick={() => {
                  setCategory(!catagory);
                  // setProvider(false);
                  // setSave(false);
                }}
                // onBlur={() => setCategory(false)}
              >
                <StyledBadge badgeContent={subCategory?.length} color="primary">
                  {/* <CategoryIcon
                    fontSize="large"
                    style={{
                      color: iconColorSubCategory,
                    }}
                  /> */}
                  <img
                    src={require("../../assets/img/categories.png")}
                    className="w-[25px] h-[25px] cursor-pointer"
                    style={{
                      color: iconColorSubCategory,
                    }}
                    alt=""
                  />
                </StyledBadge>
                {/* <span
                  className="text-sm text-gray-500 dark:text-gray-400 font-ptm"
                  style={{ color: iconColorSubCategory, fontSize: "10px" }}
                >
                  Category
                </span> */}
              </IconButton>
            </Dropdown.Toggle>

            <Dropdown.Menu
              className="sm:h-[100px] max-h-[75vh] overflow-y-auto fade"
              style={{ minWidth: "220px", maxWidth: "400px" }}
              // onBlur={() => setCategory(false)}
            >
              {subcategoriesList?.map((subcategory, i) => {
                return (
                  <Dropdown.Item
                    className="scrollable-dropdown focus:bg-inherit whitespace-nowrap"
                    key={i}
                  >
                    <div>
                      <div
                        onClick={() => {
                          // setSubC(i)
                          handleSubCategoryFilter(subcategory.name);
                          // setCategory(false);
                        }}
                        className="flex md:justify-center sm:justify-center lg:justify-start my-1 hover:bg-gray-100 cursor-pointer "
                      >
                        <div className="flex items-center ">
                          <div className="lg:ml-3 lg:mr-3   md:ml-5 md:mr-5 sm:ml-5 sm:mr-5 cursor-pointer "></div>
                          {subCategory.includes(subcategory.name) ? (
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

                          <p
                            className={`productPageLCatMenu mb-0  sm:hidden md:hidden lg:block ${
                              subCategory.includes(subcategory.name) &&
                              "text-black"
                            }`}
                          >
                            {subcategory.name}
                          </p>
                        </div>
                      </div>
                    </div>
                  </Dropdown.Item>
                );
              })}
            </Dropdown.Menu>
          </Dropdown>

          
          <Dropdown
            autoClose={true}
            className="flex justify-center"
            drop="up-centered"
            ref={dropdownRef}
            // onBlur={(e) => {
            //   // Check if the click target is outside the dropdown menu
            //   console.log("e", e);
            //   if (!e.currentTarget.contains(e.relatedTarget)) {
            //     setSelectedProfile(false);
            //   }
            // }}
          >
            <Dropdown.Toggle
              bsPrefix="dropdown"
              className="bg-transparent  border-0 p-0 h-full"
            >
              <IconButton
                className="flex flex-col items-center justify-center "
                onMouseOver={() => setIsHoveredProfile(true)}
                onMouseLeave={() => setIsHoveredProfile(false)}
                onClick={() => {
                  setSelectedProfile(!selectedProfile);
                  // setProvider(false);
                  // setCategory(false);
                }}
                // onBlur={() => setSelectedProfile(false)}
              >
                <img
                  src={require(`../../assets/img/${iconImage}`)} // Use the selected image
                  className="w-[25px] h-[25px] cursor-pointer"
                  alt=""
                />
                {/* <span
                  className="text-sm text-gray-500 dark:text-gray-400 font-ptm"
                  style={
                    selectedProfile || isHoveredProfile
                      ? {
                          color: "black",
                          fontSize: "10px",
                        }
                      : { fontSize: "10px" }
                  }
                >
                  Member
                </span> */}
              </IconButton>
            </Dropdown.Toggle>

            <Dropdown.Menu className=" z-1 p-0 ">
              <Dropdown.Item className="scrollable-dropdown focus:bg-inherit hover:bg-inherit p-0 ">
                <div className="w-[170px]">
                  <MobProfile logOutt={logOutt} />
                </div>
              </Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>