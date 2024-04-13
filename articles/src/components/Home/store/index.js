import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { axiosInstance } from "../../../api/axiosConfig";
// import articles from "../../../../data";

const paramsSerializer = (params) => {
  return Object.entries(params)
    .map(([key, value]) => {
      if (Array.isArray(value)) {
        return value
          .map((val) => `${encodeURIComponent(key)}=${encodeURIComponent(val)}`)
          .join("&");
      }
      return `${encodeURIComponent(key)}=${encodeURIComponent(value)}`;
    })
    .join("&");
};

export const fetchArticles = createAsyncThunk(
  "appArticles/fetchArticles",
  async ({ article, params }) => {
    const config = {
      headers: {
        "Access-Control-Allow-Origin": "http://localhost:3000", // Allow requests from localhost:3000
      },
      params,
      paramsSerializer: paramsSerializer,
    };

    const response = await axiosInstance.get(`${article}`, config);

    const newArticles = response.data;

    return {
      params,
      newArticles,
    };
  }
);

export const appArticlesSlice = createSlice({
  name: "appArticles",
  initialState: {
    articles: [],
    params: {},
    loading: false,
    hasMore: true,
    errorLoad: false,
    errorSave: false,
    gridView: false,
  },
  reducers: {
    setHasMore: (state, action) => {
      state.hasMore = action.payload;
    },
    initializeArticles: (state) => {
      state.articles = [];
      state.params = {};
      state.hasMore = true;
      state.errorSave = false;
      state.errorLoad = false;
    },
    setGridView: (state, action) => {
      state.gridView = action.payload.view;
    },
    setArticles: (state, action) => {
      state.articles = action.payload;
    },
    editArticle: (state, action) => {
      state.articles = state.articles.map((article) => {
        // console.log('response before', article);
        if (article.id === action.payload.id) {
          article.vote = action.payload.vote;
          // console.log('response', article, 'id', action.payload);
        }

        return article;
      });
    },
    unSave: (state, action) => {
      state.articles = state.articles.filter(
        (article) => article.id !== action.payload
      );
      if (state.articles.length === 0) state.errorSave = true;
    },
  },

  extraReducers: (builder) => {
    builder.addCase(fetchArticles.fulfilled, (state, action) => {
      if (
        action?.payload?.newArticles?.length === 0 &&
        action?.payload?.params?.last_id === ""
      ) {
        state.errorSave = true;
      } else if (action?.payload?.newArticles?.length === 0) {
        state.hasMore = false;
      } else if (action?.payload?.params?.last_id === "") {
        state.articles = action?.payload?.newArticles;
        // state.hasMore = true;
      } else {
        state.articles = [...state.articles, ...action?.payload?.newArticles];
      }
      state.params = action?.payload?.params;
      state.loading = false;
    });
    builder.addCase(fetchArticles.rejected, (state, action) => {
      console.error(action.error);
      state.loading = false;
      state.errorLoad = true;
    });
    builder.addCase(fetchArticles.pending, (state, action) => {
      console.log("pending");
      state.loading = true;
    });
  },
});

export const {
  getArticles,
  setLoading,
  hasMore,
  setCurrentPage,
  initializeArticles,
  setGridView,
  setArticles,
  editArticle,
  unSave,
} = appArticlesSlice.actions;

export default appArticlesSlice.reducer;
