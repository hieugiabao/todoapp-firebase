const { admin, db } = require("../util/admin");
const config = require("../util/config");

const firebase = require("firebase/app");
const auth = require("firebase/auth");

const app = firebase.initializeApp(config);

const { validateLoginData, validateSignupData } = require("../util/validators");

exports.loginUser = (request, response) => {
  const user = {
    email: request.body.email,
    password: request.body.password,
  };

  const { valid, errors } = validateLoginData(user);
  if (!valid) return response.status(400).json({ errors });

  auth
    .signInWithEmailAndPassword(auth.getAuth(), user.email, user.password)
    .then((data) => data.user.getIdToken())
    .then((token) => response.json({ token }))
    .catch((err) => {
      console.error(err);
      return response
        .status(403)
        .json({ message: "login fail, please try again" });
    });
};

exports.signUpUser = (request, response) => {
  const newUser = {
    firstName: request.body.firstName,
    lastName: request.body.lastName,
    email: request.body.email,
    country: request.body.country,
    password: request.body.password,
    confirmPassword: request.body.confirmPassword,
    username: request.body.username,
  };

  const { valid, errors } = validateSignupData(newUser);

  if (!valid) return response.status(400).json(errors);

  let token, userId;
  db.doc(`/users/${newUser.username}`)
    .get()
    .then((doc) => {
      if (doc.exists)
        return response
          .status(400)
          .json({ username: "this username is already taken" });
      else {
        return auth.createUserWithEmailAndPassword(
          auth.getAuth(),
          newUser.email,
          newUser.password
        );
      }
    })
    .then((data) => {
      userId = data.user.uid;
      return data.user.getIdToken();
    })
    .then((idToken) => {
      token = idToken;
      const userCredentials = {
        firstName: newUser.firstName,
        lastName: newUser.lastName,
        username: newUser.username,
        country: newUser.country,
        email: newUser.email,
        createdAt: new Date().toISOString(),
        userId,
      };
      return db.doc(`/users/${newUser.username}`).set(userCredentials);
    })
    .then(() => {
      return response.status(201).json({ token });
    })
    .catch((err) => {
      console.error(err);
      if (err.code === "auth/email-already-in-use")
        return response
          .status(400)
          .json({ email: "this email is already taken" });
      else
        return response.status(500).json({
          error: err.code,
          general: "Something went wrong, please try again",
        });
    });
};
