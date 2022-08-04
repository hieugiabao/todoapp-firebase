import React, { useState } from "react";
import { withStyles } from "@mui/styles";
import {
  Button,
  Card,
  CardContent,
  Typography,
  Divider,
  Grid,
  TextField,
  CircularProgress,
  CardActions,
} from "@mui/material";
import { CloudUpload, PermMedia } from "@mui/icons-material";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const styles = (theme) => ({
  content: {
    flexGrow: 1,
    padding: "24px",
  },
  toolbar: {
    minHeight: "64px",
  },
  details: {
    display: "flex",
  },
  avatar: {
    height: 110,
    width: 100,
    flexShrink: 0,
    flexGrow: 0,
  },
  locationText: {
    paddingLeft: "15px",
  },
  buttonProperty: {
    position: "absolute",
    top: "50%",
  },
  uiProgess: {
    position: "fixed",
    zIndex: "1000",
    height: "31px",
    width: "31px",
    left: "50%",
    top: "35%",
  },
  progess: {
    position: "absolute",
  },
  uploadButton: {
    marginRight: "8px !important",
    margin: "8px",
  },
  customError: {
    color: "red",
    fontSize: "0.8rem",
    marginTop: 10,
  },
  submitButton: {
    marginTop: "10px !important",
  },
  chooseFile: {
    width: "100% !important",
    height: "100% !important",
    padding: "3px 9px",
    paddingLeft: 24,
    margin: 0,
    zIndex: 2,
    cursor: "pointer",
  },
  chooseBtn: {
    padding: "0 !important",
  },
  photoIcon: {
    position: "absolute",
    top: 4,
    left: 4,
    zIndex: 1,
  },
  imgPreview: {
    width: 50,
    height: 50,
    borderRadius: "50%",
    margin: "16px 0 0 32px",
    boxShadow: "0px 0px 5px 0px rgba(0,0,0,0.3)",
    borderColor: "rgba(255,255,255,0.2)",
  },
});

const Account = ({ classes, user, setUser }) => {
  const [imgError, setImgError] = useState(false);
  const [userInfo, setUserInfo] = useState(user);
  const [saveBtnLoading, setSaveBtnLoading] = useState(false);
  const [uploadBtnLoading, setUploadBtnLoading] = useState(false);
  const [file, chooseFile] = useState(null);
  const [tempAvatarUrl, setTempAvatarUrl] = useState("");
  const navigate = useNavigate();

  const handleChange = (event) => {
    setUserInfo({ ...userInfo, [event.target.name]: event.target.value });
  };

  const handleChangeImg = (event) => {
    const avatarFile = event.target.files[0];
    if (avatarFile !== null) {
      if (!avatarFile.type.includes("image/")) {
        setImgError(true);
        setTempAvatarUrl("");
        chooseFile(null);
        return;
      }
      setImgError(false);
      setTempAvatarUrl(URL.createObjectURL(avatarFile));
      chooseFile(avatarFile);
    }
  };

  const handleUploadProfile = (e) => {
    e.preventDefault();
    setUploadBtnLoading(true);
    console.log(file);
    const authToken = localStorage.getItem("auth-token");
    let formData = new FormData();
    formData.append("image", file);
    formData.append("userId", userInfo.id);
    axios.defaults.headers.common = {
      Authorization: `${authToken}`,
    };
    axios
      .post("/user/photo", formData, {
        headers: {
          "content-type": "multipart/form-data",
        },
      })
      .then((res) => {
        setUser((user) => ({ ...user, profilePicture: null }));
        setUploadBtnLoading(false);
        setTempAvatarUrl("");
        chooseFile(null);
        console.log(res.data);
        setTimeout(() => {
          setUser((user) => ({ ...user, profilePicture: res.data.url }));
        }, 100);
      })
      .catch((error) => {
        if (error.response.status === 403) navigate("/login");
        console.log(error);
        setUploadBtnLoading(false);
        setImgError(true);
      });
  };

  const handleChangeInfo = (e) => {
    e.preventDefault();
    setSaveBtnLoading(true);

    const authToken = localStorage.getItem("auth-token");
    axios.defaults.headers.common = {
      Authorization: `${authToken}`,
    };
    axios
      .post(`/user`, userInfo)
      .then((res) => {
        setUser((user) => ({ ...user, ...userInfo }));
        setSaveBtnLoading(false);
      })
      .catch((error) => {
        if (error.response.status === 403) navigate("/login");
        console.log(error);
        setSaveBtnLoading(false);
      });
  };

  useEffect(() => {
    return () => {
      tempAvatarUrl && URL.revokeObjectURL(tempAvatarUrl);
    };
  }, [tempAvatarUrl]);

  return (
    <main className={classes.content}>
      <div className={classes.toolbar} />
      <Card className={`${classes.details} ${classes}`}>
        <CardContent>
          <div className={classes.details}>
            <div>
              <Typography
                className={classes.locationText}
                gutterBottom
                variant="h4"
              >
                {user.firstName} {user.lastName}
              </Typography>
              <Button
                variant="outlined"
                color="primary"
                type="submit"
                size="small"
                disabled={file == null || uploadBtnLoading}
                className={classes.uploadButton}
                onClick={handleUploadProfile}
                startIcon={<CloudUpload />}
              >
                Upload Photo
                {uploadBtnLoading && (
                  <CircularProgress size={24} className={classes.progess} />
                )}
              </Button>
              <Button
                variant="outlined"
                color="primary"
                type="submit"
                size="small"
                className={classes.chooseBtn}
                startIcon={<PermMedia className={classes.photoIcon} />}
              >
                <label htmlFor="photo" className={classes.chooseFile}>
                  Choose Image
                </label>
                <input
                  type="file"
                  id="photo"
                  hidden
                  onChange={handleChangeImg}
                />
              </Button>
              <br />
              {imgError && (
                <div className={classes.customError}>
                  {" "}
                  Wrong Image Format || Supported Format are PNG and JPG
                </div>
              )}
              {tempAvatarUrl && (
                <img
                  src={tempAvatarUrl}
                  alt="avatar"
                  className={classes.imgPreview}
                />
              )}
            </div>
          </div>
          <div className={classes.progress}></div>
        </CardContent>
      </Card>
      <br />
      <Card className={`${classes.root} ${classes}`}>
        <form autoComplete="off" noValidate>
          <Divider />
          <CardContent>
            <Grid container spacing={3}>
              <Grid item md={6} xs={12}>
                <TextField
                  fullWidth
                  label="First name"
                  margin="dense"
                  name="firstName"
                  variant="outlined"
                  value={userInfo.firstName}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item md={6} xs={12}>
                <TextField
                  fullWidth
                  label="Last name"
                  margin="dense"
                  name="lastName"
                  variant="outlined"
                  value={userInfo.lastName}
                  onChange={handleChange}
                />
              </Grid>
              <Grid item md={6} xs={12}>
                <TextField
                  fullWidth
                  label="Email"
                  margin="dense"
                  name="email"
                  variant="outlined"
                  disabled
                  value={userInfo.email}
                />
              </Grid>
              <Grid item md={6} xs={12}>
                <TextField
                  fullWidth
                  label="Username"
                  margin="dense"
                  name="userHandle"
                  disabled
                  variant="outlined"
                  value={userInfo.username}
                />
              </Grid>
              <Grid item md={6} xs={12}>
                <TextField
                  fullWidth
                  label="Country"
                  margin="dense"
                  name="country"
                  variant="outlined"
                  value={userInfo.country}
                  onChange={handleChange}
                />
              </Grid>
            </Grid>
          </CardContent>
          <Divider />
          <CardActions />
        </form>
      </Card>
      <div className={classes.submitButton}>
        <Button
          className={classes.submitButton}
          color="primary"
          variant="contained"
          type="submit"
          onClick={handleChangeInfo}
          disabled={
            !userInfo.firstName ||
            !userInfo.lastName ||
            !userInfo.country ||
            saveBtnLoading
          }
        >
          Save info
          {saveBtnLoading && (
            <CircularProgress size={30} className={classes.progess} />
          )}
        </Button>
      </div>
    </main>
  );
};

export default withStyles(styles)(Account);
