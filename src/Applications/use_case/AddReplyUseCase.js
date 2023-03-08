const NewReply = require('../../Domains/replies/entities/NewReply');

class AddReplyUseCase {
  constructor({ replyRepository, commentRepository }) {
    this._replyRepository = replyRepository;
    this._commentRepository = commentRepository;
  }

  async execute(useCasePayload) {
    const { threadId } = useCasePayload;
    const newReply = new NewReply(useCasePayload);
    await this._commentRepository.verifyThreadComment(newReply.commentId, threadId);
    return this._replyRepository.addReply(newReply);
  }
}

module.exports = AddReplyUseCase;
