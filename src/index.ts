import environtment from "./loadEnvironments.js";
import chalk from "chalk";
import debugCreator from "debug";
import connectDb from "./database/index.js";
import startServer from "./server/index.js";
import app from "./server/app.js";

const { mongoDbUrl, port } = environtment;

const debug = debugCreator("bcn-walls:root");

const defaultPort = 4070;

const selectedPort = port ?? defaultPort;

try {
  await startServer(app, Number(port));
  debug(chalk.green(`Server listening on http://localhost:${selectedPort}`));
  await connectDb(mongoDbUrl);
  debug(chalk.blue("Connected to Database"));
} catch (error: unknown) {
  debug(chalk.red("Error starting the API: ", (error as Error).message));
}
