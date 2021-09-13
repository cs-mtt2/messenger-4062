import { createMuiTheme } from "@material-ui/core";
import {responsiveFontSizes } from '@material-ui/core/styles';

let muiTheme = createMuiTheme({
  typography: {
    fontFamily: "Open Sans, sans-serif",
    fontSize: 16,
    h3: {
      fontWeight: "bolder"
    },
    button: {
      textTransform: "none",
      letterSpacing: 0,
      fontWeight: "bold"
    },
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
    MuiFormControl: {
      root:{
        marginTop: "1vh",
        marginBottom: "1vh",
        '@media (max-height:650px)': {
          marginTop: "0.5vh",
          marginBottom: "0.5vh",
        },
      }
    }
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
  '@media (max-height:600px), (max-width:600px)': {
    width: muiTheme.spacing(25),
    height: muiTheme.spacing(6),
  },
};
muiTheme.overrides.MuiGrid = {
  item: {
    padding: "1vmin",
    [muiTheme.breakpoints.down('xs')]: {
      padding: "0.5vmin",
    },
  }
}

muiTheme.customStyles = {
  entryPanelMargin: {
    paddingLeft: muiTheme.spacing(6),
    paddingRight: muiTheme.spacing(6),
  },
  formWidth:{
    width: "90%",
  },
}

export const theme = responsiveFontSizes(muiTheme);
