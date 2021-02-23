const express = require("express");
const router = express.Router();
const upload = require("../utils/s3");
const { ProjectController } = require("../controllers");
const { validateToken } = require("../middlewares");

router.post(
  "/allinfo/save",
  validateToken,
  upload.single("project_images"),
  ProjectController.SaveProjectInfo
);

router.put(
  "/allinfo/save/:projectId",
  validateToken,
  upload.single("project_images"),
  ProjectController.SaveProjectInfo
);

module.exports = router;