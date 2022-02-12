import express, { Application, Request, Response, NextFunction } from "express";
import * as http from "http";
import * as winston from "winston";
import * as expressWinston from "express-winston";
import cors from "cors";
import debug from "debug";
import { CommonRoutesConfig } from "./common/common.routes.config";
import { UsersRoutes } from "./users/users.routes.config";

const app: Application = express();
const server: http.Server = http.createServer(app);
const port: number = 8000;
const routes: Array<CommonRoutesConfig> = [];
const debugLog: debug.IDebugger = debug("app");

const loggerOptions: expressWinston.LoggerOptions = {
	transports: [new winston.transports.Console()],
	format: winston.format.combine(
		winston.format.json(), 
		winston.format.prettyPrint(), 
		winston.format.colorize({ all: true })
	),
};


app.use(express.json());
app.use(cors());
app.use(expressWinston.logger(loggerOptions));

routes.push(new UsersRoutes(app));

const runningMessage = `Server running at http://localhost:${port}`;
app.get("/", (req: Request, res: Response) => {
	res.status(200).send(runningMessage)
})

server.listen(port, () => {
	routes.forEach((route: CommonRoutesConfig) => {
		debugLog(`Routes configured for ${route.getName()}`)
	})
	console.log(runningMessage)
});