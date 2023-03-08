/* istanbul ignore file */
const CommentRepository = require('../../../Domains/comments/CommentRepository');
const DetailComment = require('../../../Domains/comments/entities/DetailComment');
const ReplyRepository = require('../../../Domains/replies/ReplyRepository');
const DetailReply = require('../../../Domains/replies/entities/DetailReply');
const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const DetailThread = require('../../../Domains/threads/entities/DetailThread');
const GetDetailThreadUseCase = require('../GetDetailThreadUseCase');

describe('getDetailThreadUseCase', () => {
  it('should orchestrating get detail thread action correctly', async () => {
    // Arrange
    const useCasePayload = {
      threadId: 'thread-123',
    };

    const thread = new DetailThread({
      id: 'thread-123',
      title: 'new title',
      body: 'hello',
      date: '1999',
      username: 'dicoding',
    });

    const comments = [
      new DetailComment({
        id: 'comment-1',
        username: 'human',
        date: '2000',
        content: 'hello',
        isDelete: false,
      }),

      new DetailComment({
        id: 'comment-2',
        username: 'dicoding',
        date: '2001',
        content: 'hello2',
        isDelete: true,
      }),
    ];

    const replies = [
      new DetailReply({
        id: 'reply-1',
        username: 'hello',
        date: '2000',
        content: 'hello balas 1',
        isDelete: false,
        commentId: 'comment-1',
      }),

      new DetailReply({
        id: 'reply-2',
        username: 'hello',
        date: '2001',
        content: 'hello balas 2',
        isDelete: true,
        commentId: 'comment-2',
      }),
    ];

    const expectedCommentsAndReplies = {
      id: 'thread-123',
      title: 'new title',
      body: 'hello',
      date: '1999',
      username: 'dicoding',
      comments: [
        {
          id: 'comment-1',
          username: 'human',
          date: '2000',
          content: 'hello',
          replies: [
            {
              id: 'reply-1',
              username: 'hello',
              date: '2000',
              content: 'hello balas 1',
            },
          ],
        },
        {
          id: 'comment-2',
          username: 'dicoding',
          date: '2001',
          content: '**komentar telah dihapus**',
          replies: [
            {
              id: 'reply-2',
              username: 'hello',
              date: '2001',
              content: '**balasan telah dihapus**',
            },
          ],
        },
      ],
    };

    // Create dependency of use case
    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();
    const mockReplyRepository = new ReplyRepository();

    // Mocking needed function
    mockThreadRepository.getDetailThread = jest.fn()
      .mockImplementation(() => Promise.resolve(thread));
    mockCommentRepository.getCommentsByThreadId = jest.fn()
      .mockImplementation(() => Promise.resolve(comments));
    mockReplyRepository.getRepliesByThreadId = jest.fn()
      .mockImplementation(() => Promise.resolve(replies));

    // Create use case instance
    const getDetailThreadUseCase = new GetDetailThreadUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
      replyRepository: mockReplyRepository,
    });

    // Action
    const detailThread = await getDetailThreadUseCase.execute(useCasePayload);

    // Assert
    expect(mockThreadRepository.getDetailThread).toBeCalledWith(useCasePayload.threadId);
    expect(mockCommentRepository.getCommentsByThreadId).toBeCalledWith(useCasePayload.threadId);
    expect(mockReplyRepository.getRepliesByThreadId).toBeCalledWith(useCasePayload.threadId);
    expect(detailThread).toEqual(expectedCommentsAndReplies);
  });
});
