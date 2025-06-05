import Fastify from "fastify";
import cors from "@fastify/cors";

import { clientRoutes } from "./routes/client";
import { assetsRoutes } from "./routes/asset";

const app = Fastify();

async function startServer() {
    await app.register(cors, {
        origin: "http://localhost:3000",
        methods: ["GET", "POST", "PUT", "DELETE"],
        allowedHeaders: ["Content-Type", "Authorization"],
    });

    app.register(clientRoutes);
    app.register(assetsRoutes);

    app.listen({ port: 3333 }, () => {
        console.log("🚀 Server listening on http://localhost:3333");
    });
}

startServer();
