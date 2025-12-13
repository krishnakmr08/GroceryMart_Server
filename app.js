import "dotenv/config";
import Fastify from "fastify";
import connectDB from "./src/config/connect.js";
import { PORT } from "./src/config/config.js";

const fastify = Fastify();

const start = async () => {
  await connectDB(process.env.MONGO_URI);
  fastify.listen({ port: PORT, host: "0.0.0.0" }, (err, address) => {
    if (err) {
      console.log(err);
    } else {
      console.log(`Server is running on ${address}`);
    }
  });
};

start();
