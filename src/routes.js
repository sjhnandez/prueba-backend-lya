const usersController = require("./controllers/users");

module.exports = (router) => {
  router.route("/users").post(usersController.add);
  return router;
};
