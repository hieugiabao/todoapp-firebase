import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { makeStyles } from "@mui/styles";
import Container from "@mui/material/Container";
import {
  Avatar,
  Button,
  CircularProgress,
  CssBaseline,
  TextField,
  Typography,
  Grid,
  Link,
} from "@mui/material";
import { LockOutlined } from "@mui/icons-material";

import axios from "axios";

const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: "56px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  submit: {
    margin: "16px 0px 16px",
  },
  avatar: {
    backgroundColor: "rebeccapurple !important",
    margin: "16px",
  },
  form: {
    width: "100%", // Fix IE 11 issue.
    margin: "8px 0 10px",
  },
  customError: {
    color: "red",
    fontSize: "0.8rem",
  },
  progess: {
    position: "absolute",
  },
  askText: {
    textDecoration: "none !important",
  },
}));

const Login = () => {
  const classes = useStyles();
  const [loginInfo, setLoginInfo] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);

    axios
      .post("/login", loginInfo)
      .then((res) => {
        localStorage.setItem("auth-token", `Bearer ${res.data.token}`);
        setLoading(false);
        navigate("/");
      })
      .catch((error) => {
        setErrors(error.response.data);
        setLoading(false);
      });
  };

  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline enableColorScheme />
      <div className={classes.paper}>
        <Avatar className={classes.avatar}>
          <LockOutlined />
        </Avatar>
        <Typography component="h1" variant="h5">
          Login
        </Typography>
        <form className={classes.form} noValidate>
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            id="email"
            label="Email Adress"
            name="email"
            autoComplete="email"
            autoFocus
            error={errors?.email ? true : false}
            helperText={errors?.email}
            onChange={(e) => {
              setLoginInfo((prev) => ({ ...prev, email: e.target.value }));
              setErrors({});
            }}
          />
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            name="password"
            label="Password"
            type="password"
            id="password"
            autoComplete="current-password"
            helperText={errors?.password}
            error={errors?.password ? true : false}
            onChange={(e) => {
              setLoginInfo((prev) => ({ ...prev, password: e.target.value }));
              setErrors({});
            }}
          />
          <div className={classes.submit}>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              onClick={handleSubmit}
              disabled={loading || !loginInfo.email || !loginInfo.password}
            >
              Sign In
              {loading && (
                <CircularProgress size={30} className={classes.progess} />
              )}
            </Button>
          </div>
          <div className={classes.askText}>
            <Grid container={true}>
              <Grid item={true}>
                <Link href="signup" variant="body2">
                  {"Don't have an account? Sign Up"}
                </Link>
              </Grid>
            </Grid>
          </div>
          {errors?.message && (
            <Typography variant="body2" className={classes.customError}>
              {errors.message}
            </Typography>
          )}
        </form>
      </div>
    </Container>
  );
};

export default Login;
