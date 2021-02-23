const express = require("express");
const router = express.Router();
const upload = require("../utils/s3");
const cors = require("cors");

const { UserController } = require("../controllers");

const { validateToken } = require("../middlewares");


router.post(
  "/mypage",
  validateToken,
  upload.single("profile_picture"),
  UserController.addMemberInfo
);

module.exports = router;
