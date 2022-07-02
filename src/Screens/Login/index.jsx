import { Button } from "@mui/material";
import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import Auth from "../../Components/Auth";
import { useNavigate } from "react-router-dom";
import {
  getRegistrationDetailsUsingEmail,
  AuthenticateUser,
  getBrowserInfo,
  getTypingData,
} from "../../Utils/GetDeviceInfo";

const Login = () => {
  const [errorMessage, setErrorMessage] = useState("");

  const navigate = useNavigate();

  const navigateToSuccess = ({ result, userData }) => {
    navigate("/success", {
      state: { result, userData },
      replace: true,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formdata = new FormData(e.currentTarget);
    const email = formdata.get("email");
    if (!email) return setErrorMessage("Please enter email");
    const text = data.get("text");
    if (
      !text ||
      text.toLowerCase() !== "the quick brown fox jumps over the lazy dog"
    )
      return setErrorMessage("Please enter the correct text");
    try {
      const user = await getRegistrationDetailsUsingEmail(email);
      if (!user?.resultData)
        return setErrorMessage("User not found. Please try again");

      if (!user?.resultData || user.resultCode !== 0)
        return setErrorMessage(
          user.resultMessage || "Something went wrong, please try again"
        );
      const { jwt, userDetails } = user.resultData;
      const parseUserDetails = JSON.parse(userDetails);
      const { appId, userId } = parseUserDetails;
      const deviceData = await getBrowserInfo();

      const userData = {
        ...deviceData,
        userId,
        typingSpeed: getTypingData(),
      };

      const responseData = await AuthenticateUser({
        appId,
        userId,
        authDetails: userData,
        jwt,
      });
      if (
        responseData.status === 400 ||
        responseData.status === 401 ||
        responseData.status === 403 ||
        responseData.resultCode !== 0
      ) {
        return setErrorMessage(
          responseData.error || responseData.resultMessage
        );
      }

      navigateToSuccess({
        result: responseData.resultData,
        userData: userData,
      });
    } catch (err) {
      setErrorMessage(err.message);
    }
  };
  return (
    <>
      <Auth
        handleSubmit={handleSubmit}
        type="Sign In"
        errorMessage={errorMessage}
      />
    </>
  );
};

export default Login;
