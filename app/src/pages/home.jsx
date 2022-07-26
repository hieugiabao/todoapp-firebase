import React, { useState } from "react";
import { withStyles } from "@mui/styles";
import { useNavigate } from "react-router-dom";

import {
  AppBar,
  Avatar,
  CircularProgress,
  CssBaseline,
  Divider,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Typography,
} from "@mui/material";
import { AccountBox, ExitToApp, Notes } from "@mui/icons-material";
import { useAuth } from "../hooks/useAuth";
import Account from "../components/Account";
import Todo from "../components/Todo";

const drawerWidth = 240;

const styles = (theme) => ({
  root: {
    display: "flex",
  },
  appBar: {
    zIndex: "1251 !important",
  },
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
    zIndex: "1250 !important",
  },
  drawerPaper: {
    width: drawerWidth,
  },
  content: {
    flexGrow: 1,
    padding: "24px",
  },
  avatar: {
    height: 130,
    width: 120,
    flexShrink: 0,
    flexGrow: 0,
    marginTop: 20,
  },
  uiProgess: {
    position: "fixed",
    zIndex: "1000",
    height: "31px",
    width: "31px",
    left: "50%",
    top: "35%",
  },
  toolbar: theme.mixins.toolbar,
});

const Home = ({ classes }) => {
  const [render, setRender] = useState(false);
  const navigate = useNavigate();
  const { user, loading: UILoading, setUser } = useAuth();

  if (UILoading) {
    return (
      <div className={classes.root}>
        <CircularProgress size={150} className={classes.uiProgess} />
      </div>
    );
  } else
    return (
      <div className={classes.root}>
        <CssBaseline />
        <AppBar position="fixed" className={classes.appBar}>
          <Toolbar>
            <Typography variant="h6" noWrap>
              TodoApp
            </Typography>
          </Toolbar>
        </AppBar>
        <Drawer
          className={classes.drawer}
          variant="permanent"
          classes={{ paper: classes.drawerPaper }}
        >
          <div className={classes.toolbar}></div>
          <Divider />
          <center>
            <Avatar
              src={user.profilePicture}
              className={classes.avatar}
              sx={{ width: 110, height: 100 }}
            />
            <p>
              {" "}
              {user.firstName} {user.lastName}
            </p>
          </center>
          <Divider />
          <List>
            <ListItem button key="Todo" onClick={(e) => setRender(false)}>
              <ListItemIcon>
                {" "}
                <Notes />{" "}
              </ListItemIcon>
              <ListItemText primary="Todo" />
            </ListItem>

            <ListItem button key="Account" onClick={(e) => setRender(true)}>
              <ListItemIcon>
                {" "}
                <AccountBox />{" "}
              </ListItemIcon>
              <ListItemText primary="Account" />
            </ListItem>

            <ListItem
              button
              key="Logout"
              onClick={(e) => {
                localStorage.removeItem("auth-token");
                navigate("/login");
              }}
            >
              <ListItemIcon>
                {" "}
                <ExitToApp />{" "}
              </ListItemIcon>
              <ListItemText primary="Logout" />
            </ListItem>
          </List>
        </Drawer>

        <div>
          {render ? <Account user={user} setUser={setUser} /> : <Todo />}
        </div>
      </div>
    );
};

export default withStyles(styles)(Home);
