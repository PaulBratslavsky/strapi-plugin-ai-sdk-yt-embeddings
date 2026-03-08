import type { Core } from "@strapi/strapi";
import { pluginManager } from "./plugin-manager";

const destroy = async ({ strapi }: { strapi: Core.Strapi }) => {
  // Clean up the plugin manager (close DB connections)
  await pluginManager.destroy();
  console.log("[ai-sdk-yt-embeddings] Plugin destroyed");
};

export default destroy;
