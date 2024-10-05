import {
  Avatar,
  Box,
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Skeleton,
  TextField,
  Typography,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import CheckIcon from "@mui/icons-material/Check";
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';

const CssTextField = styled(TextField)({
  "& label.Mui-focused": {
    color: "#FFFFFF",
  },
  "& .MuiInput-underline:after": {
    borderBottomColor: "#B2BAC2",
  },
  "& .MuiOutlinedInput-root": {
    color: "#FFFFFF",
    backgroundColor: "#62626C",
    borderRadius: "10px",
    width: "100%",
    marginBottom: "20px",
    "& fieldset": {
      borderColor: "#E0E3E7",
      color: "#FFFFFF",
    },
    "&:hover fieldset": {
      borderColor: "#B2BAC2",
      color: "#FFFFFF",
    },
    "&.Mui-focused fieldset": {
      borderColor: "#6F7E8C",
      color: "#FFFFFF",
    },
  },
});

const SiderComponent = ({
  setViewCard,
  setViewSearch,
  viewSearch,
  typeSearch,
  setTypeSearch,
  valueSearch,
  setValueSearch,
  loadingStations,
  stationsList,
  setStationSelected,
  myFavorites,
  setIsPlaying,
  errorLoad,
  handleGetStations,
}) => {
  const arr = Array(10).fill(0);

  return (
    <>
      <Box
        sx={{
          width: "100%",
          display: { xs: "flex", md: "none" },
          alignItems: "center",
          justifyContent: "flex-end",
        }}
      >
        <ArrowForwardIcon
          sx={{
            color: "#1267FC",
            width: "30px",
            height: "30px",
            cursor: "pointer",
          }}
          onClick={() => {
            setViewCard(true);
            setTimeout(() => {
              setViewSearch(!viewSearch);
            }, 10);
          }}
        />
      </Box>
      <FormControl sx={{ width: "100%" }}>
        <InputLabel sx={{ color: "white" }}>Search by</InputLabel>
        <Select
          fullWidth
          sx={{
            border: "1px solid #FFFFFF",
            color: "#FFFFFF",
            borderRadius: "10px",
            backgroundColor: "#62626C",
          }}
          value={typeSearch}
          onChange={(e) => {
            setTypeSearch(e.target.value);
            setValueSearch("");
          }}
          size="small"
        >
          <MenuItem value={"station"}>Station</MenuItem>
          <MenuItem value={"country"}>Country</MenuItem>
          <MenuItem value={"language"}>Language</MenuItem>
        </Select>
      </FormControl>
      <CssTextField
        label="Search here"
        value={valueSearch}
        fullWidth
        onChange={(e) => setValueSearch(e.target.value)}
        InputLabel={{
          style: { verticalAlign: "center" },
        }}
        size="small"
        enable={!errorLoad}
      />
      {!loadingStations ? (
        errorLoad ? (
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: 2,
              alignItems: "center",
              justifyContent: "center",
              color:'#FFFFFF'
            }}
          >
            <Typography>
              Stations not find, click the button for reload.
            </Typography>
            <Button variant="contained" onClick={() => handleGetStations()}>
              Reload
            </Button>
          </Box>
        ) : (
          stationsList &&
          stationsList.length > 0 &&
          stationsList.map((item) => (
            <Box
              key={item.changeuuid}
              sx={{
                backgroundColor: "#4D4D56",
                height: "48px",
                width: "98%",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                p: 1,
                borderRadius: "10px",
                cursor: "pointer",
              }}
              onClick={() => {
                setStationSelected(item);
                setIsPlaying(true);
                setViewSearch(!viewSearch);
                setViewCard(true);
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 2,
                  maxWidth: "95%",
                }}
              >
                <Avatar alt={item.name} src={item.favicon} />
                <Typography
                  sx={{
                    fontFamily: "Inter",
                    fontSize: "16px",
                    fontWeight: 400,
                    lineHeight: "19.36px",
                    textAlign: "left",
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    maxWidth: "80%",
                  }}
                >
                  {item.name}
                </Typography>
              </Box>
              {myFavorites.find(
                (station) => station.stationuuid === item.stationuuid
              ) && (
                <CheckIcon
                  sx={{
                    color: "#1267FC",
                    fontSize: "2rem",
                    fontWeight: "bold",
                  }}
                />
              )}
            </Box>
          ))
        )
      ) : (
        arr.map((item, i) => (
          <Skeleton
            key={i}
            sx={{
              height: "60px",
              width: "98%",
              backgroundColor: "#62626C",
            }}
          />
        ))
      )}
    </>
  );
};

export default SiderComponent;
