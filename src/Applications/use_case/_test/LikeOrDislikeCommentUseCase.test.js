const CommentRepository = require('../../../Domains/comments/CommentRepository');
const LikeRepository = require('../../../Domains/likes/LikeRepository');
const LikeOrDislikeCommentUseCase = require('../LikeOrDislikeCommentUseCase');

describe('LikeOrDislikeCommentUseCase', () => {
  it('should orchestrating like comment action correctly', async () => {
    // Arrange
    const useCasePayload = {
      commentId: 'comment-123',
      threadId: 'thread-123',
      owner: 'user-123',
    };

    /** creating dependency of use case */
    const mockLikeRepository = new LikeRepository();
    const mockCommentRepository = new CommentRepository();

    /** mocking needed function */
    mockCommentRepository.verifyThreadComment = jest.fn()
      .mockImplementation(() => Promise.resolve());
    mockLikeRepository.verifyIsCommentLikeOrDislike = jest.fn()
      .mockImplementation(() => Promise.resolve(false));
    mockLikeRepository.likeComment = jest.fn()
      .mockImplementation(() => Promise.resolve());

    /** creating use case instance */
    const likeOrDislikeCommentUseCase = new LikeOrDislikeCommentUseCase({
      commentRepository: mockCommentRepository,
      likeRepository: mockLikeRepository,
    });

    // Action
    await likeOrDislikeCommentUseCase.execute(useCasePayload);

    // Assert
    expect(mockCommentRepository.verifyThreadComment)
      .toBeCalledWith(useCasePayload.commentId, useCasePayload.threadId);
    expect(mockLikeRepository.verifyIsCommentLikeOrDislike)
      .toBeCalledWith(useCasePayload.commentId, useCasePayload.owner);
    expect(mockLikeRepository.likeComment)
      .toBeCalledWith(useCasePayload.commentId, useCasePayload.owner);
  });

  it('should orchestrating dislike comment action correctly', async () => {
    // Arrange
    const useCasePayload = {
      commentId: 'comment-123',
      threadId: 'thread-123',
      owner: 'user-123',
    };

    /** creating dependency of use case */
    const mockLikeRepository = new LikeRepository();
    const mockCommentRepository = new CommentRepository();

    /** mocking needed function */
    mockCommentRepository.verifyThreadComment = jest.fn()
      .mockImplementation(() => Promise.resolve());
    mockLikeRepository.verifyIsCommentLikeOrDislike = jest.fn()
      .mockImplementation(() => Promise.resolve(true));
    mockLikeRepository.dislikeComment = jest.fn()
      .mockImplementation(() => Promise.resolve());

    /** creating use case instance */
    const likeOrDislikeCommentUseCase = new LikeOrDislikeCommentUseCase({
      commentRepository: mockCommentRepository,
      likeRepository: mockLikeRepository,
    });

    // Action
    await likeOrDislikeCommentUseCase.execute(useCasePayload);

    // Assert
    expect(mockCommentRepository.verifyThreadComment)
      .toBeCalledWith(useCasePayload.commentId, useCasePayload.threadId);
    expect(mockLikeRepository.verifyIsCommentLikeOrDislike)
      .toBeCalledWith(useCasePayload.commentId, useCasePayload.owner);
    expect(mockLikeRepository.dislikeComment)
      .toBeCalledWith(useCasePayload.commentId, useCasePayload.owner);
  });
});
