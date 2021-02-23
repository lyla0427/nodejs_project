 const prisma = require("../prisma");

const updateInfo = async (fields) => {
  const { userId, requestedFields } = fields;
  return prisma.users.update({
    where: {
      id: Number(userId),
    },
    data: {
      ...requestedFields,
    },
  });
};

module.exports = {
  updateInfo,
};
