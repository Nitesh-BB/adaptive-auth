function Adaptive() {
  let BASE_URL =
    "https://access.axiomprotect.com:6653/AxiomProtect/v1/adaptivetoken";
  let TOKEN = "";

  const init = (baseUrl, token) => {
    BASE_URL = baseUrl;
    TOKEN = token;
  };

  const RegisterUser = async (data) => {
    const { userId, appId, authDetails, jwt } = data;
    try {
      const response = await fetch(
        `${BASE_URL}/activate?userId=${userId}&appId=${appId}&requestTime=${convertToDateString(
          new Date()
        )}&requestType=3`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            authToken: jwt,
          },
          body: JSON.stringify({
            ...authDetails,
            timestamp: convertToDateString(new Date()),
          }),
        }
      );
      return response.json();
    } catch (e) {
      throw e;
    }
  };

  const getGyroscope = async function () {
    return new Promise((resolve, reject) => {
      if (window.DeviceMotionEvent) {
        window.addEventListener("devicemotion", function (event) {
          resolve(event.rotationRate);
        });
      } else {
        reject("Not supported");
      }
    });
  };

  const getDeviceOrientation = async function () {
    return new Promise((resolve, reject) => {
      if (window.DeviceOrientationEvent) {
        window.addEventListener("deviceorientation", function (event) {
          resolve(event.alpha);
        });
      } else {
        reject("Not supported");
      }
    });
  };

  const getAccelerometer = async function () {
    return new Promise((resolve, reject) => {
      if (window.DeviceMotionEvent) {
        window.addEventListener("devicemotion", function (event) {
          resolve(event.acceleration);
        });
      } else {
        reject("Not supported");
      }
    });
  };

  function convertToDateString(date) {
    //return date = YYYY-MM-DD HH:MM:SS

    const addZero = (num) => {
      return num < 10 ? "0" + num : num;
    };

    let year = date.getFullYear();
    let month = date.getMonth() + 1;
    let day = date.getDate();
    let hour = date.getHours();
    let minute = date.getMinutes();
    let second = date.getSeconds();

    return `${year}-${addZero(month)}-${addZero(day)} ${addZero(
      hour
    )}:${addZero(minute)}:${addZero(second)}`;
  }

  const getRegistrationDetailsUsingEmail = async (email) => {
    const response = await fetch(
      `${BASE_URL}/getRegistrationDetailsUsingEmail?email=${email}&requestTime=${convertToDateString(
        new Date()
      )}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    return response.json();
  };

  const AuthenticateUser = async (data) => {
    const { userId, appId, authDetails, jwt } = data;

    const response = await fetch(
      `${BASE_URL}/authenticate?userId=${userId}&appId=${appId}&requestTime=${convertToDateString(
        new Date()
      )}&requestType=3`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          authToken: jwt,
        },
        body: JSON.stringify({
          ...authDetails,
          timestamp: convertToDateString(new Date()),
        }),
      }
    );
    return response.json();
  };

  const getLocation = () => {
    return new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(resolve, reject);
    });
  };

  const generateBrowserUniqueId = () => {
    let uid;
    const screenInfo = getScreenInfo();
    const userAgent = getUserAgent();
    uid =
      userAgent.replace(/\D+/g, "") +
      screenInfo.width +
      screenInfo.height +
      screenInfo.colorDepth +
      screenInfo.pixelDepth;
    return uid;
  };

  const getConnectionInfo = () => {
    return navigator.connection;
  };

  const getUserAgent = () => {
    return navigator.userAgent;
  };

  const detectBrowser = () => {
    var test = function (regexp) {
      return regexp.test(window.navigator.userAgent);
    };
    switch (true) {
      case test(/edg/i):
        return "Microsoft Edge";
      case test(/trident/i):
        return "Microsoft Internet Explorer";
      case test(/firefox|fxios/i):
        return "Mozilla Firefox";
      case test(/opr\//i):
        return "Opera";
      case test(/ucbrowser/i):
        return "UC Browser";
      case test(/samsungbrowser/i):
        return "Samsung Browser";
      case test(/chrome|chromium|crios/i):
        return "Google Chrome";
      case test(/safari/i):
        return "Apple Safari";
      default:
        return "Other";
    }
  };

  function getOS() {
    var userAgent = window.navigator.userAgent,
      platform = window.navigator.platform,
      macosPlatforms = ["Macintosh", "MacIntel", "MacPPC", "Mac68K"],
      windowsPlatforms = ["Win32", "Win64", "Windows", "WinCE"],
      iosPlatforms = ["iPhone", "iPad", "iPod"],
      os = null;

    if (macosPlatforms.indexOf(platform) !== -1) {
      os = "Mac OS";
    } else if (iosPlatforms.indexOf(platform) !== -1) {
      os = "iOS";
    } else if (windowsPlatforms.indexOf(platform) !== -1) {
      os = "Windows";
    } else if (/Android/.test(userAgent)) {
      os = "Android";
    } else if (!os && /Linux/.test(platform)) {
      os = "Linux";
    }

    return os;
  }
  const detectOs = () => {
    if (navigator.userAgentData && navigator.userAgentData.platform) {
      return navigator.userAgentData.platform;
    } else return getOS();
  };

  const getScreenInfo = () => {
    return {
      width: window.screen.width,
      height: window.screen.height,
      availWidth: window.screen.availWidth,
      availHeight: window.screen.availHeight,
      colorDepth: window.screen.colorDepth,
      pixelDepth: window.screen.pixelDepth,
    };
  };

  const getBatteryInfo = () => {
    return new Promise((resolve, reject) => {
      navigator.getBattery().then(resolve, reject);
    });
  };

  const isMobile = () => {
    // check if device is touch capable

    if (navigator.userAgentData) return navigator.userAgentData.mobile;

    return "ontouchstart" in window || navigator.maxTouchPoints || false;
  };

  const mobileDeviceModel = async () => {
    return new Promise((resolve, reject) => {
      if (navigator.userAgentData) {
        resolve(
          navigator.userAgentData.getHighEntropyValues([
            "architecture",
            "model",
            "platform",
            "platformVersion",
            "fullVersionList",
          ])
        );
      } else {
        reject("Not supported");
      }
    });
  };

  async function getDeviceInfo() {
    try {
      const [location, batteryInfo] = await Promise.allSettled([
        getLocation(),
        getBatteryInfo(),
      ]).then((results) => {
        return results.map((result) => {
          if (result.status === "fulfilled") {
            return result.value;
          } else {
            return null;
          }
        });
      });

      const { height, width, colorDepth, pixelDepth } = getScreenInfo();

      let data = {
        browser: detectBrowser(),

        isMobile: isMobile(),
        browserId: generateBrowserUniqueId(),
        deviceId: generateBrowserUniqueId(),
        cookiesEnabled: navigator.cookieEnabled,
        userAgent: getUserAgent(),
        osName: detectOs(),
        screenResolution: `{${width},${height}}`,
        coneectionType: getConnectionInfo()?.effectiveType,
        timeZone: Intl.DateTimeFormat()?.resolvedOptions()?.timeZone ?? "",
        defaultLanguage: navigator.language,
        screenColrDepth: colorDepth,
        screenPixelDepth: pixelDepth,
        longitude: `${location?.coords?.longitude}`,
        latitude: `${location?.coords?.latitude}`,
        batteryLevel: batteryInfo ? batteryInfo.level * 100 : null,
        batteryStatus: batteryInfo?.charging ? 1 : 2,
      };

      if (isMobile()) {
        const [mobileDevice, deviceOrientation, gyroscope, accelerometer] =
          await Promise.allSettled([
            mobileDeviceModel(),
            getDeviceOrientation(),
            getGyroscope(),
            getAccelerometer(),
          ]).then((results) => {
            return results.map((result) => {
              if (result.status === "fulfilled") {
                return result.value;
              } else {
                return null;
              }
            });
          });

        data = {
          ...data,
          gyroscope:
            gyroscope.alpha !== null
              ? `${gyroscope.alpha},${gyroscope.beta},${gyroscope.gamma}`
              : null,
          inclination:
            accelerometer.x !== null
              ? `${accelerometer.x},${accelerometer.y},${accelerometer.z}`
              : null,
          deviceOrientation: deviceOrientation,
          buildModel: mobileDevice.model,
          buildVersion: mobileDevice.platformVersion,
          buildPlatform: mobileDevice.platform,
        };
      }

      return data;
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async function getBrowserInfo() {
    return await getDeviceInfo();
  }

  const keyPressEvents = () => {
    let typingData = {};

    const getTypingData = () => {
      calculateMatrix();
      console.log(typingData);
      return typingData;
    };

    const clearTypingData = () => {
      typingData = {};
    };

    const calculateMatrix = () => {
      const keys = Object.keys(typingData);
      keys.length > 0 &&
        keys.forEach((key) => {
          const target = typingData[key];
          target.upDownTime = [];
          target.upUpTime = [];
          target.downDownTime = [];
          target.downUpTime = [];
          target.keyDownTime.forEach((keyDownTime, index) => {
            if (index !== target.keyDownTime.length - 1) {
              const downDownTimeDiff =
                target.keyDownTime[index + 1] - keyDownTime;
              target.downDownTime.push(downDownTimeDiff);
            }

            const downUpTimeDiff = target.keyUpTime[index] - keyDownTime;
            target.downUpTime.push(downUpTimeDiff);
          });

          target.keyUpTime.forEach((keyUpTime, index) => {
            if (index !== target.keyUpTime.length - 1) {
              const upUpTimeDiff = target.keyUpTime[index + 1] - keyUpTime;
              target.upUpTime.push(upUpTimeDiff);
            }

            const upDownTimeDiff = keyUpTime - target.keyDownTime[index];
            target.upDownTime.push(upDownTimeDiff);
          });

          target.keyHoldTime = [...target.downUpTime];

          const typingSpeed =
            target.upUpTime.reduce((acc, curr) => acc + curr, 0) /
            target.sentence.length;
          target.typingSpeed = typingSpeed;
        });
    };

    const onkeydown = (e) => {
      let target = typingData[e.target.name];
      if (!target) {
        typingData[e.target.name] = {
          keyDownTime: [],
          keyUpTime: [],
          keyLength: 0,
          sentence: "",
          upUpTime: [],
          upDownTime: [],
          downUpTime: [],
          downDownTime: [],
          keyHoldTime: [],
          typingSpeed: 0,
        };
        target = typingData[e.target.name];
      }
      if (e.which === 13 || e.which === 46 || e.ctrlKey) {
        return e.preventDefault();
      }
      if (e.key === "Backspace" && target.sentence.length > 0) {
        target.sentence = target.sentence.slice(0, -1);
        target.keyDownTime.pop();
        target.keyUpTime.pop();
        return;
      }

      const timeStamp = new Date().getTime();
      target.keyDownTime.push(timeStamp);
    };

    const onkeyup = (e) => {
      if (e.which === 8 || e.which === 13 || e.which === 46 || e.ctrlKey) {
        return e.preventDefault();
      }

      let target = typingData[e.target.name];
      const timeStamp = new Date().getTime();
      target.keyUpTime.push(timeStamp);
      target.sentence = e.target.value;
      target.keyLength = e.target.value.length;
    };

    return {
      onkeydown,
      onkeyup,
      getTypingData,
      clearTypingData,
    };
  };

  // async function displayResults(id) {
  //   try {
  //     const {
  //       location,
  //       connectionInfo,
  //       userAgent,
  //       screenInfo,
  //       batteryInfo,
  //       isOnline,
  //       cookiesEnabled,
  //       language,
  //       languages,
  //       timeZone,
  //       browserId,
  //       browser,
  //       os,
  //       isMobile,
  //       mobileDevice,
  //     } = await getDeviceInfo();

  //     let outputStr =
  //       "<h5>This Web page uses JavaScript to determine information about the Web browser that you are using and about your computer. This information is only displayed; it is not stored or used in any way.</h5>";
  //     outputStr = outputStr + "<h1>Browser details</h1>";

  //     outputStr = outputStr + "<h3>Browser ID: " + browserId + "</h3>";

  //     outputStr = outputStr + `<h3>User agent</h3>`;
  //     outputStr = outputStr + `<p>User agent: ${userAgent}</p>`;
  //     outputStr = outputStr + `<p>Browser: ${browser}</p>`;
  //     outputStr = outputStr + `<p>OS: ${os}</p>`;
  //     outputStr = outputStr + `<p>Is mobile: ${isMobile}</p>`;
  //     mobileDevice?.architecture &&
  //       (outputStr =
  //         outputStr + `<p>Architecture: ${mobileDevice?.architecture}</p>`);

  //     if (isMobile && mobileDevice) {
  //       outputStr =
  //         outputStr + `<p>Mobile device model: ${mobileDevice.model}</p>`;
  //       outputStr =
  //         outputStr + `<p>Mobile device platform: ${mobileDevice.platform}</p>`;
  //       outputStr =
  //         outputStr +
  //         `<p>Mobile device platform version: ${mobileDevice.platformVersion}</p>`;
  //     }

  //     outputStr = outputStr + `<h3>Location</h3>`;

  //     if (location) {
  //       outputStr =
  //         outputStr + `<p>Latitude: ${location?.coords?.latitude ?? "NA"}</p>`;
  //       outputStr =
  //         outputStr +
  //         `<p>Longitude: ${location?.coords?.longitude ?? "NA"}</p>`;
  //     } else outputStr = outputStr + `<p>Location is Not available</p>`;

  //     outputStr = outputStr + `<h3>Connection</h3>`;

  //     if (connectionInfo) {
  //       outputStr =
  //         outputStr +
  //         `<p>Effective bandwidth: ${connectionInfo.effectiveType}</p>`;
  //       outputStr =
  //         outputStr + `<p>Downlink speed: ${connectionInfo.downlink}</p>`;
  //     } else {
  //       outputStr = outputStr + `<p>Connection Info is not available</p>`;
  //     }

  //     outputStr = outputStr + `<h3>Screen</h3>`;
  //     outputStr = outputStr + `<p>Width: ${screenInfo.width}</p>`;
  //     outputStr = outputStr + `<p>Height: ${screenInfo.height}</p>`;
  //     outputStr =
  //       outputStr + `<p>Available width: ${screenInfo.availWidth}</p>`;
  //     outputStr =
  //       outputStr + `<p>Available height: ${screenInfo.availHeight}</p>`;
  //     outputStr = outputStr + `<p>Color depth: ${screenInfo.colorDepth}</p>`;
  //     outputStr = outputStr + `<p>Pixel depth: ${screenInfo.pixelDepth}</p>`;

  //     outputStr = outputStr + `<h3>Battery</h3>`;

  //     if (batteryInfo) {
  //       outputStr = outputStr + `<p>Level: ${batteryInfo.level}</p>`;
  //       outputStr = outputStr + `<p>Charging: ${batteryInfo.charging}</p>`;
  //       outputStr =
  //         outputStr + `<p>Time remaining: ${batteryInfo.dischargingTime}</p>`;
  //     } else {
  //       outputStr = outputStr + `<p>Battery info not available</p>`;
  //     }

  //     outputStr = outputStr + `<h3>Online</h3>`;
  //     outputStr = outputStr + `<p>Is online: ${isOnline}</p>`;

  //     outputStr = outputStr + `<h3>Cookies</h3>`;
  //     outputStr = outputStr + `<p>Cookies enabled: ${cookiesEnabled}</p>`;

  //     outputStr = outputStr + `<h3>Language</h3>`;
  //     outputStr = outputStr + `<p>Language: ${language}</p>`;

  //     outputStr = outputStr + `<h3>Languages</h3>`;
  //     outputStr = outputStr + `<p>Languages: ${languages}</p>`;

  //     outputStr = outputStr + `<h3>Time zone</h3>`;
  //     outputStr = outputStr + `<p>Time zone: ${timeZone}</p>`;

  //     let element;
  //     if (!id) {
  //       element = document.createElement("div");
  //       document.body.appendChild(element);
  //     }

  //     element = document.getElementById(id);
  //     if (!element) throw new Error("Element not found");
  //     element.innerHTML = outputStr;
  //   } catch (error) {
  //     throw new Error(error.message);
  //   }
  // }

  return {
    getBrowserInfo,

    init,
    RegisterUser,
    AuthenticateUser,
    getRegistrationDetailsUsingEmail,
    keyPressEvents,
  };
}

const { keyPressEvents } = Adaptive();
export const { onkeydown, onkeyup, getTypingData, clearTypingData } =
  keyPressEvents();

export const {
  getBrowserInfo,

  getRegistrationDetailsUsingEmail,
  RegisterUser,
  AuthenticateUser,
} = Adaptive();
