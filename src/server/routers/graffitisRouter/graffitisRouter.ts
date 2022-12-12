import express from "express";
import {
  createGraffiti,
  deleteGraffiti,
  getAllGraffitis,
  getGraffitiById,
} from "../../controllers/graffitis/graffitisController.js";

// eslint-disable-next-line new-cap
const graffitisRouter = express.Router();

graffitisRouter.get("/list", getAllGraffitis);
graffitisRouter.delete("/delete/:idGraffiti", deleteGraffiti);
graffitisRouter.post("/create", createGraffiti);
graffitisRouter.get("/detail/:idGraffiti", getGraffitiById);

export default graffitisRouter;
