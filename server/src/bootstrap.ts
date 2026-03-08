import type { Core } from "@strapi/strapi";
import { pluginManager } from "./plugin-manager";
import { runYtMigration } from "./migrations/002-yt-tables";

const PLUGIN_ID = "ai-sdk-yt-embeddings";

const bootstrap = async ({ strapi }: { strapi: Core.Strapi }) => {
  // Register RBAC actions for the plugin
  const actions = [
    {
      section: "plugins",
      displayName: "Read",
      uid: "read",
      pluginName: PLUGIN_ID,
    },
    {
      section: "plugins",
      displayName: "Update",
      uid: "update",
      pluginName: PLUGIN_ID,
    },
    {
      section: "plugins",
      displayName: "Create",
      uid: "create",
      pluginName: PLUGIN_ID,
    },
    {
      section: "plugins",
      displayName: "Delete",
      uid: "delete",
      pluginName: PLUGIN_ID,
    },
    {
      section: "plugins",
      displayName: "Chat",
      uid: "chat",
      pluginName: PLUGIN_ID,
    },
  ];

  await strapi.admin.services.permission.actionProvider.registerMany(actions);

  // Initialize the plugin manager with configuration
  const pluginConfig = strapi.config.get(`plugin::${PLUGIN_ID}`) as {
    openAIApiKey?: string;
    neonConnectionString?: string;
    embeddingModel?: string;
  };

  if (pluginConfig?.openAIApiKey && pluginConfig?.neonConnectionString) {
    try {
      await pluginManager.initialize({
        openAIApiKey: pluginConfig.openAIApiKey,
        neonConnectionString: pluginConfig.neonConnectionString,
        embeddingModel: pluginConfig.embeddingModel as any,
      });

      // Store plugin manager on strapi for tools to access
      (strapi as any).contentEmbeddingsManager = pluginManager;

      // Run YT tables migration
      const pool = pluginManager.getPool();
      if (pool) {
        try {
          await runYtMigration(pool);
          strapi.log.info(`[${PLUGIN_ID}] YouTube vector tables ready`);
        } catch (migrationErr) {
          strapi.log.error(`[${PLUGIN_ID}] YT migration failed:`, migrationErr);
        }
      }

      strapi.log.info(`[${PLUGIN_ID}] Plugin initialized successfully`);
    } catch (error) {
      strapi.log.error(`[${PLUGIN_ID}] Failed to initialize:`, error);
    }
  } else {
    strapi.log.warn(
      `[${PLUGIN_ID}] Missing configuration. Set openAIApiKey and neonConnectionString in plugin config.`
    );
  }

  // Tools are registered via the ai-tools service (see services/ai-tools.ts).
  // The ai-sdk plugin discovers and registers them automatically with namespace prefixing.

  // Register lifecycle hook to auto-embed new YouTube transcripts
  try {
    strapi.db.lifecycles.subscribe({
      models: ['plugin::ai-sdk-yt-transcripts.transcript'],

      async afterCreate({ result }) {
        // Fire and forget — don't block Strapi's response
        strapi.plugin(PLUGIN_ID)
          .service('ytEmbeddings')
          .embedTranscript({
            documentId:              result.documentId,
            id:                      result.id,
            videoId:                 result.videoId,
            title:                   result.title,
            fullTranscript:          result.fullTranscript,
            transcriptWithTimeCodes: result.transcriptWithTimeCodes,
          })
          .catch((err: any) => strapi.log.error('[yt-embed] Pipeline failed:', err));
      },
    });
    strapi.log.info(`[${PLUGIN_ID}] YouTube transcript lifecycle hook registered`);
  } catch (err) {
    strapi.log.warn(`[${PLUGIN_ID}] yt-transcript plugin not found, skipping YT lifecycle hook`);
  }
};

export default bootstrap;
