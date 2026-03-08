export default [
{
  method: 'GET',
  path: '/yt/videos',
  handler: 'controller.ytListVideos',
  config: {
    policies: [
      {
        name: 'admin::hasPermissions',
        config: { actions: ['plugin::ai-sdk-yt-embeddings.read'] }
      },
    ]
  },
},
{
  method: 'GET',
  path: '/yt/videos/:videoId',
  handler: 'controller.ytGetVideo',
  config: {
    policies: [
      {
        name: 'admin::hasPermissions',
        config: { actions: ['plugin::ai-sdk-yt-embeddings.read'] }
      },
    ]
  },
},
{
  method: 'GET',
  path: '/yt/videos/:videoId/chunks',
  handler: 'controller.ytGetVideoChunks',
  config: {
    policies: [
      {
        name: 'admin::hasPermissions',
        config: { actions: ['plugin::ai-sdk-yt-embeddings.read'] }
      },
    ]
  },
},
{
  method: 'GET',
  path: '/yt/status/:documentId',
  handler: 'controller.ytStatus',
  config: {
    policies: [
      {
        name: 'admin::hasPermissions',
        config: { actions: ['plugin::ai-sdk-yt-embeddings.read'] }
      },
    ]
  },
},
{
  method: 'POST',
  path: '/yt/embed',
  handler: 'controller.ytEmbed',
  config: {
    policies: [
      {
        name: 'admin::hasPermissions',
        config: { actions: ['plugin::ai-sdk-yt-embeddings.create'] }
      },
    ]
  },
},
{
  method: 'POST',
  path: '/yt/recompute',
  handler: 'controller.ytRecompute',
  config: {
    policies: [
      {
        name: 'admin::hasPermissions',
        config: { actions: ['plugin::ai-sdk-yt-embeddings.update'] }
      },
    ]
  },
},
{
  method: 'GET',
  path: '/embeddings/embeddings-query',
  handler: 'controller.queryEmbeddings',
  config: {
    policies: [
      {
        name: 'admin::hasPermissions',
        config: { actions: ['plugin::ai-sdk-yt-embeddings.chat'] }
      },
    ]
  },
},
]
