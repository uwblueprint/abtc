import { Router } from "express";
import fs from "fs";
import multer from "multer";
import { isAuthorizedByRole } from "../middlewares/auth";
import { entityRequestDtoValidator } from "../middlewares/validators/entityValidators";
import EntityService from "../services/implementations/entityService";
import FileStorageService from "../services/implementations/fileStorageService";
import IFileStorageService from "../services/interfaces/fileStorageService";
import {
  EntityResponseDTO,
  IEntityService,
} from "../services/interfaces/IEntityService";
import { getErrorMessage } from "../utilities/errorUtils";
import { sendResponseByMimeType } from "../utilities/responseUtil";

const upload = multer({ dest: "uploads/" });

const entityRouter: Router = Router();
entityRouter.use(isAuthorizedByRole(new Set(["VOLUNTEER", "ADMIN"])));

// Firebase Storage Bucket
const defaultBucket = process.env.FIREBASE_STORAGE_DEFAULT_BUCKET || "";
const fileStorageService: IFileStorageService = new FileStorageService(defaultBucket);
const entityService: IEntityService = new EntityService(fileStorageService);

/* Create entity */
entityRouter.post(
  "/",
  isAuthorizedByRole(new Set(["ADMIN", "VOLUNTEER"])),
  upload.single("file"),
  entityRequestDtoValidator,
  async (req, res) => {
    try {
      const body = JSON.parse(req.body.body);
      const newEntity = await entityService.createEntity({
        stringField: body.stringField,
        intField: body.intField,
        enumField: body.enumField,
        stringArrayField: body.stringArrayField,
        boolField: body.boolField,
        filePath: req.file?.path,
        fileContentType: req.file?.mimetype,
      });
      if (req.file?.path) {
        fs.unlinkSync(req.file.path);
      }
      res.status(201).json(newEntity);
    } catch (e: unknown) {
      res.status(500).send(getErrorMessage(e));
    }
  }
);

/* Get all entities */
entityRouter.get("/", isAuthorizedByRole(new Set(["ADMIN", "VOLUNTEER"])), async (req, res) => {
  const contentType = req.headers["content-type"];
  try {
    const entities = await entityService.getEntities();
    await sendResponseByMimeType<EntityResponseDTO>(
      res,
      200,
      contentType,
      entities
    );
  } catch (e: unknown) {
    await sendResponseByMimeType(res, 500, contentType, [
      {
        error: getErrorMessage(e),
      },
    ]);
  }
});

/* Get entity by id */
entityRouter.get("/:id", isAuthorizedByRole(new Set(["ADMIN", "VOLUNTEER"])), async (req, res) => {
  const { id } = req.params;

  try {
    const entity = await entityService.getEntity(id);
    res.status(200).json(entity);
  } catch (e: unknown) {
    res.status(500).send(getErrorMessage(e));
  }
});

/* Update entity by id */
entityRouter.put(
  "/:id",
  isAuthorizedByRole(new Set(["ADMIN", "VOLUNTEER"])),
  upload.single("file"),
  entityRequestDtoValidator,
  async (req, res) => {
    const { id } = req.params;
    try {
      const body = JSON.parse(req.body.body);
      const entity = await entityService.updateEntity(id, {
        stringField: body.stringField,
        intField: body.intField,
        enumField: body.enumField,
        stringArrayField: body.stringArrayField,
        boolField: body.boolField,
        filePath: req.file?.path,
        fileContentType: req.file?.mimetype,
      });
      if (req.file?.path) {
        fs.unlinkSync(req.file.path);
      }
      res.status(200).json(entity);
    } catch (e: unknown) {
      res.status(500).send(getErrorMessage(e));
    }
  }
);

/* Delete entity by id */
entityRouter.delete("/:id", isAuthorizedByRole(new Set(["ADMIN", "VOLUNTEER"])), async (req, res) => {
  const { id } = req.params;

  try {
    const deletedId = await entityService.deleteEntity(id);
    res.status(200).json({ id: deletedId });
  } catch (e: unknown) {
    res.status(500).send(getErrorMessage(e));
  }
});

/* Get file associated with entity by fileUUID */
entityRouter.get("/files/:fileUUID", isAuthorizedByRole(new Set(["ADMIN", "VOLUNTEER"])), async (req, res) => {
  const { fileUUID } = req.params;

  try {
    const fileURL = await fileStorageService.getFile(fileUUID);
    res.status(200).json({ fileURL });
  } catch (e: unknown) {
    res.status(500).send(getErrorMessage(e));
  }
});

export default entityRouter;
