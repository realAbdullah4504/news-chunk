import { toast } from "react-toastify";
import { axiosInstance } from "../axiosConfig";

export const saveArticles = async (id, userId) => {
  try {
    const response = await axiosInstance.post(`/save_article?user_id=${userId}&article_id=${id}`);

    if (response.data.message.includes("already")) {
      toast.error(response.data.message);
    } else if (response.data.message.includes("success")) {
      toast.success(response.data.message);
    }
    return true;
  } catch (err) {
    console.log("err", err);
    
    return err;
  }
};

export const unSaveArticles = async (id, userId) => {
  try {
    const response = await axiosInstance.post(
      `/unsave_article?user_id=${userId}&article_id=${id}`
    );
    console.log("response", response);
    if (response.data.message.includes("not saved")) {
      toast.error(response.data.message);
    } else if (response.data.message.includes("success")) {
      toast.success(response.data.message);
    }

    return true;
  } catch (err) {
    console.log(err);
    return err;
  }
};
export const voteArticles = async (articleId, userId, vote_type) => {
  console.log(articleId, userId, vote_type);
  try {
    const response = await axiosInstance.post(
      `/vote_article?user_id=${userId}&article_id=${articleId}&vote_type=${vote_type}`
    );
    if (response.data.message.includes("already")) {
      toast.error(response.data.message);
    } else if (response.data.message.includes("successfully")) {
      toast.success(response.data.message);
    }

    return response.data;
  } catch (err) {
    console.log(err);
    return err;
  }
};

export const unVoteArticles = async (articleId, userId) => {
  try {
    const response = await axiosInstance.post(
      `/unvote_article?user_id=${userId}&article_id=${articleId}`
    );

    return true;
  } catch (err) {
    console.log(err);
    return err;
  }
};
