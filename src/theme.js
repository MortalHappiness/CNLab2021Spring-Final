import { createMuiTheme } from "@material-ui/core/styles";

// A custom theme for this app
const theme = createMuiTheme({
  palette: {
    primary: {
      main: "#977bf4",
      contrastText: "#ffffff",
    },
    secondary: {
      main: "#B766AD",
    },
    //error: {
    //  main: "#f44366",
    //},
    //background: {
    //  default:"#fafafa",
    //},
  },
});

export default theme;
