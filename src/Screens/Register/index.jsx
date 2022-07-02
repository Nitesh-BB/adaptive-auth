import { useEffect, useState } from "react";
import Auth from "../../Components/Auth";
import { toast } from "react-toastify";

import {
  getBrowserInfo,
  getRegistrationDetailsUsingEmail,
  RegisterUser,
  getTypingData,
} from "../../Utils/GetDeviceInfo";

function Register() {
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (e) => {
    setErrorMessage("");
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const text = data.get("text");
    if (
      !text ||
      text.toLowerCase() !== "the quick brown fox jumps over the lazy dog"
    )
      return setErrorMessage("Please enter the correct text");
    if (!data.get("email")) return setErrorMessage("Email is required");
    try {
      const user = await getRegistrationDetailsUsingEmail(data.get("email"));

      if (!user?.resultData || user.resultCode !== 0)
        return setErrorMessage(
          user.resultMessage || "Something went wrong, please try again"
        );

      const { jwt, userDetails } = user.resultData;
      // todo : dispatch action to set jwt and userDetails in store

      const parseUserDetails = JSON.parse(userDetails);
      const { appId, userId } = parseUserDetails;
      const deviceData = await getBrowserInfo();

      const responseData = await RegisterUser({
        appId,
        userId,
        authDetails: {
          ...deviceData,
          userId: userId,
          typingSpeed: getTypingData(),
        },
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

      if (responseData.resultCode === 0) {
        return toast.success("Registration Successful");
      }
    } catch (err) {
      setErrorMessage(err.message);
    }
  };

  return (
    <div className="App">
      <Auth
        type="Register"
        handleSubmit={handleSubmit}
        errorMessage={errorMessage}
      />
    </div>
  );
}

export default Register;
