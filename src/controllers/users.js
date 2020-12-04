const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const User = require("../models/users");

module.exports = {
  index: (req, res) => {
    mongoose.connect(
      process.env.MONGO_LOCAL_CONN_URL,
      { useNewUrlParser: true },
      async (err) => {
        if (!err) {
          const users = await User.find({});
          res.status(200).send(users);
        } else {
          res.status(500).send(err);
        }
      }
    );
  },

  show: (req, res) => {
    mongoose.connect(
      process.env.MONGO_LOCAL_CONN_URL,
      { useNewUrlParser: true },
      async (err) => {
        if (!err) {
          const user = await User.findOne({ _id: req.params.id });
          if (user.active) {
            res.status(200).send(user);
          } else {
            res.status(500).send({ error: "User is inactive." });
          }
        } else {
          res.status(500).send(err);
        }
      }
    );
  },

  create: (req, res) => {
    mongoose.connect(
      process.env.MONGO_LOCAL_CONN_URL,
      { useNewUrlParser: true },
      (err) => {
        if (!err) {
          const { username, password } = req.body;
          const user = new User({ username, password });
          user.save((err, user) => {
            if (!err) {
              res.status(201).send({ id: user._id });
            } else {
              res.status(500).send(err);
            }
          });
        } else {
          res.status(500).send(err);
        }
      }
    );
  },

  update: (req, res) => {
    mongoose.connect(
      process.env.MONGO_LOCAL_CONN_URL,
      { useNewUrlParser: true },
      async (err) => {
        if (!err) {
          User.findOneAndUpdate(
            { _id: req.params.id },
            req.body,
            { new: true },
            (err, user) => {
              if (err) {
                res.status(500).send(err);
              } else {
                res.status(200).send(user);
              }
            }
          );
        } else {
          res.status(500).send(err);
        }
      }
    );
  },

  delete: (req, res) => {
    mongoose.connect(
      process.env.MONGO_LOCAL_CONN_URL,
      { useNewUrlParser: true },
      async (err) => {
        if (!err) {
          User.findOneAndDelete({ _id: req.params.id }, (err, user) => {
            if (err) {
              res.status(500).send(err);
            } else {
              res.status(200).send(user);
            }
          });
        } else {
          res.status(500).send(err);
        }
      }
    );
  },

  activate: (req, res) => {
    mongoose.connect(
      process.env.MONGO_LOCAL_CONN_URL,
      { useNewUrlParser: true },
      async (err) => {
        if (!err) {
          User.findOneAndUpdate(
            { _id: req.params.id },
            { active: true },
            { new: true },
            (err, user) => {
              if (err) {
                res.status(500).send(err);
              } else {
                res.status(200).send(user);
              }
            }
          );
        } else {
          res.status(500).send(err);
        }
      }
    );
  },

  login: (req, res) => {
    const { username, password } = req.body;

    mongoose.connect(
      process.env.MONGO_LOCAL_CONN_URL,
      { useNewUrlParser: true },
      (err) => {
        if (!err) {
          User.findOne({ username }, (err, user) => {
            if (!err && user) {
              bcrypt
                .compare(password, user.password)
                .then((match) => {
                  if (match) {
                    const payload = { user: user.username };
                    const secret = process.env.JWT_SECRET;
                    const token = jwt.sign(payload, secret);
                    res.status(200).send({ user, token });
                  } else {
                    res.status(401).send({ error: "Authentication failed1." });
                  }
                })
                .catch((err) => {
                  res.status(500).send(err);
                });
            } else {
              res.status(401).send({ error: "Authentication failed2." });
            }
          });
        } else {
          res.status(500).send(err);
        }
      }
    );
  },
};
