require("dotenv").config();
const { dateForm } = require("../utils");
const {
  ProjectService,
} = require("../services");
const { errorWrapper, errorGenerator } = require("../errors");

const SaveProjectInfo = errorWrapper(async (req, res, next) => {
  const userInfofromToken = req.foundUser;
  const requestedFields = req.body;
  const projectDetail = req.params.projectId
    ? await ProjectService.findOneProject({ id: req.params.projectId })
    : await ProjectService.createProject({ userInfofromToken });

  if (!projectDetail)
    errorGenerator({ statusCode: 404, message: "project not found" });
  const { company: companyIdfromProject } = projectDetail;
  if (userInfofromToken.company_id !== companyIdfromProject)
    errorGenerator({ statusCode: 403, message: "unauthorized" });

  const name = requestedFields.name ? requestedFields.name : null;
  const introduction = requestedFields.introduction
    ? requestedFields.introduction
    : null;
  const host = requestedFields.host ? requestedFields.host : null;
  const due_date = await dateForm(requestedFields.due_date);
  const eligible_sectors = requestedFields.eligible_sectors
    ? await ProjectService.getRelatedInfoId(
        "eligible_sectors",
        requestedFields.eligible_sectors
      )
    : undefined;
  const eligibilities = requestedFields.eligibilities
    ? await ProjectService.getRelatedInfoId(
        "eligibilities",
        requestedFields.eligibilities
      )
    : undefined;
  const outline = requestedFields.outline ? requestedFields.outline : null;
  const detail = requestedFields.detail ? requestedFields.detail : null;
  const application_method = requestedFields.application_method
    ? requestedFields.application_method
    : null;
  const caution = requestedFields.caution ? requestedFields.caution : null;
  const contact = requestedFields.contact ? requestedFields.contact : null;
  const application_url = requestedFields.application_url
    ? requestedFields.application_url
    : null;
  const project_images = req.file
    ? req.file.location
    : projectDetail.project_images
    ? projectDetail.project_images.img_url
    : null;

  const projectAction = await ProjectService.updateProject({
    projectId: projectDetail.id,
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
  });

  await ProjectService.resetChoices({ projectDetail });
  const required_documents = requestedFields.required_documents
    ? requestedFields.required_documents
    : null;
  if (required_documents) {
    for (len = 0; len < required_documents.length; len++) {
      let requiredDocId = await ProjectService.getRelatedInfoId(
        "document_types",
        required_documents[len]
      );
      await ProjectService.createRelatedDoc(requiredDocId, projectAction);
    }
  } else {
  }

  res.status(201).json({
    message: "project info saved",
    ProjectId: projectAction.id,
  });
});

module.exports = {
  SaveProjectInfo,
};
