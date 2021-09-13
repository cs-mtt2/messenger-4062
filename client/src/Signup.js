import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Redirect, useHistory } from "react-router-dom";
import { connect } from "react-redux";
import {
  Grid,
} from "@material-ui/core";
import { register } from "./store/utils/thunkCreators";

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
  const { user, register } = props;

  const handleRegister = async (details) => {
    await register(details);
  };

  if (user.id) {
    return <Redirect to="/home" />;
  }

  return (
    <Grid container className={classes.root}>
      <EntryLeftPanel/>
      <EntryRightPanel formType="register" onFormSubmit={handleRegister} onFormSwap={() => history.push("/login")}/>
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
    register: (credentials) => {
      dispatch(register(credentials));
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Login);
