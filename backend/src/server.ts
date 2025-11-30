import express from "express";
import webRoutes from "./routes/web.route";
import authRoutes from "./routes/auth.route";
import mobileRoutes from "./routes/mobile.route";
import { gatewayMiddleware } from "./middlewares/apiGateway";
import bankRoutes from "./routes/bank.route";
import swaggerUi from "swagger-ui-express";
import { swaggerSpec } from "./config/swagger";

const PORT = process.env.PORT || 8000;

const app = express();

app.use(express.json());

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use("/api/v1", gatewayMiddleware);

app.use("/api/v1/auth", authRoutes);

app.use("/api/v1/web", webRoutes);
app.use("/api/v1/bank", bankRoutes);
app.use("/api/v1/mobile", mobileRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

export default app;
