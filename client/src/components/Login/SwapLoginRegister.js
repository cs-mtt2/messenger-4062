import React from "react"
import {
  Grid,
  Typography,
  Button,
} from "@material-ui/core";

const SwapLoginRegister = (props) => {
  const { text, buttonText, onClickHandler } = props;

  return(
    <Grid container direction="row" justifyContent="flex-end" alignItems="center">
      <Grid item>
        <Typography variant="h7" color="textSecondary">{text}</Typography>
      </Grid>
      <Grid item>
        <Button variant="contained" size="large" color="secondary" onClick={() => {onClickHandler()}}>{buttonText}</Button>
      </Grid>    
    </Grid>
  );
}

export default SwapLoginRegister;