import express, { Application, Request, Response, NextFunction } from "express";

const app: Application = express();

const add = (a: number, b: number): number => a + b;

app.get("/", (req: Request, res: Response, next: NextFunction) => {
	res.send(add(5, 5).toString());
});

app.listen(8000, () => console.log("server running"));
