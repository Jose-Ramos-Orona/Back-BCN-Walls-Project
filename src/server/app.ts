import express from "express";
import morgan from "morgan";
import cors from "cors";
import environtment from "../loadEnvironments.js";
import { endpointNotFound, generalError } from "./middlewares/error.js";
import usersRouter from "./routers/usersRouter/usersRouter.js";
import graffitisRouter from "./routers/graffitisRouter/graffitisRouter.js";

const { corsAllowedDomain } = environtment;

const app = express();
app.disable("x-powered-by");
const allowedOrigins = [corsAllowedDomain];

const options: cors.CorsOptions = {
  origin: allowedOrigins,
};

app.use(cors(options));
app.use(express.json());
app.use(morgan("dev"));

app.use("/users", usersRouter);

app.use("/graffitis", graffitisRouter);

app.use(endpointNotFound);
app.use(generalError);

export default app;
