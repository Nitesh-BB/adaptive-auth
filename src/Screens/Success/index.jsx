import ReactSpeedometer from "react-d3-speedometer";
import {
  Box,
  Button,
  CssBaseline,
  Divider,
  Stack,
  Toolbar,
  Tooltip,
  Typography,
} from "@mui/material";
import ReactJson from "react-json-view";
import { getBrowserInfo } from "../../Utils/GetDeviceInfo";
import { useEffect, useState } from "react";
import { useLocation, Navigate } from "react-router-dom";
import { Container } from "@mui/system";
import { Info } from "@mui/icons-material";
export default function Success() {
  const { state } = useLocation();

  const [viewJsonData, setViewJsonData] = useState(false);
  const handleClick = () => {
    setViewJsonData((prev) => !prev);
    document.getElementById("json-data")?.scrollIntoView({
      behavior: "smooth",
      block: "center",
    });
  };

  if (!state || !state.result) return <Navigate to="/login" />;

  return (
    <Container>
      <CssBaseline />
      <Toolbar />
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          width: "100%",
          flexWrap: "wrap",
        }}
      >
        <Stack
          sx={{
            width: "50%",
          }}
          justifyContent="center"
          alignItems="center"
          spacing={3}
          style={{
            borderRight: "5px solid #d3d3d3",
          }}
        >
          <Typography variant="h4">
            What you Are ? What You Do{" "}
            <Tooltip title="Integer dignissim tempor auctor. Aenean dictum mauris eget posuere accumsan. Nulla ullamcorper, nibh condimentum gravida convallis, dolor lorem consectetur elit.">
              <Info color="info" fontSize="small" />
            </Tooltip>
          </Typography>
          <ReactSpeedometer
            maxValue={100}
            value={
              state?.result?.behaviour_confidence
                ? state.result.behaviour_confidence * 100
                : 0
            }
            needleColor="red"
            startColor="red"
            segments={10}
            endColor="green"
            textColor="grey"
            currentValueText={`Confidence Score: ${
              state?.result?.behaviour_confidence
                ? state.result.behaviour_confidence * 100
                : 0
            }%`}
            needleHeightRatio={0.7}
            height={200}
          />
        </Stack>
        <Stack
          sx={{
            width: "50%",
          }}
          justifyContent="center"
          alignItems="center"
          spacing={3}
        >
          <Typography variant="h4">
            Risk Level ?{" "}
            <Tooltip title="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum vestibulum.">
              <Info color="info" fontSize="small" />
            </Tooltip>
          </Typography>
          <ReactSpeedometer
            maxValue={100}
            value={state?.result?.risk_level ? state.result.risk_level : 0}
            needleColor="red"
            startColor="red"
            segments={10}
            endColor="green"
            textColor="grey"
            currentValueText={`Risk Level: ${
              state?.result?.risk_level ? state.result.risk_level : 0
            }%`}
            needleHeightRatio={0.7}
            height={200}
          />
        </Stack>
      </Box>

      <Box
        sx={{
          textAlign: "center",
          mt: 3,
        }}
      >
        <Divider />
        <Button onClick={handleClick}>
          {viewJsonData ? "Hide Json" : "Show Result Json"}
        </Button>
      </Box>

      {viewJsonData && (
        <Box
          component="section"
          id="json-data"
          sx={{
            mt: 5,
          }}
        >
          <Typography variant="h5">Data Json</Typography>
          <ReactJson
            src={{ ...state?.result, ...state?.userData }}
            name={false}
            theme={"monokai"}
            collapsed={false}
            iconStyle={"triangle"}
            displayDataTypes={false}
            indentWidth={4}
            style={{
              borderRadius: "8px",
              padding: "5px",
            }}
          />
        </Box>
      )}
    </Container>
  );
}
