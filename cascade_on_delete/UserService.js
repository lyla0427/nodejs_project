const prisma = require("../prisma");

const deleteMember = async (field) => {
  const [uniqueKey] = Object.keys(field);
  const isKeyId = uniqueKey === "id";
  const value = isKeyId ? Number(field[uniqueKey]) : field[uniqueKey];
  console.log(field, value, uniqueKey)
  await prisma.questions.deleteMany({    
    where: {
      user_id: value,
    },
  })
  await prisma.startup_likes.deleteMany({    
    where: {
      user_id: value,
    },
  })
  await prisma.user_agreements.deleteMany({    
    where: {
      user_id: value,
    },
  })
  await prisma.votes.deleteMany({    
    where: {
      user_id: value,
    },
  })
  await prisma.partner_likes.deleteMany({    
    where: {
      user_id: value,
    },
  })
  await prisma.project_likes.deleteMany({    
    where: {
      user_id: value,
    },
  })

  await prisma.users.delete({
    where: {
      [uniqueKey]: value,
    },
  });
};

module.exports = {
  deleteMember
};