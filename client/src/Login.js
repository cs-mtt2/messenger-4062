import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Redirect, useHistory } from "react-router-dom";
import { connect } from "react-redux";
import {
  Grid,
} from "@material-ui/core";
import { login } from "./store/utils/thunkCreators";
import EntryLeftPanel from "./components/Login/EntryLeftPanel";
import EntryRightPanel from "./components/Login/EntryRightPanel";

const useStyles = makeStyles((theme) => ({
  root: {
    height: "100vh",
  },
}));

const Login = (props) => {
  const classes = useStyles();  
  const history = useHistory();
  const { user, login } = props;

  const handleLogin = async (details) => {
    await login(details);
  };

  if (user.id) {
    return <Redirect to="/home" />;
  }

  return (
    <Grid container className={classes.root}>
      <EntryLeftPanel/>
      <EntryRightPanel formType="login" onFormSubmit={handleLogin} onFormSwap={() => {history.push("/register")}}/>
    </Grid>
  );
};

const mapStateToProps = (state) => {
  return {
    user: state.user,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    login: (credentials) => {
      dispatch(login(credentials));
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Login);
