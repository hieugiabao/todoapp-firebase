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

const deleteImage = (imageName) => {
  const bucket = admin.storage().bucket();
  return bucket
    .file(`${imageName}`)
    .delete()
    .then(() => console.log("delete successfully"))
    .catch((err) => console.log(err));
};

exports.uploadProfilePhoto = (request, response) => {
  const BusBoy = require("busboy");
  const path = require("path");
  const os = require("os");
  const fs = require("fs");
  const busboy = BusBoy({ headers: request.headers });
  let imageFileName,
    imageToBeUploaded = {};

  busboy.on("file", (name, stream, info) => {
    const { mimeType, filename: fileName } = info;
    if (mimeType !== "image/png" && mimeType !== "image/jpeg") {
      return response.status(400).json({ error: "Wrong file type submited" });
    }
    const imageExtension = fileName.split(".")[fileName.split(".").length - 1];
    imageFileName = `${request.user.username}.${imageExtension}`;
    console.log(imageFileName);
    const filePath = path.join(os.tmpdir(), imageFileName);
    imageToBeUploaded = { filePath, mimetype: mimeType };
    stream.pipe(fs.createWriteStream(filePath));
  });

  deleteImage(imageFileName);

  busboy.on("finish", () => {
    admin
      .storage()
      .bucket()
      .upload(imageToBeUploaded.filePath, {
        resumable: false,
        metadata: {
          metadata: {
            contentType: imageToBeUploaded.mimetype,
          },
        },
      })
      .then(() => {
        const imageUrl = `https://firebasestorage.googleapis.com/v0/b/${config.storageBucket}/o/${imageFileName}?alt=media`;
        return db.doc(`/users/${request.user.username}`).update({ imageUrl });
      })
      .then(() => {
        return response.json({ message: "Image uploaded successfully" });
      })
      .catch((err) => {
        console.error(err);
        return response.status(500).json({ error: err.code });
      });
  });
  busboy.end(request.rawBody);
};
