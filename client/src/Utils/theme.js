import { createMuiTheme, responsiveFontSizes } from "@material-ui/core/styles";

const theme = responsiveFontSizes(createMuiTheme({
  spacing: 1,
  palette: {
    primary: {
      main: "#0c30cc",
      dark: "#00089a",
      light: "#f0f3f9"
    },
    secondary: {
      main: "#ff592b"
    }
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
  }
}));

export default theme;