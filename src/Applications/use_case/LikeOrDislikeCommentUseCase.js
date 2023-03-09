class LikeOrDislikeCommentUseCase {
  constructor({ likeRepository, commentRepository }) {
    this._likeRepository = likeRepository;
    this._commentRepository = commentRepository;
  }

  async execute(useCasePayload) {
    const { commentId, threadId, owner } = useCasePayload;
    await this._commentRepository.verifyThreadComment(commentId, threadId);
    const isLiked = await this._likeRepository.verifyIsCommentLikeOrDislike(commentId, owner);
    if (isLiked) {
      return this._likeRepository.dislikeComment(commentId, owner);
    }

    return this._likeRepository.likeComment(commentId, owner);
  }
}

module.exports = LikeOrDislikeCommentUseCase;
