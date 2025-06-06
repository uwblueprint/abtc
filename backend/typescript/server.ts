import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";
import * as firebaseAdmin from "firebase-admin";
import swaggerUi from "swagger-ui-express";
import YAML from "yamljs";
import prisma from "./prisma";

import { mongo } from "./models";
import authRouter from "./rest/authRoutes";
import entityRouter from "./rest/entityRoutes";
import simpleEntityRouter from "./rest/simpleEntityRoutes";
import userRouter from "./rest/userRoutes";
import serviceRequestRouter from "./rest/serviceRequestRoutes";
import notificationRouter from "./rest/notificationRoutes"
import platformSignupRouter from "./rest/signupRequestRoutes";

const CORS_ALLOW_LIST = [
  "http://localhost:3000",
  "https://uw-blueprint-starter-code.firebaseapp.com",
  "https://uw-blueprint-starter-code.web.app",
  /^https:\/\/uw-blueprint-starter-code--pr.*\.web\.app$/,
  "https://frontend-287300418140.us-central1.run.app",
  "https://frontend-287300418140.us-central1.run.app/"
];

const CORS_OPTIONS: cors.CorsOptions = {
  origin: CORS_ALLOW_LIST,
  credentials: true,
};

const swaggerDocument = YAML.load("swagger.yml");

const app = express();
app.use(cookieParser());
app.use(cors(CORS_OPTIONS));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/auth", authRouter);
app.use("/entities", entityRouter);
app.use("/simple-entities", simpleEntityRouter);
app.use("/users", userRouter);
app.use("/platformSignups", platformSignupRouter);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.use("/serviceRequests", serviceRequestRouter);
app.use("/notification", notificationRouter)

mongo.connect();
prisma.$connect();

firebaseAdmin.initializeApp({
  credential: firebaseAdmin.credential.cert({
    projectId: process.env.FIREBASE_PROJECT_ID,
    privateKey: process.env.FIREBASE_SVC_ACCOUNT_PRIVATE_KEY?.replace(
      /\\n/g,
      "\n",
    ),
    clientEmail: process.env.FIREBASE_SVC_ACCOUNT_CLIENT_EMAIL,
  }),
});

app.listen({ port: process.env.PORT || 5000 }, () => {
  /* eslint-disable-next-line no-console */
  console.info(`Server is listening on port ${process.env.PORT || 5000}!`);
});
