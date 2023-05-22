import { FastifyPluginAsync } from 'fastify';
import {HandleClient, HandleInstall} from "./controller";

const routers: FastifyPluginAsync = async (fastify): Promise<void> => {
  fastify.get('/client', HandleClient);
  fastify.get('/client.js', HandleClient);
  fastify.get('/install', HandleInstall);
  fastify.get('/install.js', HandleInstall);
};

export default routers;
