import React, { Component } from 'react'
import {AppBar, Toolbar, Typography, Button, IconButton } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles';
import MenuIcon from '@material-ui/icons/Menu'

const useStyles = makeStyles((theme) => ({
    
        root: {
            flexGrow: 1,
        },
        menuButton: {
            marginRight: theme.spacing(2),
        },
    }));
export default function Navbar() {

    const classes = useStyles();
                                    return (
            <div className={classes.root}>

<AppBar position="static">
  <Toolbar variant="dense">
    <IconButton edge="start" className={classes.menuButton}  color="inherit" aria-label="menu">
      <MenuIcon />
    </IconButton>
    <Typography variant="h6" color="inherit">
      Hackey
    </Typography>
  </Toolbar>
</AppBar>
            </div>
        )
    
}
