import axios from "axios";

const API_URL = "https://de1.api.radio-browser.info/json/stations";

export const handleGetStationsService = async () => {
  const response = await axios.get(`${API_URL}/search?limit=10`);
  return response.data;
};

export const handleFilterStationService = async ( station ) => {
  const response = await axios.get(`${API_URL}/byname/${station}?limit=10`);
  return response.data;
};

export const handleFilterCountryService = async ( country ) => {
  const response = await axios.get(`${API_URL}/bycountry/${country}?limit=10`);
  return response.data;
};

export const handleFilterLanguageService = async ( language ) => {
  const response = await axios.get(
    `${API_URL}/bylanguage/${language}?limit=10`
  );
  return response.data;
};
