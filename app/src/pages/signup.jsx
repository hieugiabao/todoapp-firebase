import { makeStyles } from "@mui/styles";
import React from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  Container,
  CssBaseline,
  Avatar,
  Typography,
  Grid,
  TextField,
  Button,
  CircularProgress,
  Link,
} from "@mui/material";
import { LockOutlined } from "@mui/icons-material";
import axios from "axios";

const useStyles = makeStyles({
  paper: {
    marginTop: "48px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  avatar: {
    margin: "8px",
    backgroundColor: "rebeccapurple !important",
  },
  form: {
    width: "100%",
    marginTop: "24px",
  },
  submit: {
    margin: "24px 0 16px",
  },
  progess: {
    position: "absolute",
  },
  customError: {
    color: "red",
    fontSize: "0.8rem",
  },
});

const SignUp = () => {
  const classes = useStyles();
  const userInfoDefault = {
    firstName: "",
    lastName: "",
    country: "",
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  };
  const [userInfo, setUserInfo] = useState(userInfoDefault);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setUserInfo((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
    setErrors({});
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);

    axios
      .post("/signup", userInfo)
      .then((res) => {
        localStorage.setItem("auth-token", `Bearer ${res.data.token}`);
        setLoading(false);
        navigate("/");
      })
      .catch((err) => {
        setErrors(err.response.data);
        setLoading(false);
      });
  };

  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <div className={classes.paper}>
        <Avatar className={classes.avatar}>
          <LockOutlined />
        </Avatar>
        <Typography component="h1" variant="h5">
          Sign up
        </Typography>
        <form className={classes.form} noValidate>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                variant="outlined"
                required
                fullWidth
                id="firstName"
                label="First Name"
                name="firstName"
                autoComplete="firstName"
                helperText={errors?.firstName}
                error={errors?.firstName ? true : false}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                variant="outlined"
                required
                fullWidth
                id="lastName"
                label="Last Name"
                name="lastName"
                autoComplete="lastName"
                helperText={errors?.lastName}
                error={errors?.lastName ? true : false}
                onChange={handleChange}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                variant="outlined"
                required
                fullWidth
                id="country"
                label="Country"
                name="country"
                autoComplete="country"
                helperText={errors.country}
                error={errors.country ? true : false}
                onChange={handleChange}
              />
            </Grid>

            <Grid item xs={12} sm={12}>
              <TextField
                variant="outlined"
                required
                fullWidth
                id="username"
                label="Username"
                name="username"
                autoComplete="username"
                helperText={errors?.username}
                error={errors?.username ? true : false}
                onChange={handleChange}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                variant="outlined"
                required
                fullWidth
                id="email"
                label="Email Address"
                name="email"
                autoComplete="email"
                helperText={errors?.email}
                error={errors?.email ? true : false}
                onChange={handleChange}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                variant="outlined"
                required
                fullWidth
                name="password"
                label="Password"
                type="password"
                id="password"
                autoComplete="current-password"
                helperText={errors?.password}
                error={errors?.password ? true : false}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                variant="outlined"
                required
                fullWidth
                name="confirmPassword"
                label="Confirm Password"
                type="password"
                id="confirmPassword"
                autoComplete="current-password"
                helperText={errors?.confirmPassword}
                error={errors?.confirmPassword ? true : false}
                onChange={handleChange}
              />
            </Grid>
          </Grid>
          <div className={classes.submit}>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              onClick={handleSubmit}
              disabled={
                loading ||
                !userInfo.email ||
                !userInfo.password ||
                !userInfo.firstName ||
                !userInfo.lastName ||
                !userInfo.country ||
                !userInfo.username
              }
            >
              Sign Up
              {loading && (
                <CircularProgress size={30} className={classes.progess} />
              )}
            </Button>
          </div>
          <Grid container justify="flex-end">
            <Grid item>
              <Link href="login" variant="body2">
                Already have an account? Sign in
              </Link>
            </Grid>
          </Grid>
          {errors?.general && (
            <Typography variant="body2" className={classes.customError}>
              {errors.general}
            </Typography>
          )}
        </form>
      </div>
    </Container>
  );
};

export default SignUp;
