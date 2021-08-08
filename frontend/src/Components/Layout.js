import { makeStyles } from "@material-ui/core"
import React from "react"
import {
  Typography,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  AppBar,
  Toolbar,
} from "@material-ui/core"
import ListIcon from "@material-ui/icons/List"
import RedeemIcon from "@material-ui/icons/Redeem"
import ExposureIcon from "@material-ui/icons/Exposure"
import TrackChangesIcon from "@material-ui/icons/TrackChanges"
import { useHistory, useLocation } from "react-router-dom"
import moment from "moment"

const drawerWidth = 240

const useStyles = makeStyles((theme) => {
  return {
    page: {
      width: "100%",
      padding: theme.spacing(8),
    },
    drawer: {
      width: drawerWidth,
    },
    drawPaper: {
      width: drawerWidth,
      background: theme.palette.primary.light,
    },
    root: {
      display: "flex",
    },
    active: {
      background: theme.palette.primary.dark,
    },
    title: {
      padding: theme.spacing(3),
      textAlign: "center",
      fontWeight: theme.typography.fontWeightBold,
    },
    appBar: {
      width: `calc(100% - ${drawerWidth}px)`,
      backgroundColor: theme.palette.primary.dark,
    },
    toolbar: theme.mixins.toolbar,
  }
})

export default function Layout({ children }) {
  const classes = useStyles()
  const history = useHistory()
  const location = useLocation()

  const menuItems = [
    {
      text: "Default Target",
      icon: <TrackChangesIcon style={{ color: "white" }} />,
      path: "/",
    },
    {
      text: "Default Rebate",
      icon: <RedeemIcon style={{ color: "white" }} />,
      path: "/rebate-default",
    },
    {
      text: "Custom Template",
      icon: <ListIcon style={{ color: "white" }} />,
      path: "/custom-template",
    },
    {
      text: "Calculate",
      icon: <ExposureIcon style={{ color: "white" }} />,
      path: "/calculate",
    },
  ]
  return (
    <div className={classes.root}>
      {/* app bar */}
      <AppBar className={classes.appBar} elevation={0}>
        <Toolbar>
          <Typography>Today is {moment().format("LL")}</Typography>
        </Toolbar>
      </AppBar>
      {/* side drawer */}
      <Drawer
        className={classes.drawer}
        variant='permanent'
        anchor='left'
        classes={{ paper: classes.drawPaper }}
      >
        <div>
          <Typography
            variant='h5'
            className={classes.title}
            style={{ color: "white" }}
          >
            Rebate Calculator
          </Typography>
        </div>

        {/* list */}
        <List>
          {menuItems.map((item) => (
            <ListItem
              button
              key={item.text}
              onClick={() => history.push(item.path)}
              className={
                location.pathname === item.path ? classes.active : null
              }
            >
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText style={{ color: "white" }}>
                {item.text}
              </ListItemText>
            </ListItem>
          ))}
        </List>
      </Drawer>
      <div className={classes.page}>
        <div className={classes.toolbar}></div>
        {children}
      </div>
    </div>
  )
}
