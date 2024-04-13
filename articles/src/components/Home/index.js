import React, { useEffect, useState } from "react";
import Card from "../card/Card";
import Profile from "../profileCard/Profile";
import GridS from "../gridS/GridS";
import Tab from "react-bootstrap/Tab";
import Tabs from "react-bootstrap/Tabs";

import MobNav from "../mobNav/MobNav";

//redux imports
import { useSelector, useDispatch } from "react-redux";
import {
  editArticle,
  fetchArticles,
  initializeArticles,
  setArticles,
  unSave,
} from "./store";
import { initUser, setUser } from "../Auth/store";

//import for INFINITE SCROLL
import InfiniteScroll from "react-infinite-scroll-component";
import ScrollView from "./ScrollView";
import Header from "./Header";
import {
  saveArticles,
  unSaveArticles,
  unVoteArticles,
  voteArticles,
} from "../../api/articles";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import StickyHeader from "../modal/modal";
import TabComponent from "./TabComponent";
import { Skeleton } from "@mui/material";

const Home = () => {
  // const limitedData = data.slice(0, 15);
  // for sticky useState
  const [WidthR, setWidthR] = useState(undefined);
  const [log, setLog] = useState(false);

  // console.log("clickItems", clickedItems);

  //For Articles Fetching

  const categoriesList = ["General", "Sports", "Lifestyle"];

  const dispatch = useDispatch();
  let Navigate = useNavigate();

  const [lastId, setLastId] = useState("");
  const [showSaveArticle, setShowSaveArticle] = useState(false);

  const [isRequestPending, setIsRequestPending] = useState(false);
  const [changing, setChanging] = useState();
  const [saveStyle, setSaveStle] = useState(false);

  const [category, setCategory] = useState("General");
  const [subCategory, setSubCategory] = useState([]);
  const [company, setCompany] = useState([]);

  const articles = useSelector((state) => state.articles.articles);
  const hasMore = useSelector((state) => state.articles.hasMore);
  const loading = useSelector((state) => state.articles.loading);
  const params = useSelector((state) => state.articles.params);
  const gridView = useSelector((state) => state.articles.gridView);
  const users = useSelector((state) => state.authReducer.user);
  const errorLoad = useSelector((state) => state.articles.errorLoad);
  const errorSave = useSelector((state) => state.articles.errorSave);

  // console.log("articles", articles);
  // console.log("params", params);
  // console.log("--------user--------------------------", users);

  //-------------------------------Login Log Out-----------------------------

  // const user = localStorage.getItem("userLog");

  //............................get width .................................

  React.useEffect(() => {
    function handleResizeee() {
      // console.log("resized to: ", window.innerWidth, "x", window.innerHeight);
      setChanging(window.innerWidth);
    }

    window.addEventListener("resize", handleResizeee);
  });

  useEffect(() => {
    const chatEl = document
      .querySelector(".getwidtheR")
      .getBoundingClientRect();

    setWidthR(chatEl.width);
  }, [changing]);
  //.......................................................................

  useEffect(() => {
    const login = localStorage.getItem("login");

    if (login) {
      setLog(true);
      dispatch(setUser({ user: JSON.parse(login) }));
    }
  }, []);

  const logOutt = () => {
    localStorage?.removeItem("login");
    localStorage?.removeItem("access_token");
    setLog(false);
    dispatch(initUser({}));
    toast.success("Log Out Successfully");
    // window.location.reload();
  };

  //-------------------------------get the data-----------------------------

  const fetchArticlesData = (showSaveArticle) => {
    // console.log(
    //   "------------------------dffds-----------------------------------------",
    //   lastId
    // );

    const params = {
      category,
      subcategory: subCategory,
      company,
      last_id: lastId,
    };

    if (showSaveArticle) {
      params.user_id = users?.user_id;
    }

    const articleEndpoint = showSaveArticle
      ? "/get_saved_articles"
      : "/articles";

    dispatch(fetchArticles({ article: articleEndpoint, params }));
  };

  // Use the useEffect to call the fetchArticlesData function
  useEffect(() => {
    if (!loading) fetchArticlesData(showSaveArticle);
  }, [dispatch, lastId, category, subCategory, company, showSaveArticle]);

  const fetchMoreData = () => {
    setLastId(articles[articles.length - 1]?.id);
  };

  //-------------------------------Filtration-----------------------------
  const homeClick = () => {
    dispatch(initializeArticles({}));
    setCategory("General");
    setSubCategory([]);
    setCompany([]);
    setShowSaveArticle(false);
    setLastId("");
    setSaveStle(false);
  };
  const handleFilterCategories = (name) => {
    dispatch(initializeArticles({}));
    // setTop(true);
    setCategory(name);
    setSubCategory([]);
    setCompany([]);
    setLastId("");
    // console.log('category',name)
  };

  const handleClick = (filter) => {
    if (loading) return;

    dispatch(initializeArticles({}));
    setLastId("");
    if (company.includes(filter)) {
      const filtered = company.filter((f) => f !== filter);

      setCompany(filtered);
    } else {
      setCompany([...company, filter]);
    }
  };

  const handleClickC = (filter) => {
    if (loading) return;

    setLastId("");
    dispatch(initializeArticles({}));
    if (subCategory.includes(filter)) {
      const filtered = subCategory.filter((f) => f !== filter);

      setSubCategory(filtered);
    } else {
      setSubCategory([...subCategory, filter]);
    }
  };

  const handleShowSavedArticles = (type) => {
    if (loading) return;

    if (log) {
      dispatch(initializeArticles({}));
      setSubCategory([]);
      setCompany([]);
      setLastId("");
      setShowSaveArticle(type);
      setSaveStle(type);
    } else {
      toast.warning("Please Log In to Show Saved Articles");
    }
  };

  //-------------------------------Save Unsave Articles-----------------------------

  const handleSave = async (id, userId) => {
    if (isRequestPending) {
      return; // Prevent multiple requests if one is already pending
    }

    setIsRequestPending(true);

    try {
      if (log) {
        await saveArticles(id, userId); // Assuming saveArticles handles errors internally
        return true;
      } else {
        // Navigate("/login");
        toast.warning("Please Log In To Save Article");
      }
    } finally {
      // Reset the request pending state after a delay (e.g., 1 second)
        setIsRequestPending(false);
    }
  };


  const handleUnSave = async (id, userId) => {
    if (isRequestPending) {
      return; // Prevent multiple requests if one is already pending
    }

    setIsRequestPending(true);
    // console.log("login.......", log);
    try {
      if (log) {
        const response = await unSaveArticles(id, userId);

        if (showSaveArticle && response) {
          dispatch(unSave(id));
        }
        return true;
      } else {
        toast.warning("Please Log In To UnSave Article");
      }
    } finally {
      setIsRequestPending(false);
    }
  };

  const handleCopie = (link) => {
    navigator.clipboard.writeText(link);
    toast.success("Article Link Copied to Clipboard");
  };

  const handleVote = async (articleId, userId, vote_type) => {
    // console.log("vote", vote[id]);
    if (isRequestPending) {
      return; // Prevent multiple requests if one is already pending
    }

    setIsRequestPending(true);

    try {
      if (log) {
        const res = await unVoteArticles(articleId, userId);

        if (res) {
          const { score } = await voteArticles(articleId, userId, vote_type);
          dispatch(editArticle({ id: articleId, vote: score }));
          // console.log('response', score, 'id', articleId);
          return true;
        }
      } else {
        // Navigate("/login");
        toast.warning("Please Log In To Vote Article");
      }
    } finally {
      // Reset the request pending state after a delay (e.g., 1 second)
        setIsRequestPending(false);
    }
  };

  const handleUnVote = async (articleId, userId) => {
    const response = await unVoteArticles(articleId, userId);
    // console.log(response);
  };

  // console.log("book", book, "showSaved", showSaveArticle);

  return (
    <>
      <Header logOutt={logOutt} homeClick={homeClick} />

      <div className="pt-[1px] bg-gray-100 min-h-[100vh] mt-[70px]">
        {/* <StickyHeader /> */}

        {/*Tab for mobail view*/}
        <div className="lg:mb-0 md:mb-0 sm:mb-0 mb-[70px] ">
          <div className="lg:hidden md:hidden sm:hidden w-full z-3 bg-gray-100 fixed z-1 pt-1  px-2  flex justify-center">
            <Tabs justify={true} className="w-full">
              {categoriesList.map((category, index) => (
                <Tab
                  key={index}
                  eventKey={category.toLowerCase()}
                  title={
                    <div onClick={() => handleFilterCategories(category)}>
                      <div className="flex justify-center">
                        <img
                          src={require(`../../assets/img/${category.toLowerCase()}-icon.png`)}
                          className="w-[30px] h-[30px]"
                          alt=""
                        />
                      </div>
                      <div className="text-black font-ptm">{category}</div>
                    </div>
                  }
                ></Tab>
              ))}
            </Tabs>
          </div>
        </div>
        <div className="md:flex lg:flex sm:flex  lg:justify-center">
          <ScrollView
            handleFilterCategories={handleFilterCategories}
            handleFilterCompanies={handleClick}
            handleFilterSubCategories={handleClickC}
            category={category}
            company={company}
            subCategory={subCategory}
            loading={loading}
          />

          {/*center*/}
          <div className="lg:w-[50%] md:w-[70%] sm:w-9/12 w-full   mt-[13px] lg-mb-0 md:mb-0 sm:mb-0 mb-5">
            <div className=" w-full flex justify-center ">
              {errorLoad ? (
                <img
                  // onClick={homeClick}
                  style={{ cursor: "pointer" }}
                  src={require("../../assets/img/artical-error.png")}
                  className="w-[500px] h-[500px]"
                  alt=""
                />
              ) : showSaveArticle && errorSave ? (
                <img
                  // onClick={homeClick}
                  style={{ cursor: "pointer" }}
                  src={require("../../assets/img/artical3.png")}
                  className="w-[500px] h-[500px]"
                  alt=""
                />
              ) : (
                <div>
                  <InfiniteScroll
                    dataLength={articles?.length}
                    next={fetchMoreData}
                    hasMore={hasMore}
                    loader={loading && <div>loading</div>}
                    className="overflow-x-hidden"
                  >
                    <div
                      className={
                        !gridView
                          ? ""
                          : "grid grid-cols-2 md:grid-cols-2 sm:grid-cols-2 lg:grid-cols-2 w-full h-full"
                      }
                    >
                      {articles?.map((data) => (
                        <div key={data?.id} className="">
                          {!gridView ? (
                            <Card
                              data={data}
                              log={log}
                              users={users}
                              handleSave={handleSave}
                              handleUnSave={handleUnSave}
                              handleVote={handleVote}
                              showSaveArticle={showSaveArticle}
                              handleCopie={handleCopie}
                            />
                          ) : (
                            <GridS
                              data={data}
                              log={log}
                              users={users}
                              handleSave={handleSave}
                              handleUnSave={handleUnSave}
                              handleVote={handleVote}
                              showSaveArticle={showSaveArticle}
                              handleCopie={handleCopie}
                            />
                          )}
                        </div>
                      ))}
                    </div>
                  </InfiniteScroll>
                </div>
              )}
            </div>
          </div>

          <MobNav
            handleShowSavedArticles={handleShowSavedArticles}
            homeClick={homeClick}
            handleCompanyFilter={handleClick}
            handleSubCategoryFilter={handleClickC}
            category={category}
            company={company}
            subCategory={subCategory}
            saveStyle={saveStyle}
            logOutt={logOutt}
          />

          {/*Right side*/}

          <div className="lg:w-[20%] md:w-[30%] lg:block md:block   sm:hidden hidden  ">
            <div className="w-[90%] bg-purple-700 getwidtheR"></div>
            <div style={{ width: WidthR }} className=" fixed ml-4 mr-4 ">
              <div className="sidDash">
                <div
                  className={`productPageLCatMain lg:flex lg:justify-center md:w-full sm:w-fit pb-0 lg:w-full  md:flex sm:hidden hidden `}
                >
                  <Profile
                    logOutt={logOutt}
                    handleShowSavedArticles={handleShowSavedArticles}
                    loading={loading}
                    saveStyle={saveStyle}
                  />
                </div>
                {/* <div
                  className="productPageLCatMain  p-2"
                  style={{ width: WidthR }}
                >
                  <h5 className="productPageLCatHeading font-ptm">
                    Trending themes
                  </h5>
                  <p className="productPageLCatMenu font-mon">
                    today letest updates
                  </p>
                  <p className="productPageLCatMenu font-mon">
                    today letest updates
                  </p>
                  <p className="productPageLCatMenu font-mon">
                    today letest updates
                  </p>
                  <p className="productPageLCatMenu font-mon">
                    today letest updates
                  </p>
                </div> */}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;
