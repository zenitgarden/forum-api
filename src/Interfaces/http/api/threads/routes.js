const routes = (handler) => ([
  {
    method: 'POST',
    path: '/threads',
    handler: (request, h) => handler.postThreadHandler(request, h),
    options: {
      auth: 'forum_jwt',
    },
  },
  {
    method: 'POST',
    path: '/threads/{threadId}/comments',
    handler: (request, h) => handler.postThreadAddCommentHandler(request, h),
    options: {
      auth: 'forum_jwt',
    },
  },
  {
    method: 'DELETE',
    path: '/threads/{threadId}/comments/{commentId}',
    handler: (request) => handler.deleteThreadCommentHandler(request),
    options: {
      auth: 'forum_jwt',
    },
  },
  {
    method: 'GET',
    path: '/threads/{threadId}',
    handler: (request) => handler.getThreadHandler(request),
  },
  {
    method: 'POST',
    path: '/threads/{threadId}/comments/{commentId}/replies',
    handler: (request, h) => handler.postCommentReplyHandler(request, h),
    options: {
      auth: 'forum_jwt',
    },
  },
  {
    method: 'DELETE',
    path: '/threads/{threadId}/comments/{commentId}/replies/{replyId}',
    handler: (request) => handler.deleteCommentReplyHandler(request),
    options: {
      auth: 'forum_jwt',
    },
  },
  {
    method: 'PUT',
    path: '/threads/{threadId}/comments/{commentId}/likes',
    handler: (request) => handler.putLikeCommentHandler(request),
    options: {
      auth: 'forum_jwt',
    },
  },
]);

module.exports = routes;
