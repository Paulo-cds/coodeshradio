import { useEffect, useState } from "react";
import {
  handleFilterCountryService,
  handleFilterLanguageService,
  handleFilterStationService,
  handleGetStationsService,
} from "./services/services";
import { Box } from "@mui/material";
import Grid from "@mui/material/Grid2";
import BrowserRadio from "./components/BrowserRadio";
import SiderComponent from "./components/SiderComponent";

function App() {
  const [stationsList, setStationsList] = useState([]);
  const [stationSelected, setStationSelected] = useState();
  const [typeSearch, setTypeSearch] = useState("station");
  const [valueSearch, setValueSearch] = useState("");
  const [myFavorites, setMyFavorites] = useState([]);
  const [backupFavorites, setBackupFavorites] = useState([]);
  const [viewSearch, setViewSearch] = useState(true);
  const [viewCard, setViewCard] = useState(false);
  const [searchFavorites, setSearchFavorites] = useState("");
  const [loadingStations, setLoadingStations] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [errorLoad, setErrorLoad] = useState(false)

  useEffect(() => {
    handleGetStations();
    if (localStorage.getItem("myFavorites")) {
      const favoritesList = localStorage.getItem("myFavorites");
      setMyFavorites(JSON.parse(favoritesList));
      setBackupFavorites(JSON.parse(favoritesList));
    }
  }, []);

  const handleGetStations = async () => {
    setLoadingStations(true);
    setErrorLoad(false)
    try {
      const response = await handleGetStationsService();
      setStationsList(response);
    } catch (e) {
      console.log(e);
      setErrorLoad(true)
    }
    setLoadingStations(false);
  };

  useEffect(() => {
    if (valueSearch !== "") {
      handleSearch();
    }
  }, [valueSearch]);

  const handleSearch = async () => {
    setLoadingStations(true);
    try {
      const response =
        typeSearch === "station"
          ? await handleFilterStationService(valueSearch)
          : typeSearch === "country"
          ? await handleFilterCountryService(valueSearch)
          : await handleFilterLanguageService(valueSearch);
      setStationsList(response);
    } catch (e) {
      console.log(e);
    }
    setLoadingStations(false);
  };

  return (
    <Box
      sx={{
        width: "100vw",
        height: "100vh",
        backgroundColor: "#2F2F33",
      }}
    >
      <Grid
        container
        spacing={2}
        sx={{
          height: "100%",
          display: "flex",
          overflowX: "hidden",
          flexWrap: "no-wrap",
        }}
      >
        <Grid
          size={{ xs: viewSearch ? 12 : 0, md: 3 }}
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "flex-start",
            backgroundColor: "#1E1E21",
            gap: 2,
            height: "100%",
            p: { xs: viewSearch ? 2 : 0, md: 2 },
            transition: ".8s ease-in-out",
            overflowY: "scroll",
            "::-webkit-scrollbar": {
              display: "none",
            },
          }}
        >
          <SiderComponent
            setViewCard={setViewCard}
            setViewSearch={setViewSearch}
            viewSearch={viewSearch}
            typeSearch={typeSearch}
            setTypeSearch={setTypeSearch}
            valueSearch={valueSearch}
            setValueSearch={setValueSearch}
            loadingStations={loadingStations}
            stationsList={stationsList}
            setStationSelected={setStationSelected}
            myFavorites={myFavorites}
            setIsPlaying={setIsPlaying}
            errorLoad={errorLoad}
            handleGetStations={handleGetStations}
          />
        </Grid>
        <Grid
          size={{ xs: !viewSearch ? 11 : 0, md: 9 }}
          sx={{
            display: { xs: viewCard ? "flex" : "none", md: "flex" },
            flexDirection: "column",
            alignItems: "center",
            justifyContent: {xs:'flex-start',md:"center"},
            transition: ".8s ease-in-out",
          }}
        >
          <BrowserRadio
            viewSearch={viewSearch}
            setViewCard={setViewCard}
            setViewSearch={setViewSearch}
            searchFavorites={searchFavorites}
            setSearchFavorites={setSearchFavorites}
            stationSelected={stationSelected}
            isPlaying={isPlaying}
            setIsPlaying={setIsPlaying}
            myFavorites={myFavorites}
            setMyFavorites={setMyFavorites}
            setBackupFavorites={setBackupFavorites}
            setStationSelected={setStationSelected}
            backupFavorites={backupFavorites}
          />
        </Grid>
      </Grid>
    </Box>
  );
}

export default App;
