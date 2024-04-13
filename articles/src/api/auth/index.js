import axios from "axios";
import { setUser } from "../../components/Auth/store";
import { toast } from "react-toastify";
import { axiosInstance } from "../axiosConfig";

const url = process.env.REACT_APP_API_URL;
export const login = async (email, password, dispatch) => {
  try {
    // const response = await axios.post(
    //   `${url}/login?identifier=${email}&password=${password}`
    // );
    const response = await axios.post(`${url}/login`, {
      identifier: email,
      password: password,
    });
    localStorage.setItem("access_token", response.data.access_token);
    localStorage.setItem("login", JSON.stringify(response.data.user));
    dispatch(setUser({ user: response?.data?.user }));
    toast.success(response.data.message);

    return true;
  } catch (err) {
    toast.error(err.response.data.error);
    console.log(err.res);
  }
};

export const signUp = async (email, password, userName, fName, lName) => {
  try {
    const res = await axios.post(`${url}/signup`, {
      email: email,
      password: password,
      username: userName,
      first_name: fName,
      last_name: lName,
    });

    // console.log('res', res)
    toast.success(res.data.message);
    return true;
  } catch (error) {
    // console.log('error', error)
    toast.error(error.response.data.error);
  }
};
export const resendVerificationEmail = async (email) => {
  try {
    let res = await axiosInstance.post(
      `/resend_verification_email?identifier=${email}`
    );
    // console.log("res", res);
    toast.success(res.data.message);
    return true;
  } catch (error) {
    console.log("error", error);
    toast.error(error.message);
  }
};
export const resetPassword = async (new_password, reset_token) => {
  try {
    const res = await axiosInstance.post("/reset_password", {
      new_password: new_password,
      reset_token: reset_token,
    });
    // console.log('res', res)
    toast.success(res.data.message);
    return true;
  } catch (error) {
    console.log("error", error);
    // toast.error(error.response.data.error);
  }
};
export const changePassword = async (old_password, new_password, user_id) => {
  try {
    const res = await axiosInstance.post("/change_password", {
      old_password: old_password,
      new_password: new_password,
      user_id: user_id,
    });

    // console.log('res', res)
    toast.success(res?.data?.message);
    return true;
  } catch (error) {
    // console.log('error', error)
    toast.error(error.response.data.error);
  }
};
export const forgetPassword = async (identifier) => {
  try {
    let res = await axiosInstance.post(
      `/forgot_password?identifier=${identifier}`
    );
    // console.log("res", res);
    toast.success(res.data.message);
    return true;
  } catch (error) {
    console.log("error", error);
    toast.error(error.message);
  }
};
export const deleteAccount = async (user_id, email) => {
  try {
    let response = await axiosInstance.delete(
      `/destroy_user?user_id=${user_id}&email=${email}`
    );

    toast.success(response.data.message);

    return true;
  } catch (error) {
    console.log("error", error);
    toast.error(error.response.data.message);
  }
};
