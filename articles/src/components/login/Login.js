import React, { useEffect, useState } from "react";

import PasswordValidator from "password-validator";
import isValidEmail from "email-validator";
import { Eye, EyeOff } from "feather-icons-react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google";
import jwt_decode from "jwt-decode";
import { setUser } from "../Auth/store";
import { forgetPassword, login, resendVerificationEmail } from "../../api/auth";
import { Spinner } from "react-bootstrap";
import loginImage from "../../assets/img/logo.gif";
// import { toast } from "react-toastify";

import { ToastContainer, toast } from "react-toastify";
import { useLocation } from "react-router-dom";
import YourComponent from "../YourComponent";
function Login() {
  const url = process.env.REACT_APP_API_URL;

  let Navigate = useNavigate();
  const user = useSelector((state) => state.authReducer.user);

  const schema = new PasswordValidator();

  schema
    .is()
    .min(8) // Minimum of 8 characters
    .has()
    .letters(1) // At least 1 letter
    .digits(1) // At least 1 digit (number)
    .symbols(1);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [Npassword, setNPassword] = useState("");
  const [Cpassword, setCPassword] = useState("");
  const [isValidE, setIsValidE] = useState(true);
  const [see, setSee] = useState(false);
  const [see2, setSee2] = useState(false);
  const [pass, setPass] = useState(false);
  const [passN, setPassN] = useState(false);
  const [passC, setPassC] = useState(false);
  const [eml, setEml] = useState(false);
  const [isRequestPending, setIsRequestPending] = useState(false);
  const [forget, setForget] = useState(0);
  // const [isCaptchaVerified, setIsCaptchaVerified] = useState(false);

  // console.log('recaptha console' , isCaptchaVerified);

  // const handleRecaptchaChange = (value) => {
  //   // Handle reCAPTCHA verification here (e.g., send to your server)
  //   // console.log("reCAPTCHA value:" , value);
  //   setIsCaptchaVerified(!!value);
  // };

  const isValid = schema.validate(password);
  const isValidN = schema.validate(Npassword);
  useEffect(() => {
    setIsValidE(isValidEmail.validate(email));
  }, [email]);

  let dispatch = useDispatch();

  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const change = queryParams.get("change");

  useEffect(() => {
    if (change === "1") {
      setForget(2);
    }
    // console.log("change", change);
  }, []);

  const setjwt = async (e) => {
    let res = await axios.post(`${url}/googleLogin`, e);
    if (res) {
      localStorage.setItem("tokenG", JSON.stringify(res));
      Navigate("/");
    }
  };
  useEffect(() => {
    const login = localStorage.getItem("login");

    if (login) {
      dispatch(setUser({ user: JSON.parse(login) }));
    }
  }, []);

  const notify = async () => {
    if (forget === 2) {
      if (!Npassword || !password || !Cpassword || Cpassword != Npassword) {
        if (!isValid) {
          setPass(true);
        } else {
          setPass(false);
        }

        if (!isValidN) {
          setPassN(true);
        } else {
          setPassN(false);
        }

        if (Npassword != Cpassword) {
          setPassC(true);
        } else {
          setPassC(false);
        }
      } else {
        console.log("done");
      }
    } else if (forget === 0) {
      // if (!email || !password || !isValid || !isValidE || !isCaptchaVerified) {
      if (!email || !password || !isValid || !isValidE) {
        if (!email || !password) {
        }
        if (!isValid) {
          setPass(true);
        } else {
          setPass(false);
        }
        if (!isValidE) {
          setEml(true);
        } else {
          setEml(false);
        }

        // if (!isCaptchaVerified) {
        //   toast.warn("please verify Captcha");
        // }
      } else {
        if (isRequestPending) {
          return;
        }
        setIsRequestPending(true);

        try {
          let res = await login(email, password, dispatch);
          if (res) Navigate("/");
        } finally {
          setIsRequestPending(false);
        }
      }
      // } else if (!email || !isValidE || !isCaptchaVerified) {
    } else if (!email || !isValidE) {
      if (!isValidE || !email) {
        setEml(true);
      } else {
        setEml(false);
      }

      // if (!isCaptchaVerified) {
      //   toast.warn("please verify Captcha");
      // }
    } else {
      console.log("done");
      if (isRequestPending) {
        return;
      }
      setIsRequestPending(true);

      try {
        await forgetPassword(email);
      } finally {
        setIsRequestPending(false);
      }
    }
  };

  // togell

  const toggle = async () => {
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
    Navigate("/signup");
  };

  const [sidebar, setsidebar] = useState();
  return (
    <div className=" flex bg-gray-100 lg:p-10 md:p-5 sm:p-5 p-5  h-[100vh] items-center  ">
      <div className="w-2/4 hidden items-center justify-center lg:flex md:hidden sm:hidden  ">
        <img src={loginImage} className="h-[100]" alt="" />
      </div>

      {/*signUp*/}
      <div className="lg:w-2/4 md:w-full sm:w-full w-full flex  justify-center    ">
        <div className="  bg-gradient-to-tl  lg:w-4/6 md:w-4/6 sm:w-4/6 w-full">
          <form className=" w-full ">
            <div className="flex flex-col items-center justify-center ">
              <div className="bg-white shadow rounded  w-full p-3 ">
                <p
                  style={{ textAlign: "center" }}
                  tabIndex={0}
                  role="heading"
                  aria-label="Login to your account"
                  className={`text-2xl font-extrabold font-ptm leading-6 text-gray-800`}
                >
                  {forget === 1
                    ? "Forget password"
                    : forget === 0
                    ? "Login"
                    : "Change password"}
                </p>
                <p
                  className={`text-sm mt-4 font-mon font-medium leading-none  ${
                    forget === 2 && "hidden"
                  } text-gray-500`}
                >
                  {forget === 1
                    ? "Want to login?"
                    : forget === 2
                    ? "Want to login?"
                    : " Dont have account?"}{" "}
                  {forget === 0 ? (
                    <span
                      onClick={nav}
                      tabIndex={0}
                      aria-label="Sign up here"
                      className="text-sm font-medium font-mon leading-none hover:text-blue-600 underline text-gray-800 cursor-pointer"
                    >
                      Sign Up
                    </span>
                  ) : (
                    <span
                      onClick={() => setForget(0)}
                      tabIndex={0}
                      aria-label="Sign up here"
                      className="text-sm font-medium font-mon leading-none hover:text-blue-600 underline text-gray-800 cursor-pointer"
                    >
                      Login
                    </span>
                  )}
                </p>
                {/* {forget === 0 &&

                  <div className="mt-3 mb-2 flex justify-center">
                    <GoogleOAuthProvider clientId="831055028752-aooihnlfcc9e5vm44vb3iv8huvhtlbcv.apps.googleusercontent.com">
                      <GoogleLogin
                        shape={"rectangular"}
                        width={"40%"}
                        onSuccess={(credentialResponse) => {
                          var decoded = jwt_decode(credentialResponse.credential);
                          dispatch({
                            type: "login",
                          });
                          setjwt(decoded);
                        }}
                        onError={() => {
                          // console.log("Login Failed");
                        }}
                      />
                    </GoogleOAuthProvider>
                  </div>
                } */}
                {/*name*/}

                <div
                  className={`mt-0 ${forget === 2 ? "hidden" : "block"} mt-3`}
                >
                  <lable className="text-sm font-medium leading-none font-mon text-gray-800">
                    Email
                  </lable>
                  <input
                    aria-label="enter email adress"
                    onChange={(e) => setEmail(e.target.value)}
                    value={email}
                    name="email"
                    role="input"
                    placeholder="name@example.com"
                    type="email"
                    className="  font-mon border-2 border-gray-800 focus:outline-none text-xs font-medium leading-none text-gray-800 py-2 w-full pl-3 mt-1"
                  />
                </div>
                <div className={`h-2  ${forget === 2 ? "hidden" : "block"} `}>
                  {!isValidE && eml ? (
                    <span className="p-0 h-2 text-red-500 font-mon">
                      Enter Email In Correct Format
                    </span>
                  ) : (
                    ""
                  )}
                </div>

                <div
                  className={`mt-3  w-full ${
                    forget === 1 ? "hidden" : "block"
                  }`}
                >
                  <lable className="text-sm font-medium leading-none font-mon text-gray-800">
                    {forget === 2 ? "Old password" : "Password"}
                  </lable>
                  <div className="relative flex items-center justify-center">
                    <input
                      aria-label="enter Password"
                      onChange={(e) => setPassword(e.target.value)}
                      value={password}
                      name="password"
                      role="input"
                      type={see ? "text" : "password"}
                      className=" font-mon border-2 border-gray-800 focus:outline-none text-xs font-medium leading-none text-gray-800 py-2 w-full pl-3 mt-1"
                      placeholder="Password"
                    />

                    <div className="absolute right-0 mt-2 mr-3 cursor-pointer">
                      <button
                        className=" hover:bg-gray-300 p-1 leading-none rounded"
                        type="button"
                        onClick={toggle}
                      >
                        <Eye className="w-4 h-4 inline text-gray-500 " />
                      </button>
                    </div>
                  </div>
                  <div className="h-2">
                    {!isValid && pass ? (
                      <span className={`p-0 h-2 text-red-500 font-mon`}>
                        1 letter, number and symbol and min 8 characters
                      </span>
                    ) : (
                      ""
                    )}
                  </div>
                </div>

                {/* New password*/}

                <div
                  className={`mt-3  w-full ${
                    forget === 2 ? "block" : "hidden"
                  }`}
                >
                  <lable className="text-sm font-medium leading-none font-mon text-gray-800">
                    New password
                  </lable>
                  <div className="relative flex items-center justify-center">
                    <input
                      aria-label="enter Password"
                      onChange={(e) => setNPassword(e.target.value)}
                      value={Npassword}
                      name="password"
                      role="input"
                      type={see ? "text" : "password"}
                      className="bg-gray-font-mon border-2 border-gray-800 focus:outline-none text-xs font-medium leading-none text-gray-800 py-2 w-full pl-3 mt-1"
                      placeholder="Password"
                    />

                    <div className="absolute right-0 mt-2 mr-3 cursor-pointer">
                      <button
                        className=" hover:bg-gray-300 p-1 leading-none rounded"
                        type="button"
                        onClick={toggle}
                      >
                        <Eye className="w-4 h-4 inline text-gray-500 " />
                      </button>
                    </div>
                  </div>
                  <div className="h-2">
                    {!isValidN && passN ? (
                      <span className={`p-0 h-2 text-red-500 font-mon`}>
                        At least 1 letter, number and symbol and minimum of 8
                        characters
                      </span>
                    ) : (
                      ""
                    )}
                  </div>
                </div>

                {/* confirm new password */}

                <div
                  className={`mt-3  w-full ${
                    forget === 2 ? "block" : "hidden"
                  }`}
                >
                  <lable className="text-sm font-medium leading-none font-mon text-gray-800">
                    Confirm new password
                  </lable>
                  <div className="relative flex items-center justify-center">
                    <input
                      aria-label="enter Password"
                      onChange={(e) => setCPassword(e.target.value)}
                      value={Cpassword}
                      name="password"
                      role="input"
                      type={see ? "text" : "password"}
                      className="bg-gray-20 font-mon border-2 border-gray-800 focus:outline-none text-xs font-medium leading-none text-gray-800 py-2 w-full pl-3 mt-1"
                      placeholder="Password"
                    />

                    <div className="absolute right-0 mt-2 mr-3 cursor-pointer">
                      <button
                        className=" hover:bg-gray-300 p-1 leading-none rounded"
                        type="button"
                        onClick={toggle}
                      >
                        <Eye className="w-4 h-4 inline text-gray-500 " />
                      </button>
                    </div>
                  </div>
                  <div className="h-2">
                    {Npassword != Cpassword && passC ? (
                      <span className={`p-0 h-2 text-red-500 font-mon`}>
                        Password does not match.
                      </span>
                    ) : (
                      ""
                    )}
                  </div>
                </div>

                <div
                  className={`mt-3 ml- flex items-center  ${
                    forget === 2 ? "hidden" : forget === 1 ? "hidden" : ""
                  }`}
                >
                  <label
                    onClick={() => setForget(1)}
                    id="checkboxText"
                    className=" ml-1 font-mon text-sm hover:text-blue-600 cursor-pointer"
                    htmlFor=""
                  >
                    Forgot password
                  </label>
                </div>
                <div
                  className={`mt-3 ml- flex items-center  ${
                    forget === 2 ? "hidden" : forget === 1 ? "hidden" : ""
                  }`}
                >
                  <label
                    onClick={async () => {
                      if (email) {
                        if (isRequestPending) {
                          return;
                        }
                        setIsRequestPending(true);
                        try {
                          await resendVerificationEmail(email);
                        } finally {
                          setIsRequestPending(false);
                        }
                      } else {
                        setIsValidE(false);
                        setEml(true);
                      }
                    }}
                    id="checkboxText"
                    className=" ml-1 font-mon text-sm hover:text-blue-600 cursor-pointer"
                    htmlFor=""
                  >
                    Resend verification email
                  </label>
                </div>

                {/* <div className="mt-3 ml-1">
                  <YourComponent
                    handleRecaptchaChange={handleRecaptchaChange}
                  />
                </div> */}

                <div className={`mt-4  justify-center flex`}>
                  {isRequestPending ? (
                    <Spinner animation="border" variant="secondary" />
                  ) : (
                    <button
                      type="button"
                      role="button"
                      onClick={notify}
                      aria-label="login"
                      className="focus:ring-2 focus:ring-offset-2 font-ptm focus:ring-indigo-700  font-semibold leading-none text-white text-base focus:outline-none bg-gray-800 border rounded-ful hover:bg-black py-3 w-2/4"
                    >
                      {forget === 0
                        ? "Login"
                        : forget === 1
                        ? "Send"
                        : forget === 2
                        ? "Change"
                        : ""}
                    </button>
                  )}
                </div>
                {/*forget button*/}
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Login;
