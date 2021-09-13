import React from "react"
import { makeStyles } from "@material-ui/core/styles";
import {
  Grid,
  Typography,
  FormControl,
  TextField,
  Button
} from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
  entryPanelMargin: theme.customStyles.entryPanelMargin,
  formWidth: theme.customStyles.formWidth,
}))

const LoginForm = (props) => {
  const { onFormSubmit } = props
  const classes = useStyles();  

  const handleLogin = async (event) => {
    event.preventDefault();
    const username = event.target.username.value;
    const password = event.target.password.value;

    await onFormSubmit({ username, password });
  };

  return(
    <Grid container direction="row" justifyContent="center" className={classes.entryPanelMargin}>
      <form className={classes.formWidth} onSubmit={handleLogin} fullWidth>
        <Grid item>
          <Typography variant="h3">Welcome back!</Typography>
        </Grid>
        <Grid item >
          <FormControl fullWidth required>
            <TextField
              aria-label="username"
              label="Username"
              name="username"
              type="text"
            />
          </FormControl>
        </Grid>
        <Grid item >
          <FormControl fullWidth required>
            <TextField
              label="Password"
              aria-label="password"
              type="password"
              name="password" 
            />
          </FormControl>  
        </Grid>
        <Grid item/>
        <Grid item>
          <Grid container justifyContent="center">
            <Button type="submit" variant="contained" size="large" color="primary" >Login</Button>
          </Grid> 
        </Grid>
      </form>
    </Grid>
  );
}

export default LoginForm;