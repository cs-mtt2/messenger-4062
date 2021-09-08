import { createMuiTheme } from "@material-ui/core";
import {responsiveFontSizes } from '@material-ui/core/styles';

let muiTheme = createMuiTheme({
  typography: {
    fontFamily: "Open Sans, sans-serif",
    fontSize: 14,
    button: {
      textTransform: "none",
      letterSpacing: 0,
      fontWeight: "bold"
    }
  },
  overrides: {
    MuiInput: {
      input: {
        fontWeight: "bold"
      }
    },
    MuiButton: {
      containedSecondary: {
        color: "#3A8DFF",
      },
    },
  },
  palette: {
    primary: { main: "#3A8DFF" },
    secondary: { main: "#FFFFFF" }
  },
});

// Add any additional theme settings that are dependent on the creation of theme
muiTheme.overrides.MuiButton.contained = {
  width: muiTheme.spacing(25),
  height: muiTheme.spacing(8),
};
muiTheme.overrides.MuiGrid = {
  item: {
    padding: "2%",
  }
}

export const theme = responsiveFontSizes(muiTheme);
