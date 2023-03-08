const ReplyRepository = require('../../../Domains/replies/ReplyRepository');
const DeleteReplyUseCase = require('../DeleteReplyUseCase');

describe('delete reply function', () => {
  it('should orchestrating the delete comment action correctly', async () => {
    const useCasePayload = {
      replyId: 'reply-123',
      commentId: 'comment-123',
      owner: 'user-123',
    };

    const mockReplyRepository = new ReplyRepository();

    mockReplyRepository.verifyCommentReply = jest.fn(() => Promise.resolve());
    mockReplyRepository.verifyReplyOwner = jest.fn(() => Promise.resolve());
    mockReplyRepository.deleteReply = jest.fn(() => Promise.resolve());

    const commentUseCase = new DeleteReplyUseCase({ replyRepository: mockReplyRepository });

    await commentUseCase.execute(useCasePayload);

    expect(mockReplyRepository.verifyCommentReply)
      .toBeCalledWith(useCasePayload.replyId, useCasePayload.commentId);
    expect(mockReplyRepository.verifyReplyOwner)
      .toBeCalledWith(useCasePayload.replyId, useCasePayload.owner);
    expect(mockReplyRepository.deleteReply)
      .toBeCalledWith(useCasePayload.replyId);
  });
});
