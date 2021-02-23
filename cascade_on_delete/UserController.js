require("dotenv").config();
const bcrypt = require("bcryptjs");
const { UserService } = require("../services");
const { errorWrapper, errorGenerator } = require("../errors");


const deleteMember = errorWrapper(async (req, res) => {
  const { id: userId } = req.foundUser;
  const { password: inputPassword } = req.body;

  const foundUser = await UserService.findUser({ id:userId });
  if (!foundUser) 
    errorGenerator({ statusCode: 400, message: "client input invalid" });
  const { password: hashedPassword } = foundUser;
  const isValidPassword = await bcrypt.compare(inputPassword, hashedPassword);
  if (!isValidPassword)
    errorGenerator({ statusCode: 400, message: "client input invalid" });

  const deleteMemberInfo = await UserService.deleteMember({ id: userId });
  res.status(201).json({
    message: "user successfully deleted",
  });
});

module.exports = {
  deleteMember
};