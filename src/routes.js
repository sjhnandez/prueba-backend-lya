const { use } = require("bcrypt/promises");
const usersController = require("./controllers/users");

module.exports = (router) => {
  router.route("/users").get(usersController.index);
  router.route("/users").post(usersController.create);
  router.route("/users/:id").get(usersController.show);
  router.route("/users/:id").put(usersController.update);
  router.route("/users/:id").delete(usersController.delete);
  router.route('/users/:id/active').patch(usersController.activate);
  router.route("/authorization").post(usersController.login);
  return router;
};
