import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import { RegisterRoutes } from "./generated/routes";
import * as swaggerUi from 'swagger-ui-express';

export const app = express();

// Open cros--origin
app.use(cors())

// Use body parser to read sent json payloads
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

app.use(bodyParser.json());

RegisterRoutes(app);

app.use('/', swaggerUi.serve, async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    return res.send(swaggerUi.generateHTML(await import('./generated/swagger.json')));
});

const port = process.env.PORT || 3000;

app.listen(port, () =>
  console.log(`Example app listening at http://localhost:${port}`)
);