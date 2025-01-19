import { createTheme } from "@mui/material";
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  theme: createTheme({
    palette: {
      mode: "dark", // Set the mode to 'dark'
      primary: {
        main: "#bb86fc", // Light purple as primary color
      },
      background: {
        default: "#121212", // Dark background color for the page
        paper: "#1e1e1e", // Darker background for the paper component
      },
      text: {
        primary: "#ffffff", // White text color
      },
    },
  }),
};

export const themeSlice = createSlice({
  name: "theme",
  initialState,
  reducers: {},
});

export const {} = themeSlice.actions;
export default themeSlice.reducer;
