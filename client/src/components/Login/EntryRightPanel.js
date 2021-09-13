import React from "react"
import {
  Grid,
} from "@material-ui/core";
import SwapLoginRegister from "./SwapLoginRegister";
import LoginForm from "./LoginForm";
import RegisterForm from "./RegisterForm";

const EntryRightPanel = (props) => {
  const { formType, onFormSubmit, onFormSwap } = props;

  return(
    <Grid container item sm={12} md={7}>
      <Grid item xs={12}>
        {formType === "login" && <SwapLoginRegister text="Don't have an account?" buttonText="Create account" onClickHandler={onFormSwap}/> }
        {formType === "register" && <SwapLoginRegister text="Already have an account?" buttonText="Login" onClickHandler={onFormSwap}/> }
      </Grid>

      <Grid item xs={12}>
        {formType === "login" && <LoginForm onFormSubmit={onFormSubmit}/>}
        {formType === "register" && <RegisterForm onFormSubmit={onFormSubmit}/> }
      </Grid>

      <Grid item xs={12}/>


    </Grid>
  );
}

export default EntryRightPanel;