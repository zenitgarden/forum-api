class GetDetailThreadUseCase {
  constructor({ threadRepository, commentRepository, replyRepository }) {
    this._threadRepository = threadRepository;
    this._commentRepository = commentRepository;
    this._replyRepository = replyRepository;
  }

  async execute(useCasePayload) {
    const thread = await this._threadRepository.getDetailThread(useCasePayload.threadId);
    const comments = await this._commentRepository.getCommentsByThreadId(useCasePayload.threadId);
    const replies = await this._replyRepository.getRepliesByThreadId(useCasePayload.threadId);
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
}
module.exports = GetDetailThreadUseCase;
