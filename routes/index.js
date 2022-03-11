const express = require("express");
const router = express.Router();

const {
  register,
  login,
  authme,
  lupaPassword,
  resetPassword,
  googleAccountRegister,
  googleAccountLogin,
} = require("../controller/AuthController");
const paginationMiddleware = require("../middleware/paginationMiddleware");
const {
  index,
  detail,
  detailByEmail,
  destroy,
  update,
  createMany,
  userRoles,
  roleUser,
} = require("../controller/UserController");
const validationMiddleware = require("../middleware/ValidationMiddleware");
const { registerValidator} = require("../validator/AuthValidator");
const { userList } = require("../controller/UserRawQueryController");
const jwtMiddleware = require("../middleware/jwtMiddleware");

router.get("/", (req, res) => {
  res.json({
    status: "Ok",
  });
});
// REGISTER //
router.post("/register", register);
// LOGIN //
router.post("/login", login);
//CREATE//
router.post("/users/create", createMany);

// router.use(jwtMiddleware)
router.use(paginationMiddleware);
// GET USER ALL //
router.get("/users", index);
// AUTHME //
router.get("/authme", authme);
// GET USER DETAIL //
router.get("/users/:id", detail);
//GET USER EMAIL//
router.get("/users/email/:email", detailByEmail);
//DELETE//
router.delete("/users/:id", destroy);
// UPDATE //
router.put("/users/update/:id", update);
//USER ROLE//
router.get("/users/role/user-role", userRoles);
//ROLE USER//
router.get("/users/user/user-role", roleUser);
//RAW QUERY//
router.get("/users/query/list", userList);
//FORGET PASSWORD//
router.post("/lupa-password", lupaPassword);
//RESET PASSWORD//
router.post("/reset-password/:userId/:token", resetPassword);



module.exports = {router};
