import { useEffect, useRef, useState } from "react";
import { Box, Divider, TextField, Typography } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import Hls from "hls.js";
import StopIcon from "@mui/icons-material/Stop";
import { styled } from "@mui/material/styles";
import FavoriteIcon from "@mui/icons-material/Favorite";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";

const CssSearchField = styled(TextField)({
  "& .MuiInputBase-input": {
    color: "#FFFFFF",
    borderColor: "#FFFFFF",
  },
  "& .MuiFormLabel-root": {
    color: "#FFFFFF",
  },
  "& label.Mui-focused": {
    color: "#FFFFFF",
  },
  "& .MuiInput-underline:after": {
    borderBottomColor: "#FFFFFF",
    color: "#FFFFFF",
  },
  "& .MuiOutlinedInput-root": {
    color: "#FFFFFF",
    borderRadius: "10px",
    width: "100%",
    marginBottom: "20px",
    padding: 0,
    "& fieldset": {
      borderColor: "#FFFFFF",
      border: "none",
      color: "#FFFFFF",
    },
    "&:hover fieldset": {
      borderColor: "#FFFFFF",
      color: "#FFFFFF",
    },
    "&.Mui-focused fieldset": {
      borderColor: "#FFFFFF",
      color: "#FFFFFF",
    },
  },
});

const BrowserRadio = ({
  viewSearch,
  setViewCard,
  setViewSearch,
  searchFavorites,
  setSearchFavorites,
  stationSelected,
  isPlaying,
  setIsPlaying,
  myFavorites,
  setMyFavorites,
  setBackupFavorites,
  backupFavorites,
  setStationSelected,
}) => {
  const audioRef = useRef(null);
  const [openEditing, setOpenEditing] = useState(false);
  const [titleEditing, setTitleEditing] = useState("");
  const [indexEditing, setIndexEditing] = useState();

  const handleAddFavorite = () => {
    setMyFavorites([...myFavorites, stationSelected]);
    setBackupFavorites([...myFavorites, stationSelected]);
    let list = myFavorites;
    list.push(stationSelected);
    localStorage.setItem("myFavorites", JSON.stringify(list));
  };

  const handleRemoveFavorite = (station) => {
    let list = myFavorites.filter(
      (item) => item.stationuuid !== station.stationuuid
    );
    setMyFavorites(list);
    setBackupFavorites(list);
    localStorage.setItem("myFavorites", JSON.stringify(list));
  };

  useEffect(() => {
    if (stationSelected && stationSelected.url.endsWith(".m3u8")) {
      toogleM3u8();
    } else if (stationSelected) {
      toggleAudio();
    }
  }, [stationSelected, audioRef]);

  const toggleAudio = () => {
    if (audioRef.current && !audioRef.current.error) {
      audioRef.current.play();
    }
  };

  const toogleM3u8 = () => {
    if (Hls.isSupported()) {
      const hls = new Hls();
      const audio = audioRef.current;
      const m3u8Url = stationSelected.url;

      hls.loadSource(m3u8Url);
      hls.attachMedia(audio);

      hls.on(Hls.Events.MANIFEST_PARSED, () => {
        audio.play();
      });
    } else if (audioRef.current.canPlayType("application/vnd.apple.mpegurl")) {
      audioRef.current.src = stationSelected.url;
      audioRef.current.addEventListener("loadedmetadata", () => {
        audioRef.current.play();
      });
    }
  };

  useEffect(() => {
    if (searchFavorites !== "") {
      const filterItems = backupFavorites.filter((favorite) =>
        favorite.name
          .toLowerCase()
          .includes(searchFavorites.toLocaleLowerCase())
      );
      setMyFavorites(filterItems);
    } else if (backupFavorites.length > 0) {
      setMyFavorites(backupFavorites);
    }
  }, [searchFavorites]);

  const handleEditStation = () => {
    let list = myFavorites;
    list[indexEditing].name = titleEditing;
    setMyFavorites(list);
    setBackupFavorites(list);
    localStorage.setItem("myFavorites", JSON.stringify(list));
    setTitleEditing("");
    setOpenEditing(false);
    if (stationSelected.stationuuid === list[indexEditing].stationuuid) {
      setStationSelected(list[indexEditing]);
    }
  };

  return (
    <>
      <SearchIcon
        sx={{
          display: { xs: !viewSearch ? "block" : "none", md: "none" },
          color: "#1267FC",
          width: "30px",
          height: "30px",
          cursor: "pointer",
          position: "absolute",
          top: 10,
          right: 10,
        }}
        onClick={() => {
          setTimeout(() => {
            setViewCard(false);
          }, 1001);
          setViewSearch(!viewSearch);
        }}
      />
      <Box
        sx={{
          width: "1200px",
          maxWidth: "95%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Typography
          sx={{
            fontFamily: "Inter",
            fontSize: "28px",
            fontWeight: 600,
            lineHeight: "33.89px",
            textAlign: "left",
            color: "#FFFFFF",
          }}
        >
          Radio Browser
        </Typography>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            mt: 2,
            width: "100% ",
          }}
        >
          <Typography
            sx={{
              fontFamily: "Inter",
              fontSize: { xs: "12px", md: "16px" },
              fontWeight: 400,
              lineHeight: "19.36px",
              textAlign: "left",
              color: "#FFFFFF",
            }}
          >
            FAVORITE RADIOS
          </Typography>
          <Box
            sx={{
              display: "flex",
              alignItems: "flex-end",
              pb: 2,
              maxWidth: "50%",
            }}
          >
            <SearchIcon
              sx={{
                my: 0.5,
                color: "#1267FC",
                mr: 1,
                width: "28px",
                height: "28px",
              }}
            />
            <CssSearchField
              label="Search favorite"
              variant="standard"
              value={searchFavorites}
              onChange={(e) => setSearchFavorites(e.target.value)}
            />
          </Box>
        </Box>
        {stationSelected && <audio ref={audioRef} src={stationSelected.url} />}
        <Box
          sx={{
            backgroundColor: "#4D4D56",
            height: { xs: "450px", md: "509px" },
            width: "100%",
            borderRadius: "10px",
            p: 1,
            overflowY: "scroll",
            "::-webkit-scrollbar": {
              display: "none",
            },
          }}
        >
          {stationSelected && (
            <>
              <Box
                sx={{
                  height: "64px",
                  width: "98%",
                  mt: 2,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  p: 1,
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 2,
                  }}
                >
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      backgroundImage: `url(${stationSelected.favicon})`,
                      backgroundSize: "cover",
                      backgroundRepeat: "no-repeat",
                      width: "50px",
                      height: "50px",
                      borderRadius: "50%",
                    }}
                  >
                    {isPlaying ? (
                      <StopIcon
                        sx={{
                          cursor: "pointer",
                          width: "40px",
                          height: "40px",
                          opacity: ".9",
                          color: stationSelected.favicon ? "grey" : "black",
                        }}
                        onClick={() => {
                          audioRef.current.pause();
                          setIsPlaying(false);
                        }}
                      />
                    ) : (
                      <PlayArrowIcon
                        sx={{
                          cursor: "pointer",
                          width: "40px",
                          height: "40px",
                          opacity: ".9",
                          color: stationSelected.favicon ? "grey" : "black",
                        }}
                        onClick={() => {
                          audioRef.current.play();
                          setIsPlaying(true);
                        }}
                      />
                    )}
                  </Box>
                  <Box>
                    <Typography>{stationSelected.name}</Typography>
                    <Typography>
                      {stationSelected.country} {stationSelected.countrycode}
                    </Typography>
                  </Box>
                </Box>
                {!myFavorites.find(
                  (station) =>
                    station.stationuuid === stationSelected.stationuuid
                ) && (
                  <FavoriteIcon
                    sx={{ cursor: "pointer" }}
                    onClick={() => handleAddFavorite()}
                  />
                )}
              </Box>
              <Divider sx={{ color: "#605C5C", height: "2px" }} />
            </>
          )}
          {myFavorites && myFavorites.length > 0 ? (
            myFavorites.map((item, i) => (
              <Box
                key={item.changeuuid}
                sx={{
                  backgroundColor: "#62626C",
                  height: "64px",
                  width: "98%",
                  mt: 2,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  p: { xs: 0.5, md: 1 },
                  borderRadius: "7px",
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 2,
                    maxWidth: "80%",
                  }}
                >
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      backgroundImage: `url(${item.favicon})`,
                      backgroundSize: "cover",
                      backgroundRepeat: "no-repeat",
                      width: { xs: "35px", md: "50px" },
                      height: { xs: "35px", md: "50px" },
                      borderRadius: "50%",
                    }}
                  >
                    {stationSelected &&
                    item.stationuuid === stationSelected.stationuuid ? (
                      isPlaying ? (
                        <StopIcon
                          sx={{
                            cursor: "pointer",
                            width: "40px",
                            height: "40px",
                            opacity: ".9",
                            color: item.favicon ? "grey" : "black",
                          }}
                          onClick={() => {
                            audioRef.current.pause();
                            setIsPlaying(false);
                          }}
                        />
                      ) : (
                        <PlayArrowIcon
                          sx={{
                            cursor: "pointer",
                            width: "40px",
                            height: "40px",
                            opacity: ".9",
                            color: item.favicon ? "grey" : "black",
                          }}
                          onClick={() => {
                            audioRef.current.play();
                            setIsPlaying(true);
                          }}
                        />
                      )
                    ) : (
                      <PlayArrowIcon
                        sx={{
                          cursor: "pointer",
                          width: "40px",
                          height: "40px",
                          opacity: ".9",
                          color: item.favicon ? "grey" : "black",
                        }}
                        onClick={() => {
                          setStationSelected(item);
                          setIsPlaying(true);
                        }}
                      />
                    )}
                  </Box>
                  <Box
                    sx={{
                      maxWidth: "80%",
                    }}
                  >
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
                        maxWidth: "100%",
                      }}
                    >
                      {item.name}
                    </Typography>
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
                        maxWidth: "100%",
                      }}
                    >
                      {item.country} {item.countrycode}
                    </Typography>
                  </Box>
                </Box>

                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 2,
                  }}
                >
                  <EditIcon
                    sx={{ cursor: "pointer" }}
                    onClick={() => {
                      setTitleEditing(item.name);
                      setIndexEditing(i);
                      setOpenEditing(true);
                    }}
                  />
                  <DeleteIcon
                    sx={{ cursor: "pointer" }}
                    onClick={() => handleRemoveFavorite(item)}
                  />
                </Box>
              </Box>
            ))
          ) : (
            <Typography
              sx={{
                fontFamily: "Inter",
                fontSize: { xs: "12px", md: "16px" },
                fontWeight: 400,
                lineHeight: "19.36px",
                textAlign: "left",
                color: "#FFFFFF",
              }}
            >
              Empty favourites list, add stations to see your list
            </Typography>
          )}
        </Box>
      </Box>
      <Dialog
        open={openEditing}
        onClose={() => setOpenEditing(false)}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {"Editing name rádio on favorites"}
        </DialogTitle>
        <DialogContent>
          <TextField
            value={titleEditing}
            onChange={(e) => setTitleEditing(e.target.value)}
            fullWidth
          />
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              setOpenEditing(false);
              setTitleEditing("");
            }}
          >
            Cancel
          </Button>
          <Button onClick={() => handleEditStation()}>Save</Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default BrowserRadio;
