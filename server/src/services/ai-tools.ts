import type { Core } from '@strapi/strapi';
import { tools } from '../tools';

export default ({ strapi }: { strapi: Core.Strapi }) => ({
  getTools() {
    return tools;
  },

  getMeta() {
    return {
      label: 'YouTube Knowledge Search',
      description: 'Semantic search across YouTube video transcripts with timestamps and deep links',
      keywords: ['/youtube', '/yt', 'video knowledge', 'semantic search'],
    };
  },
});
