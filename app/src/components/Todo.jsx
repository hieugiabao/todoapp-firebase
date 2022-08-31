import React from "react";

import axios from "axios";
import dayjs from "dayjs";
import {
  AppBar,
  Button,
  Card,
  CardActions,
  CardContent,
  CircularProgress,
  Dialog,
  DialogContent,
  DialogTitle,
  Grid,
  IconButton,
  Slide,
  TextField,
  Toolbar,
  Typography,
} from "@mui/material";
import { withStyles } from "@mui/styles";
import { AddCircle, Close } from "@mui/icons-material";
import { useAuth } from "../hooks/useAuth";

const styles = (theme) => ({
  content: {
    flexGrow: 1,
    padding: theme.spacing(3),
  },
  appBar: {
    position: "relative",
  },
  title: {
    marginLeft: theme.spacing(2),
    flex: 1,
  },
  submitButton: {
    display: "block !important",
    color: "white !important",
    textAlign: "center !important",
    position: "absolute !important",
    top: 14,
    right: 10,
  },
  floatingButton: {
    position: "fixed !important",
    bottom: 0,
    right: 0,
  },
  form: {
    width: "98%",
    marginLeft: 13,
    marginTop: theme.spacing(10),
  },
  toolbar: theme.mixins.toolbar,
  root: {
    minWidth: 470,
  },
  bullet: {
    display: "inline-block",
    margin: "0 2px",
    transform: "scale(0.8)",
  },
  pos: {
    marginBottom: 12,
  },
  uiProgess: {
    position: "fixed",
    zIndex: "1000",
    height: "31px",
    width: "31px",
    left: "50%",
    top: "35%",
  },
  dialogeStyle: {
    maxWidth: "50%",
  },
  viewRoot: {
    margin: 0,
    padding: theme.spacing(2),
  },
  closeButton: {
    position: "absolute",
    right: theme.spacing(1),
    top: theme.spacing(1),
    color: theme.palette.grey[500],
  },
});

const Transition = React.forwardRef((props, ref) => (
  <Slide direction="up" ref={ref} {...props} />
));

const Todo = ({ classes }) => {
  useAuth();
  const authToken = localStorage.getItem("auth-token");
  axios.defaults.headers.common = {
    Authorization: authToken,
  };

  const initData = {
    title: "",
    body: "",
    todoId: "",
  };

  const [todos, setTodos] = React.useState([]);
  const [todoData, setTodoData] = React.useState(initData);
  const [btnType, setBtnType] = React.useState("");
  const [loading, setLoading] = React.useState(true);
  const [isCreateDialogOpened, setIsCreateDialogOpened] = React.useState(false);
  const [isViewDialogOpened, setIsViewDialogOpened] = React.useState(false);
  const [errors, setErrors] = React.useState();

  const handleTextChange = (e) => {
    setTodoData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    let options = {};

    if (btnType === "Edit") {
      options = {
        url: `/todo/${todoData.todoId}`,
        method: "put",
        data: todoData,
      };
    } else {
      options = {
        url: "/todo",
        method: "post",
        data: todoData,
      };
    }

    axios(options)
      .then(() => {
        handleCloseDialog();
        setTodos([]);
      })
      .catch((err) => {
        handleCloseDialog();
        setErrors(err.response.data);
        console.log(err);
      });
  };

  const handleDeleteTodo = (data) => {
    axios
      .delete(`todo/${data.todoId}`)
      .then(() => {
        setTodos([]);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleCloseDialog = () => {
    setIsCreateDialogOpened(false);
    setIsViewDialogOpened(false);
    setTodoData(initData);
    setBtnType("");
  };

  React.useEffect(() => {
    axios
      .get("/todos")
      .then((res) => {
        setTodos(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [todos]);

  if (loading)
    return (
      <main className={classes.content}>
        <div className={classes.toolbar} />
        <CircularProgress size={100} className={classes.uiProgess} />
      </main>
    );
  return (
    <main className={classes.content}>
      <div className={classes.toolbar} />

      <IconButton
        className={classes.floatingButton}
        color="primary"
        aria-label="Add Todo"
        onClick={() => setIsCreateDialogOpened(true)}
      >
        <AddCircle style={{ fontSize: 60 }} />
      </IconButton>
      <Dialog
        fullScreen
        TransitionComponent={Transition}
        open={isCreateDialogOpened}
        onClose={handleCloseDialog}
      >
        <AppBar className={classes.appBar}>
          <Toolbar>
            <IconButton
              edge="start"
              color="inherit"
              aria-label="Close"
              onClick={handleCloseDialog}
            >
              <Close />
            </IconButton>
            <Typography variant="h6" className={classes.title}>
              {btnType === "Edit" ? "Edit Todo" : "Create a new Todo"}
            </Typography>
            <Button
              autoFocus
              color="inherit"
              className={classes.submitButton}
              onClick={handleSubmit}
            >
              {btnType === "Edit" ? "Save" : "Submit"}
            </Button>
          </Toolbar>
        </AppBar>

        <form className={classes.form} noValidate>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                variant="outlined"
                required
                fullWidth
                id="todoTitle"
                label="Todo Title"
                name="title"
                autoComplete="todoTitle"
                helperText={errors?.title}
                value={todoData.title}
                error={errors?.title ? true : false}
                onChange={handleTextChange}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                variant="outlined"
                required
                fullWidth
                id="todoDetails"
                label="Todo Details"
                name="body"
                autoComplete="todoDetails"
                multiline
                rows={23}
                rowsMax={25}
                helperText={errors?.body}
                error={errors?.body ? true : false}
                onChange={handleTextChange}
                value={todoData.body}
              />
            </Grid>
          </Grid>
        </form>
      </Dialog>

      <Grid container spacing={2}>
        {todos?.map((todo) => (
          <Grid item xs={12} sm={6} key={todo.todoId}>
            <Card className={classes.root} variant="outlined">
              <CardContent>
                <Typography variant="h5" component="h2">
                  {todo.title}
                </Typography>
                <Typography className={classes.pos} color="textSecondary">
                  {dayjs(todo.createdAt._seconds).format("DD/MM/YYYY h:mm A")}
                </Typography>
                <Typography variant="body2" component="p">
                  {`${todo.body.substring(0, 60)}`}
                </Typography>
              </CardContent>
              <CardActions>
                <Button
                  size="small"
                  color="primary"
                  onClick={() => {
                    setTodoData(todo);
                    setIsViewDialogOpened(true);
                  }}
                >
                  {" "}
                  View{" "}
                </Button>
                <Button
                  size="small"
                  color="primary"
                  onClick={() => {
                    setTodoData(todo);
                    setIsCreateDialogOpened(true);
                    setBtnType("Edit");
                  }}
                >
                  Edit
                </Button>
                <Button
                  size="small"
                  color="primary"
                  onClick={() => handleDeleteTodo(todo)}
                >
                  Delete
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Dialog
        onClose={handleCloseDialog}
        aria-labelledby="customized-dialog-title"
        open={isViewDialogOpened}
        fullWidth
        classes={{ paperFullWidth: classes.dialogeStyle }}
      >
        <DialogTitle
          disableTypography
          id="customized-dialog-title"
          className={classes.root}
        >
          <Typography variant="h6">{todoData.title}</Typography>
          <IconButton
            aria-label="close"
            className={classes.closeButton}
            onClick={handleCloseDialog}
          >
            <Close />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers>
          <TextField
            fullWidth
            id="todoDetails"
            name="body"
            multiline
            readonly
            rows={1}
            rowsMax={23}
            value={todoData.body}
            InputProps={{
              disableUnderline: true,
            }}
          />
        </DialogContent>
      </Dialog>
    </main>
  );
};

export default withStyles(styles)(Todo);
