import { createMuiTheme, responsiveFontSizes } from "@material-ui/core/styles";

const theme = responsiveFontSizes(createMuiTheme({
  palette: {
    primary: {
      main: "#0c30cc",
      dark: "#0b2696",
      light: "#f4f6fa"
    },
    secondary: {
      main: "#ff592b"
    },
    divider: "#e4e9f4"
  },
  typography: {
    fontFamily: [
      "Poppins",
      "Arial",
      "sans-serif"
    ].join(","),
    h3: {
      fontWeight: 500
   },
  },
  shape:{
    borderRadius:8
  },
  overrides: {
    MuiDrawer: {
      paper: {
        width: 240,
      },
    }
  }
}));

export default theme;