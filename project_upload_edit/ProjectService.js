const findOneProject = async (field) => {
  const [uniqueKey] = Object.keys(field);
  const isKeyId = uniqueKey === "id";
  const value = isKeyId ? Number(field[uniqueKey]) : field[uniqueKey];
  console.log(field);
  const projects = await prisma.projects.findUnique({
    where: {
      [uniqueKey]: value,
    },
  });
  const cleanedProject = await prisma.projects.update({
    include: {
      project_images: {
        select: {
          img_url: true,
        },
      },
      eligible_sectors: {
        select: {
          name: true,
        },
      },
      eligibilities: {
        select: {
          name: true,
        },
      },
      required_documents: {
        include: {
          document_types: {
            select: {
            name: true
          }
        }
        }
      }
    },
    where: {
      [uniqueKey]: value,
    },
    data: {
      hit: projects.hit + 1,
    },
  });

  cleanedProject.tag = [];
  cleanedProject.tag.push(cleanedProject.eligible_sectors["name"]);
  cleanedProject.tag.push(cleanedProject.eligibilities["name"]);
  cleanedProject.tag.push(await calcDue(cleanedProject.due_date));

  return cleanedProject;
};

const getRelatedInfoId = async (table, name) => {
  const data = await prisma[table].findFirst({
    where: { name },
  });
  return data.id;
};


const resetChoices = async (field) => {
  const { projectDetail } = field;
  return await prisma.required_documents.deleteMany({
    where: {
      projects: {
        id: Number(projectDetail.id),
      },
    },
  });
};

const createRelatedDoc = async (requiredDocId, projectAction) => {
  return await prisma.required_documents.create({
    data: {
      document_types: { connect: { id: Number(requiredDocId) } },
      projects: { connect: { id: Number(projectAction.id) } },
    },
  });
};

const createProject = async (field) => {
  const { userInfofromToken } = field;
  return await prisma.projects.create({
    data: {
      companies: userInfofromToken
        ? { connect: { id: userInfofromToken.company_id } }
        : undefined,
      is_opened: false,
      is_saved: false,
      request_open: false,
      hit: 0,
    },
  });
};

const updateProject = async (fields) => {
  const {
    projectId,
    name,
    introduction,
    host,
    due_date,
    eligible_sectors,
    eligibilities,
    outline,
    detail,
    application_method,
    caution,
    contact,
    application_url,
    project_images,
  } = fields;

  return await prisma.projects.update({
    where: {
      id: Number(projectId),
    },
    data: {
      name,
      introduction,
      host,
      due_date,
      eligible_sectors: eligible_sectors? { connect: { id: eligible_sectors } }: undefined,      
      eligibilities: eligibilities? { connect: { id: eligibilities } }: undefined,
      outline,
      detail,
      application_method,
      caution,
      contact,
      application_url,
      project_images: project_images? { create: [{ img_url: project_images }] }: undefined,
      is_saved: true,
    },
  });
};

module.exports = {
  findOneProject,
  resetChoices,
  createRelatedDoc,
  createProject,
  updateProject,

};

