import React, { useState } from "react";
import ReCAPTCHA from "react-google-recaptcha";

const key = process.env.REACT_APP_SITE_KEY;
const YourComponent = ({ handleRecaptchaChange }) => {
  const recaptchaRef = React.createRef();
  // const [isCaptchaVerified, setIsCaptchaVerified] = useState(false);
  // console.log('recaptha console' , isCaptchaVerified);
  // const handleRecaptchaChange = (value) => {
  //   // Handle reCAPTCHA verification here (e.g., send to your server)

  //   setIsCaptchaVerified(!!value);
  // };

  return (
    <div>
      {/* Add the reCAPTCHA component with your site key */}
      <ReCAPTCHA
        ref={recaptchaRef}
        sitekey={key}
        onChange={handleRecaptchaChange}
      />
    </div>
  );
};

export default YourComponent;