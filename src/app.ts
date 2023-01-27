import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import { RegisterRoutes } from "./generated/routes";
import * as swaggerUi from 'swagger-ui-express';
import dotenv from 'dotenv';
import { JobFlagHeader } from "./services/jobs.service";

// Load variables from .env file
dotenv.config();

export const app = express();

// Open cross--origin access and allow JS in browser to read job flag header
app.use(cors({ origin: true, exposedHeaders: JobFlagHeader }));

// Use body parser to read sent json payloads
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);
app.use(bodyParser.json());

// Register TSOA generated API routes
RegisterRoutes(app);

// Server Swagger UI
app.use('/', swaggerUi.serve, async (req: express.Request, res: express.Response, next: express.NextFunction) => {
  return res.send(swaggerUi.generateHTML(await import('./generated/swagger.json')));
});

// Use passed PROT or as default 8080
const port = process.env.PORT || 8080;

// Start listening to requests
app.listen(port, () =>
  console.log(`Example app listening at http://localhost:${port}`)
);