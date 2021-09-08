import React, { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { Redirect, useHistory } from "react-router-dom";
import { connect } from "react-redux";
import {
  Grid,
  Typography,
  Button,
  FormControl,
  TextField,
  FormHelperText,
} from "@material-ui/core";
import { register } from "./store/utils/thunkCreators";
import Image from './media/bg-img.png'
import MessageIcon from "./components/Icons/MessageIcon"

const useStyles = makeStyles((theme) => ({
  root: {
    height: "100vh",
    minHeight: "740px",
  },
  leftPanel: {
    backgroundImage: `linear-gradient(rgba(58, 141, 255, 0.75), rgba(58, 141, 255, 0.85)), url(${Image})`,
    backgroundSize: 'cover',
    backgroundRepeat: 'no-repeat',
    height: "100%",
    padding: theme.spacing(10),
  },
  centerColumn: {
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
  },
  emptySpacing: {
    margin: theme.spacing(2),
  },
  rightPanel: {
    paddingTop: theme.spacing(1),
    height: "100vh",
  },
  rightPanelLogin:{
    paddingLeft: theme.spacing(4),
    paddingRight: theme.spacing(4),
  },
  buttonTextSize:{
    fontSize: "18px",
  },
  fullWidth: {
    width: "100%",
  },
  marginBelowMessageIcon: {
    marginTop: theme.spacing(4),
  },
}));

const Login = (props) => {
  const classes = useStyles();  
  const history = useHistory();
  const { user, register } = props;
  const [formErrorMessage, setFormErrorMessage] = useState({});

  const handleRegister = async (event) => {
    event.preventDefault();
    const username = event.target.username.value;
    const email = event.target.email.value;
    const password = event.target.password.value;
    const confirmPassword = event.target.confirmPassword.value;

    if (password !== confirmPassword) {
      setFormErrorMessage({ confirmPassword: "Passwords must match" });
      return;
    }

    await register({ username, email, password });
  };

  if (user.id) {
    return <Redirect to="/home" />;
  }

  return (
    <Grid container className={classes.root}>
      <Grid container item sm={12} md={5} className={classes.leftPanel}>
        <Grid container direction="column" alignItems="center" justifyContent="center">
          <MessageIcon scale="1.5"/>
          <Typography className={classes.marginBelowMessageIcon} align="center" variant="h4" color="secondary">Converse with anyone with any language</Typography>
        </Grid>    
      </Grid>

      <Grid container item sm={12} md={7} className={classes.rightPanel}>
        <Grid item xs={12}>
          <Grid container direction="row" justifyContent="flex-end" alignItems="center">
            <Grid item>
              <Typography variant="h7" color="textSecondary">Already have an account?</Typography>
            </Grid>
            <Grid item>
              <Button variant="contained" size="large" color="secondary" className={classes.test} onClick={() => history.push("/login")}>Login</Button>
            </Grid>    
          </Grid>
        </Grid>
        
        <Grid item xs={12}>
          <Grid container direction="row" justifyContent="center" className={classes.rightPanelLogin}>
            <form className={classes.fullWidth} onSubmit={handleRegister} fullWidth>
              <Grid item>
                <Typography variant="h4">Create an account.</Typography>
              </Grid>
              <Grid item>
                  <FormControl margin="normal" fullWidth>
                    <TextField
                      aria-label="username"
                      label="Username"
                      name="username"
                      type="text"
                      required
                    />
                  </FormControl>
                </Grid>
                <Grid item>
                  <FormControl margin="normal" fullWidth>
                    <TextField
                      label="E-mail address"
                      aria-label="e-mail address"
                      type="email"
                      name="email"
                      required
                    />
                  </FormControl>
                </Grid>
                <Grid item>
                  <FormControl error={!!formErrorMessage.confirmPassword} margin="normal" fullWidth>
                    <TextField
                      aria-label="password"
                      label="Password"
                      type="password"
                      inputProps={{ minLength: 6 }}
                      name="password"
                      required
                    />
                    <FormHelperText>
                      {formErrorMessage.confirmPassword}
                    </FormHelperText>
                  </FormControl>
                </Grid>
                <Grid item>
                  <FormControl error={!!formErrorMessage.confirmPassword} margin="normal" fullWidth>
                    <TextField
                      label="Confirm Password"
                      aria-label="confirm password"
                      type="password"
                      inputProps={{ minLength: 6 }}
                      name="confirmPassword"
                      required
                    />
                    <FormHelperText>
                      {formErrorMessage.confirmPassword}
                    </FormHelperText>
                  </FormControl>
                </Grid>
              <Grid item/>
              <Grid item>
                <Grid container justifyContent="center">
                  <Button type="submit" variant="contained" size="large" color="primary" className={classes.buttonTextSize}>Create</Button>
                </Grid> 
              </Grid>
            </form>
          </Grid>
        </Grid>

        <Grid item xs={12}/>

      </Grid>
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
