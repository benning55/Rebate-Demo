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
import { useHistory, useLocation } from "react-router-dom"
import moment from "moment"

const drawerWidth = 240

const useStyles = makeStyles((theme) => {
  return {
    page: {
      background: "#f9f9f9",
      width: "100%",
      padding: theme.spacing(8),
    },
    drawer: {
      width: drawerWidth,
    },
    drawPaper: {
      width: drawerWidth,
      background: "#81c784",
    },
    root: {
      display: "flex",
    },
    active: {
      background: "#f4f4f4",
    },
    title: {
      padding: theme.spacing(3),
      textAlign: "center",
    },
    appBar: {
      width: `calc(100% - ${drawerWidth}px)`,
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
      icon: <ListIcon color='secondary' />,
      path: "/",
    },
    {
      text: "Default Rebate",
      icon: <RedeemIcon color='secondary' />,
      path: "/dd",
    },
  ]
  return (
    <div className={classes.root}>
      {/* app bar */}
      <AppBar className={classes.appBar} elevation={0} color='secondary'>
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
          <Typography variant='h5' className={classes.title}>
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
              className={location.pathname == item.path ? classes.active : null}
            >
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText>{item.text}</ListItemText>
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
