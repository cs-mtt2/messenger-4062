import React, { useState } from "react"
import { makeStyles } from "@material-ui/core/styles";
import {
  Grid,
  Typography,
  FormControl,
  TextField,
  Button,
  FormHelperText
} from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
  entryPanelMargin: theme.customStyles.entryPanelMargin,
  formWidth: theme.customStyles.formWidth,
}))

const RegisterForm = (props) => {
  const { onFormSubmit } = props
  const classes = useStyles();  
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

    await onFormSubmit({ username, email, password });
  }

  return(
    <Grid container direction="row" justifyContent="center" className={classes.entryPanelMargin}>
      <form className={classes.formWidth} onSubmit={handleRegister} fullWidth>
        <Grid item>
          <Typography variant="h3">Create an account.</Typography>
        </Grid>
        <Grid item>
            <FormControl fullWidth>
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
            <FormControl fullWidth>
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
            <FormControl error={!!formErrorMessage.confirmPassword} fullWidth>
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
            <FormControl error={!!formErrorMessage.confirmPassword} fullWidth>
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
  );
}

export default RegisterForm;