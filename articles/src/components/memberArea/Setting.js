import React from "react";
import { useState, useEffect } from "react";
import isValidEmail from "email-validator";
import { useNavigate } from "react-router-dom";
import Modal from "react-bootstrap/Modal";
import { Eye, EyeOff } from "feather-icons-react";
import PasswordValidator from "password-validator";
import { Spinner } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { initUser, setUser } from "../Auth/store";
import { changePassword, deleteAccount } from "../../api/auth";
import { toast } from "react-toastify";

const Setting = () => {
  let Navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.authReducer.user);
  // console.log(user);

  const [edit, setEdit] = useState(false);
  const [modalShow, setModalShow] = React.useState(false);
  const [password, setPassword] = useState("");
  const [see, setSee] = useState(false);
  const [see1, setSee1] = useState(false);
  const [see2, setSee2] = useState(false);

  const [pass, setPass] = useState(false);
  const [Npassword, setNPassword] = useState("");
  const [Cpassword, setCPassword] = useState("");
  const [passN, setPassN] = useState(false);
  const [passC, setPassC] = useState(false);
  const [isRequestPending, setIsRequestPending] = useState(false);
  const [dell, setDell] = useState(false);
  const [email, setEmail] = useState("");
  const [isValidE, setIsValidE] = useState(true);
  const [eml, setEml] = useState(false);

  const schema = new PasswordValidator();

  schema
    .is()
    .min(8) // Minimum of 8 characters
    .has()
    .letters(1) // At least 1 letter
    .digits(1) // At least 1 digit (number)
    .symbols(1);

  const isValid = schema.validate(password);
  const isValidN = schema.validate(Npassword);

  useEffect(() => {
    setIsValidE(isValidEmail.validate(email));
  }, [email]);

  const toggle = async () => {
    setSee(!see);
  };
  const toggle1 = async () => {
    setSee1(!see1);
  };
  const toggle2 = async () => {
    setSee2(!see2);
  };

  const logOutt = () => {
    localStorage?.removeItem("login");
    localStorage?.removeItem("access_token");
    dispatch(initUser({}));
    toast.success("Log Out Successfully");
    // window.location.reload();
    Navigate("/");
  };

  const notify = async () => {
    if (!dell) {
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
        // console.log("done");
        if (isRequestPending) {
          return;
        }
        setIsRequestPending(true);

        try {
          await changePassword(password, Npassword, user.user_id);
        } finally {
          setIsRequestPending(false);
        }
      }
    } else if (dell) {
      if (!email || !isValidE) {
        // console.log("kia hall hai");
        if (!isValidE || email === "") {
          setEml(true);
        } else {
          setEml(false);
        }
      } else {
        console.log("done");
        if (isRequestPending) {
          return;
        }
        setIsRequestPending(true);

        try {
          const res = await deleteAccount(user.user_id, email);
          if (res) {
            logOutt();
          }
        } finally {
          setIsRequestPending(false);
        }
      }
    }
  };

  useEffect(() => {
    const login = localStorage.getItem("login");

    if (login) {
      dispatch(setUser({ user: JSON.parse(login) }));
    }
  }, []);
  return (
    <div className="  h-fit  p-1">
      <div className="text-center ">
        <div className="font-ptm font-bold text-lg block lg:hidden md:hidden sm:hidden">
          Members Area
        </div>
      </div>
      {/* <div className='flex justify-center mb-4'>
      <img
              src={require("../../assets/img/profile.png")}
              className=" w-[100px] h-[100px] rounded-full border-solid border-white border-2 "
            />
      </div> */}
      <div className="flex justify-center mt-10  mb-16">
        <div className="bg-white w-[70%] ">
          <div className="  ">
            <span className="  font-mon  text-base">User name</span>{" "}
            <p className="bg-white py-2 text-sm pl-3 font-mon  border-2 border-black">
              {user?.username}{" "}
            </p>
          </div>
          <div className=" items-center mt-3 justify-around  ">
            <span className="  font-mon  text-base"> Email</span>{" "}
            <p className="bg-white py-2 text-sm pl-3 font-mon  border-2 border-black">
              {user?.email}
            </p>
          </div>
          <div className="items-center mt-3 justify-around ">
            <span className="  font-mon  text-base">Password</span>
            {edit ? (
              <p className="bg-white py-2 text-base pl-3 font-mon flex justify-between  border-2 border-black">
                Malik123.{" "}
                <button
                  onClick={() => {
                    setModalShow(true);
                  }}
                  className="bg-gray-200 px-2 font-mon rounded-sm text-xs mr-3 hover:bg-gray-400 hover:text-white"
                >
                  Edit
                </button>
              </p>
            ) : (
              <div className="bg-white py-2  pl-3 font-mon flex justify-between  border-2 border-black">
                <input
                  placeholder="Enter new password"
                  disabled={true}
                  value={"Malik123."}
                  className="border-none text-sm focus:border-none bg-inherit w-[90%]"
                  type={"password"}
                />
                <button
                  onClick={() => {
                    setModalShow(true);
                    setDell(false);
                  }}
                  className=" px-2 font-mon rounded-sm text-xs mr-3 "
                >
                  <img
                    src={require("../../assets/img/edit.png")}
                    className="w-[20px] h-[20px] cursor-pointer hover:bg-gray-50 p- rounded-sm"
                    alt=""
                    onClick={() => {
                      setModalShow(false);
                    }}
                  />
                </button>
              </div>
            )}
          </div>
          <div className="w-full flex justify-end h-[40px]  mt-3">
            <button
              onClick={() => {
                setModalShow(true);
                setDell(true);
              }}
              className={`bg-gray-800 text-white font-ptm mr- p-2 `}
            >
              Delete Account
            </button>
          </div>
        </div>
      </div>

      {/*Modall*/}

      <Modal
        show={modalShow}
        onHide={() => setModalShow(false)}
        // dialogClassName="modall "
        aria-labelledby="contained-modal-title-vcenter"
        centered
        backdrop="static"
        size="sm"
        style={{ backdropFilter: "blur(4px)" }}
      >
        {/* <Modal.Header  > */}

        {/* </Modal.Header> */}
        {/* <Modal.Body style={{ padding: "1px" }}> */}
        <Modal.Body style={{ padding: "20px", width: "50" }}>
          <div className="pb-1 ">
            <p
              style={{ textAlign: "center" }}
              tabIndex={0}
              role="heading"
              aria-label="Login to your account"
              className={`text-lg flex font-extrabold font-ptm justify-between leading-6  text-gray-800`}
            >
              {!dell ? " Change Password" : "Delete Account"}

              <span className="">
                <img
                  src={require("../../assets/img/close.png")}
                  className="w-[25px] h-[25px] cursor-pointer hover:bg-gray-50 p-1 rounded-sm"
                  alt=""
                  onClick={() => {
                    setModalShow(false);
                  }}
                />
              </span>
            </p>
            <div className={`${dell && "hidden"}`}>
              <div className={`mt-4  w-full `}>
                <lable className="text-sm font-medium leading-none font-mon text-gray-800">
                  Current Password
                </lable>
                <div className="relative flex items-center justify-center">
                  <input
                    aria-label="Enter Password"
                    onChange={(e) => setPassword(e.target.value)}
                    value={password}
                    name="password"
                    role="input"
                    type={see ? "text" : "password"}
                    className=" font-mon border-2 border-gray-800 focus:outline-none text-xs font-medium leading-none text-gray-800 py-2 w-full pl-3 mt-1"
                    placeholder="Current Password"
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
              {/*New password*/}
              <div className={`mt-3  w-full `}>
                <lable className="text-sm font-medium leading-none font-mon text-gray-800">
                  New Password
                </lable>
                <div className="relative flex items-center justify-center">
                  <input
                    aria-label="enter Password"
                    onChange={(e) => setNPassword(e.target.value)}
                    value={Npassword}
                    name="password"
                    role="input"
                    type={see1 ? "text" : "password"}
                    className="bg-gray-font-mon border-2 border-gray-800 focus:outline-none text-xs font-medium leading-none text-gray-800 py-2 w-full pl-3 mt-1"
                    placeholder="New Password"
                  />

                  <div className="absolute right-0 mt-2 mr-3 cursor-pointer">
                    <button
                      className=" hover:bg-gray-300 p-1 leading-none rounded"
                      type="button"
                      onClick={toggle1}
                    >
                      <Eye className="w-4 h-4 inline text-gray-500 " />
                    </button>
                  </div>
                </div>
                <div className="h-2">
                  {!isValidN && passN ? (
                    <span className={`p-1 text-red-500 font-mon`}>
                      1 letter, number and symbol and min 8 characters
                    </span>
                  ) : (
                    ""
                  )}
                </div>
              </div>

              {/* confirm new password */}

              <div className={`mt-3  w-full `}>
                <lable className="text-sm font-medium leading-none font-mon text-gray-800">
                  Confirm Password
                </lable>
                <div className="relative flex items-center justify-center">
                  <input
                    aria-label="enter Password"
                    onChange={(e) => setCPassword(e.target.value)}
                    value={Cpassword}
                    name="password"
                    role="input"
                    type={see2 ? "text" : "password"}
                    className="bg-gray-20 font-mon border-2 border-gray-800 focus:outline-none text-xs font-medium leading-none text-gray-800 py-2 w-full pl-3 mt-1"
                    placeholder="Confirm Password"
                  />

                  <div className="absolute right-0 mt-2 mr-3 cursor-pointer">
                    <button
                      className=" hover:bg-gray-300 p-1 leading-none rounded"
                      type="button"
                      onClick={toggle2}
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
            </div>

            <div className={`${!dell && "hidden"}`}>
              <div className="mt-3">
                <lable className="text-sm font-medium   leading-none font-mon text-gray-800">
                  Type email address to confirm
                </lable>
              </div>
              <div className={`  mt-3`}>
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
              <div className={`h-2   `}>
                {!isValidE && eml ? (
                  <span className="p-0 h-2 text-red-500 font-mon">
                    Enter Email In Correct Format
                  </span>
                ) : (
                  ""
                )}
              </div>
            </div>

            {/*Button*/}

            <div className={`mt-4  justify-end flex`}>
              {isRequestPending ? (
                <div className="mr-5">
                  <Spinner
                    animation="border"
                    variant={dell ? "danger" : "secondary"}
                  />
                </div>
              ) : (
                <button
                  type="button"
                  role="button"
                  onClick={notify}
                  aria-label="login"
                  className={`focus:ring-2 focus:ring-offset-2 font-ptm focus:ring-indigo-700  font-semibold leading-none text-white text-base focus:outline-none ${
                    dell ? "bg-red-700" : "bg-gray-800"
                  }  border rounded-ful hover:bg-black py-3 px-2`}
                >
                  {dell ? "Delete Acount" : "  Submit "}
                </button>
              )}
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default Setting;
