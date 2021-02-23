require("dotenv").config();
const { UserService } = require("../services");
const { errorWrapper, errorGenerator } = require("../errors");

const addMemberInfo = errorWrapper(async (req, res) => {
  const { id: userId } = req.foundUser;
  console.log("file: ", req.file)
  let requestedFields = req.body;

  const userInfo = await UserService.findUserInfo({ id: userId });
  const profile_picture = req.file
    ? req.file.location
    : userInfo.profile_picture
    ? userInfo.profile_picture
    : null;

  requestedFields.profile_picture = profile_picture
  console.log(requestedFields)
  const addInfo = await UserService.updateInfo({
    userId,
    requestedFields,
  });
  res.status(201).json({
    message: "information successfully added",
  });
});

module.exports = {
  addMemberInfo
};
