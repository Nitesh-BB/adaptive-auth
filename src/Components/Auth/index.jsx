import * as React from "react";

import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import { onkeydown, onkeyup } from "../../Utils/GetDeviceInfo";

import {
  Alert,
  AlertTitle,
  Avatar,
  Box,
  Button,
  Checkbox,
  Container,
  CssBaseline,
  Divider,
  FormControlLabel,
  Grid,
  Link,
  TextField,
  Typography,
} from "@mui/material";

export default function SignIn({ handleSubmit, type, errorMessage }) {
  const typingData = React.useRef({
    keyDownTime: [],
    keyUpTime: [],
    upUpTime: [],
    downDownTime: [],
    upDownTime: [],
    downUpTime: [],
    keyHoldTime: [],
    typingSpeed: "",
    startedAt: "",
    finishedAt: "",
    length: 0,
    lastKey: "",
  });

  // const onKeyDown = (e) => {
  //   const timeStamp = new Date().getTime();
  //   const length = typingData.current.length + 1;
  //   typingData.current.length = length;

  //   if (e.key === "Backspace" && typingData.current.lastKey === "Backspace") {
  //     typingData.current.keyDownTime.pop();
  //     typingData.current.keyDownTime.pop();
  //     typingData.current.keyUpTime.pop();
  //     typingData.current.keyUpTime.pop();
  //   } else if (
  //     e.key === "Backspace" &&
  //     typingData.current.lastKey !== "Backspace"
  //   ) {
  //     typingData.current.keyDownTime.pop();
  //     typingData.current.keyUpTime.pop();
  //   }
  //   typingData.current.lastKey = e.key;

  //   typingData.current.keyDownTime.push(timeStamp);
  // };

  // const calulateTypingSpeed = () => {
  //   const keyHoldTime = typingData.current.keyDownTime.map(
  //     (keyDownTime, index) => {
  //       return typingData.current.keyUpTime[index] - keyDownTime;
  //     }
  //   );

  //   typingData.current.keyHoldTime = keyHoldTime;

  //   const keyHoldTimeSum = keyHoldTime.reduce((a, b) => a + b, 0);
  //   const typingSpeed = keyHoldTimeSum / keyHoldTime.length;
  //   typingData.current.typingSpeed = typingSpeed;
  //   console.table(typingData.current);
  // };

  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <Box
        sx={{
          marginTop: 2,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          marginBottom: 3,
        }}
      >
        <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          {type}
        </Typography>
        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
          {errorMessage && (
            <Alert severity="error">
              <AlertTitle>Error</AlertTitle>
              {errorMessage}
            </Alert>
          )}
          <TextField
            margin="normal"
            required
            fullWidth
            id="email"
            label="Email Address"
            name="email"
            autoFocus
            autoComplete="current-password"
          />
          <TextField
            margin="normal"
            required
            fullWidth
            name="mobile"
            label="Mobile Number"
            type="number"
            id="mobile"
            autoComplete="current-password"
          />

          <TextField
            fullWidth
            margin="normal"
            type="date"
            name="dob"
            label="Date of Birth"
            id="dob"
            InputLabelProps={{
              shrink: true,
            }}
            autoComplete="current-password"
          />

          <Box
            sx={{
              marginTop: "1rem",
            }}
          >
            <Divider />
            <Typography variant="body" color="primary">
              Please type the following text in the box below:
            </Typography>
            <Typography
              variant="caption"
              component="div"
              color="text.secondary"
              sx={{
                fontSize: "1rem",

                textAlign: "center",
                marginTop: "0.5rem",
                marginBottom: "0.5rem",
                textDecoration: "underline",
              }}
            >
              The quick brown fox jumps over the lazy dog
            </Typography>
            <TextField
              multiline
              rows={2}
              maxRows={3}
              fullWidth
              name="text"
              label="Enter text"
              id="text"
              autoComplete="off"
              onPaste={(e) => {
                e.preventDefault();
              }}
              onKeyDown={onkeydown}
              onKeyUp={onkeyup}
              required
            />
          </Box>

          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
          >
            {type}
          </Button>
          <Grid container>
            <Grid item>
              {type === "Register" ? (
                <Link href="/login" variant="body2">
                  {"Already Have an account? Sign In"}
                </Link>
              ) : (
                <Link href="/register" variant="body2">
                  {"Don't have an account? Sign Up"}
                </Link>
              )}
            </Grid>
          </Grid>
        </Box>
      </Box>
      {/* <Copyright sx={{ mt: 8, mb: 4 }} /> */}
    </Container>
  );
}
