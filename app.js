import "dotenv/config";
import Fastify from "fastify";
import connectDB from "./src/config/connect.js";
import { PORT } from "./src/config/config.js";
import fastifySocketIO from "fastify-socket.io";
import { registerRoutes } from "./src/routes/index.js";

const fastify = Fastify({ logger: true });

const start = async () => {
  try {
    await connectDB(process.env.MONGO_URI);


    fastify.register(fastifySocketIO, {
      cors: {
        origin: "*",
      },
      pingInterval: 10000,
      pingTimeout: 5000,
      transports: ["websocket"],
    });

    await registerRoutes(fastify);

    fastify.ready().then(() => {
      fastify.io.on("connection", (socket) => {
        fastify.log.info("User connected:");

        socket.on("joinRoom", (orderId) => {
          socket.join(orderId);
          fastify.log.info("User joined");
        });

        socket.on("disconnect", () => {
          fastify.log.info("User disconnected");
        });
      });
    });

    fastify.listen({ port: PORT, host: "0.0.0.0" }, (err, address) => {
      if (err) {
        fastify.log.error(err);
      } else {
        console.log(`Server is running on ${address}`);
      }
    });
  } catch (error) {
    fastify.log.error(error);
    process.exit(1);
  }
};

start();
