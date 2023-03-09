/* eslint-disable no-param-reassign */
class GetDetailThreadUseCase {
  constructor({
    threadRepository, commentRepository, replyRepository, likeRepository,
  }) {
    this._threadRepository = threadRepository;
    this._commentRepository = commentRepository;
    this._replyRepository = replyRepository;
    this._likeRepository = likeRepository;
  }

  async execute(useCasePayload) {
    const thread = await this._threadRepository.getDetailThread(useCasePayload.threadId);
    const comments = await this._commentRepository.getCommentsByThreadId(useCasePayload.threadId);
    const replies = await this._replyRepository.getRepliesByThreadId(useCasePayload.threadId);
    thread.comments = await this.getLikesForEachComment(comments);
    thread.comments = this.getRepliesForEachComment(comments, replies);
    return thread;
  }

  getRepliesForEachComment(commentsPayload, repliesPayload) {
    return commentsPayload.map((comment) => {
      const replies = repliesPayload.filter((reply) => reply.commentId === comment.id)
        .map((reply) => ({
          id: reply.id,
          content: reply.content,
          date: reply.date,
          username: reply.username,
        }));
      return { ...comment, replies };
    });
  }

  async getLikesForEachComment(commentsPayload) {
    return Promise.all(commentsPayload.map(async (comment) => {
      comment.likeCount = await this._likeRepository.getLikesByCommentId(comment.id);
    }));
  }
}
module.exports = GetDetailThreadUseCase;
