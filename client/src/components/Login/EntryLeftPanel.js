import React from "react"
import { makeStyles } from "@material-ui/core/styles";
import {
  Grid,
  Typography,
  Hidden,
} from "@material-ui/core";

import MessageIcon from '../../components/Icons/MessageIcon'
import Image from '../../media/bg-img.png'
const useStyles = makeStyles((theme) => ({
  leftPanel: {
    backgroundImage: `linear-gradient(rgba(58, 141, 255, 0.75), rgba(58, 141, 255, 0.85)), url(${Image})`,
    backgroundSize: 'cover',
    padding: theme.spacing(10),
  },
  marginBelowMessageIcon: {
    marginTop: theme.spacing(4),
  },
}))

const EntryLeftPanel = (props) => {
  const classes = useStyles();  

  return(
    <Hidden smDown>
      <Grid container item sm={12} md={5} className={classes.leftPanel}>
        <Grid container direction="column" alignItems="center" justifyContent="center">
          <MessageIcon scale="1.5"/>
          <Typography className={classes.marginBelowMessageIcon} align="center" variant="h4" color="secondary">Converse with anyone with any language</Typography>
        </Grid>   
      </Grid>
    </Hidden>
  );
}

export default EntryLeftPanel;