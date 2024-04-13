import React, { useEffect, useState } from "react";
import PasswordValidator from "password-validator";
import isValidEmail from "email-validator";
import { Eye, EyeOff } from "feather-icons-react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { resetPassword, signUp } from "../../api/auth";
import { Spinner } from "react-bootstrap";
import Form from "react-bootstrap/Form";
import YourComponent from "../YourComponent";
import { ToastContainer, toast } from "react-toastify";

function ResetPassword() {
  const url = process.env.REACT_APP_API_URL;
  let Navigate = useNavigate();
  let dispatch = useDispatch();
  const { key } = useParams();
  console.log('key',key);

  const getLocalItems = () => {
    let list = localStorage.getItem("userLog");

    if (list) {
      return JSON.parse(list);
    }
    return [];
  };

  const schema = new PasswordValidator();
  const userSchema = new PasswordValidator();

  schema
    .is()
    .min(8) // Minimum of 8 characters
    .has()
    .letters(1) // At least 1 letter
    .digits(1) // At least 1 digit (number)
    .symbols(1);

  userSchema.is().min(1).has().not().spaces();

  const [password, setPassword] = useState("");
  const [cPassword, setCPassword] = useState("");
  const [see, setSee] = useState(false);
  const [see2, setSee2] = useState(false);
  const [pass1, setPass1] = useState(false);
  const [pass2, setPass2] = useState(false);
  const [isRequestPending, setIsRequestPending] = useState(false);

  const [isCaptchaVerified, setIsCaptchaVerified] = useState(false);

  // console.log('recaptha console' , isCaptchaVerified);

  const handleRecaptchaChange = (value) => {
    // Handle reCAPTCHA verification here (e.g., send to your server)
    // console.log("reCAPTCHA value:" , value);
    setIsCaptchaVerified(!!value);
  };

  const isValid = schema.validate(password);

  const notify = async () => {
    if (!password || !isValid || cPassword != password || !isCaptchaVerified) {
      if (!password) {
      }

      if (!isCaptchaVerified) {
        toast.warn("please verify Captcha");
      }

      if (!isValid) {
        setPass1(true);
      } else {
        setPass1(false);
      }
      if (cPassword != password) {
        setPass2(true);
      } else {
        setPass2(false);
      }
    } else {
      if (isRequestPending) {
        return;
      }

      setIsRequestPending(true);

      try {
        const res = await resetPassword(password,key);
        if (res) nav();
      } finally {
        setIsRequestPending(false);
      }
    }
  };

  // togell

  const toggle = () => {
    if (see === true) {
      setSee(false);
    } else {
      setSee(true);
    }
  };

  const toggle2 = () => {
    if (see2 === true) {
      setSee2(false);
    } else {
      setSee2(true);
    }
  };

  const nav = () => {
    Navigate("/login");
  };
  const token = async (e) => {
    let res = await axios.post(`${url}/loginUser`, e);
    if (res) {
      localStorage.setItem("token", JSON.stringify(res));
      Navigate("/");
    }
  };

  const setjwt = async (e) => {
    let res = await axios.post(`${url}/googleLogin`, e);
    if (res) {
      localStorage.setItem("tokenG", JSON.stringify(res));
      Navigate("/");
    }
  };

  return (
    <div className="pt-20  bg-gray-100 lg:h-fit md:h-fit sm:h-fit   ">
      <div className=" flex  lg:p-10 md:p-5 sm:p-5 p-1 pt-3 lg:pt-0 md:pt-0 sm:pt-0  ">
        <div className="w-2/4 hidden items-center justify-center lg:flex md:hidden sm:hidden  ">
          <img
            src={require("../../assets/img/logo.gif")}
            className="h-[100]"
            alt=""
          />
        </div>

        {/*signUp*/}
        <div className="lg:w-2/4 md:w-full sm:w-full w-full flex  justify-center    ">
          <div className="  bg-gradient-to-tl  lg:w-4/6 md:w-4/6 sm:w-4/6 w-11/12  ">
            <form className=" w-full ">
              <div className="flex flex-col items-center justify-center ">
                <div className="bg-white shadow rounded  w-full p-3 ">
                  <p
                    tabIndex={0}
                    role="heading"
                    aria-label="Login to your account"
                    className="text-2xl font-extrabold font-ptm leading-6 text-gray-800"
                    style={{ textAlign: "center" }}
                  >
                    Reset Password
                  </p>
                  <p className="text-sm mt-3 font-medium font-mon leading-none text-gray-500">
                    Remember Password?{" "}
                    <span
                      onClick={nav}
                      tabIndex={0}
                      aria-label="Sign up here"
                      className="text-sm font-medium leading-none font-mon hover:text-blue-600 underline text-gray-800 cursor-pointer"
                    >
                      Sign In
                    </span>
                  </p>

                  <div className="mt-3  w-full">
                    <lable className="text-sm font-medium font-mon leading-none text-gray-800">
                      New Password
                    </lable>
                    <div className="relative flex items-center justify-center">
                      <input
                        aria-label="enter Password"
                        onChange={(e) => setPassword(e.target.value)}
                        value={password}
                        name="password"
                        placeholder="Password"
                        role="input"
                        type={see ? "text" : "password"}
                        className="bg-gray-20 font-mon border-2 border-gray-800 focus:outline-none text-xs font-medium leading-none text-gray-800 py-2 w-full pl-3 mt-2 "
                      />

                      <div className="absolute right-0 mt-2 mr-3 cursor-pointer">
                        <button
                          className=" hover:bg-gray-300 p-1 leading-none rounded"
                          type="button"
                          onClick={toggle}
                        >
                          <Eye className="w-4  inline text-gray-500 " />
                        </button>
                      </div>
                    </div>
                    <div className="h-2">
                      {!isValid && pass1 ? (
                        <span className={`p-0 h-2 text-red-500 font-mon`}>
                          1 letter, number and symbol and min 8 characters
                        </span>
                      ) : (
                        ""
                      )}
                    </div>
                  </div>

                  {/*secPass*/}

                  <div className="mt-3  w-full">
                    <lable className="text-sm font-medium leading-none font-mon text-gray-800">
                      Confirm Password
                    </lable>
                    <div className="relative flex items-center justify-center">
                      <input
                        aria-label="enter Password"
                        onChange={(e) => setCPassword(e.target.value)}
                        value={cPassword}
                        name="password"
                        placeholder="Confirm Password"
                        role="input"
                        type={see2 ? "text" : "password"}
                        className="bg-gray-20 font-mon border-2 border-gray-800 focus:outline-none text-xs font-medium leading-none text-gray-600 py-2 w-full pl-3 mt-2"
                      />

                      <div className="absolute right-0 mt-2 mr-3 cursor-pointer">
                        <button
                          className=" hover:bg-gray-300 p-1 rounded"
                          type="button"
                          onClick={toggle2}
                        >
                          <Eye className="w-4  inline text-gray-500 " />
                        </button>
                      </div>
                    </div>
                    <div className="h-2">
                      {cPassword != password && pass2 ? (
                        <p className={`p-0 h-2 text-red-500 font-mon ml-2`}>
                          Password does not match.
                        </p>
                      ) : (
                        ""
                      )}
                    </div>
                  </div>
                  <div className="mt-3 ml-1">
                    <YourComponent
                      handleRecaptchaChange={handleRecaptchaChange}
                    />
                  </div>
                  <div className="mt-4 flex justify-center">
                    {isRequestPending ? (
                      <Spinner animation="border" variant="secondary" />
                    ) : (
                      <button
                        type="button"
                        role="button"
                        onClick={notify}
                        aria-label="signup"
                        className="focus:ring-2 focus:ring-offset-2 font-ptm focus:ring-indigo-700 text-base font-semibold leading-none text-white focus:outline-none bg-gray-800 border rounded-ful hover:bg-black py-3 w-2/4"
                      >
                        Change Password
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ResetPassword;
