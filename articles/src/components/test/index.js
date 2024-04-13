import React, { useEffect, useState } from "react";
import PasswordValidator from "password-validator";
import isValidEmail from "email-validator";
import { Eye, EyeOff } from "feather-icons-react";
import { useNavigate } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";
import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google";
import jwt_decode from "jwt-decode";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { signUp } from "../../api/auth";
import { Spinner } from "react-bootstrap";
import Form from "react-bootstrap/Form";
import YourComponent from "../YourComponent";
import { ToastContainer, toast } from "react-toastify";

function Test() {
  const url = process.env.REACT_APP_API_URL;
  let Navigate = useNavigate();
  let dispatch = useDispatch();

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
  .min(8)              // Minimum of 8 characters
  .has()
  .letters(1)          // At least 1 letter
  .digits(1)           // At least 1 digit (number)
  .symbols(1);

  userSchema.is().min(1).has().not().spaces();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [cPassword, setCPassword] = useState("");
  const [userName, setUserName] = useState("");
  const [fName, setFName] = useState("");
  const [lName, setLName] = useState("");
  const [isValidE, setIsValidE] = useState(true);
  const [see, setSee] = useState(false);
  const [see2, setSee2] = useState(false);
  const [dataA, setDataA] = useState(getLocalItems());
  const [pass1, setPass1] = useState(false);
  const [pass2, setPass2] = useState(false);
  const [eml, setEml] = useState(false);
  const [usr, setUsr] = useState(false);
  const [first, setFirst] = useState(false);
  const [last, setLast] = useState(false);
  const [isRequestPending, setIsRequestPending] = useState(false);

  const [isCaptchaVerified, setIsCaptchaVerified] = useState(false);

  // console.log('recaptha console' , isCaptchaVerified);

  const handleRecaptchaChange = (value) => {
    // Handle reCAPTCHA verification here (e.g., send to your server)
    // console.log("reCAPTCHA value:" , value);
    setIsCaptchaVerified(!!value);
  };

  const isValid = schema.validate(password);
  const isValidUser = userSchema.validate(userName);
  useEffect(() => {
    setIsValidE(isValidEmail.validate(email));
  }, [email]);

  const notify = async () => {
    var checkbox = document.getElementById("myCheckbox");
    var checkboxText = document.getElementById("checkboxText");
    console.log("check", checkbox.checked);
    if (
      !email ||
      !password ||
      !userName ||
      !fName ||
      !lName ||
      !isValid ||
      !isValidE ||
      cPassword != password ||
      !checkbox.checked ||
      !isCaptchaVerified
    ) {
      if (!email || !password || !userName || !fName || !lName) {
      }

      if (!checkbox.checked) {
        checkboxText.style.color = "red";
      } else {
        checkboxText.style.color = "black";
      }
      if (!isCaptchaVerified) {
        toast.warn("please verify Captcha");
      }
      if (!isValidE) {
        setEml(true);
      } else {
        setEml(false);
      }

      if (!isValidUser && !userName) {
        setUsr(true);
      } else {
        setUsr(false);
      }

      if (!isValid) {
        setPass1(true);
      } else {
        setPass1(false);
      }
      if (!fName) {
        setFirst(true);
      } else {
        setFirst(false);
      }
      if (!lName) {
        setLast(true);
      } else {
        setLast(false);
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
        const res = await signUp(email, password, userName, fName, lName);
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

  const [sidebar, setsidebar] = useState();
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
                    Sign up
                  </p>
                  <p className="text-sm mt-3 font-medium font-mon leading-none text-gray-500">
                    Already have account?{" "}
                    <span
                      onClick={nav}
                      tabIndex={0}
                      aria-label="Sign up here"
                      className="text-sm font-medium leading-none font-mon hover:text-blue-600 underline text-gray-800 cursor-pointer"
                    >
                      Sign In
                    </span>
                  </p>

                  {/* <div className="mt-3 mb-2 flex justify-center">
                    <GoogleOAuthProvider clientId="831055028752-aooihnlfcc9e5vm44vb3iv8huvhtlbcv.apps.googleusercontent.com">
                      <GoogleLogin
                        // shape={""}
                        width={"40%"}
                        onSuccess={(credentialResponse) => {
                          var decoded = jwt_decode(
                            credentialResponse.credential
                          );
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
                  </div> */}

                  {/* <div className="w-full flex items-center justify-between py-2">
                    <hr className="w-full bg-gray-400" />
                    <p className="text-base font-medium font-mon leading-4 px-2.5 text-gray-400">
                      OR
                    </p>
                    <hr className="w-full bg-gray-400  " />
                  </div> */}
                  {/*name*/}
                  <div className="grid grid-cols-2 gap-4 mt-4 ">
                    <div>
                      <label className="text-sm font-medium leading-none font-mon text-gray-800">
                        First name
                      </label>
                      <input
                        aria-label="enter name"
                        onChange={(e) => setFName(e.target.value)}
                        value={fName}
                        name="name"
                        role="input"
                        type="name"
                        placeholder="Enter First Name"
                        className="bg-gray-20 border-2 border-gray-800 font-mon  focus:outline-none text-xs font-medium leading-none text-gray-800 py-2 w-full pl-3 mt-1"
                      />
                      <div className="h-2">
                        {first && !fName ? (
                          <span className={`p-0 h-2 text-red-500 font-mon`}>
                            Please Enter First Name
                          </span>
                        ) : (
                          ""
                        )}
                      </div>
                    </div>
                    <div>
                      <label className="text-sm font-medium leading-none font-mon text-gray-800">
                        Last name
                      </label>
                      <input
                        aria-label="enter name"
                        onChange={(e) => setLName(e.target.value)}
                        value={lName}
                        name="name"
                        role="input"
                        type="name"
                        placeholder="Enter Last Name"
                        className="bg-gray-20 border-2 border-gray-800 font-mon  focus:outline-none text-xs font-medium leading-none text-gray-800 py-2 w-full pl-3 mt-1"
                      />
                      {last && !lName ? (
                        <span className={`p-0 h-2 text-red-500 font-mon`}>
                          Please Enter Last Name
                        </span>
                      ) : (
                        ""
                      )}
                    </div>
                  </div>

                  <div className="mt-3">
                    <label className="text-sm font-medium leading-none font-mon text-gray-800">
                      Email
                    </label>
                    <input
                      aria-label="enter email adress"
                      onChange={(e) => setEmail(e.target.value)}
                      value={email}
                      name="email"
                      role="input"
                      type="email"
                      placeholder="name@example.com"
                      className="bg-gray-20 font-mon border-2 border-gray-800 focus:outline-none text-xs font-medium leading-none text-gray-800 py-2 w-full pl-3 mt-2 "
                    />
                  </div>
                  <div className="h-2">
                    {!isValidE && eml ? (
                      <span className="p-0 h-2 font-mon text-red-500">
                        Enter Email In Correct Format
                      </span>
                    ) : (
                      ""
                    )}
                  </div>

                  <div className="mt-4">
                    <label className="text-sm font-medium leading-none font-mon text-gray-800">
                      Username
                    </label>
                    <input
                      aria-label="enter name"
                      onChange={(e) => setUserName(e.target.value)}
                      value={userName}
                      name="name"
                      placeholder="Username"
                      role="input"
                      type="name"
                      className="bg-gray-20 font-mon border-2 border-gray-800 focus:outline-none text-xs font-medium leading-none text-gray-800 py-2 w-full pl-3 mt-1"
                    />
                  </div>
                  <div className="h-2">
                    {!isValidUser && usr ? (
                      <span className={`p-0 h-2 text-red-500 font-mon`}>
                        Username does not contain spaces
                      </span>
                    ) : (
                      ""
                    )}
                  </div>

                  <div className="mt-3  w-full">
                    <lable className="text-sm font-medium font-mon leading-none text-gray-800">
                      Password
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
                    <div className="mt-3 ml-2 flex items-center">
                      <input
                        type="checkbox"
                        id="myCheckbox"
                        className="checkbox cursor-pointer w-[15px] h-[15px]"
                      />
                      <label
                        id="checkboxText"
                        className="ml-3 font-mon text-sm"
                        htmlFor=""
                      >
                        I agree to terms and conditions
                      </label>
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
                        Sign up
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

export default Test;
