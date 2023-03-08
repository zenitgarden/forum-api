const CommentsTableTestHelper = require('../../../../tests/CommentsTableTestHelper');
const RepliesTableTestHelper = require('../../../../tests/RepliesTableTestHelper');
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const AuthorizationError = require('../../../Commons/exceptions/AuthorizationError');
const NotFoundError = require('../../../Commons/exceptions/NotFoundError');
const AddedReply = require('../../../Domains/replies/entities/AddedReply');
const DetailReply = require('../../../Domains/replies/entities/DetailReply');
const NewReply = require('../../../Domains/replies/entities/NewReply');
const pool = require('../../database/postgres/pool');
const ReplyRepositoryPostgres = require('../ReplyRepositoryPostgres');

describe('CommentRepositoryPostgres ', () => {
  beforeEach(async () => {
    await UsersTableTestHelper.addUser({});
    await ThreadsTableTestHelper.addThread({});
    await CommentsTableTestHelper.addComment({});
  });
  afterEach(async () => {
    await UsersTableTestHelper.cleanTable();
    await CommentsTableTestHelper.cleanTable();
    await RepliesTableTestHelper.cleanTable();
    await ThreadsTableTestHelper.cleanTable();
  });
  afterAll(async () => {
    await pool.end();
  });

  const fakeIdGenerator = () => '123'; // stub!
  const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, fakeIdGenerator);

  describe('addReply function', () => {
    it('should persist add reply and return reply object correctly', async () => {
      // Arrange
      const newReply = new NewReply({
        content: 'hello',
        owner: 'user-123',
        commentId: 'comment-123',
      });

      // Action
      await replyRepositoryPostgres.addReply(newReply);

      // Assert
      const reply = await RepliesTableTestHelper.findReplyById('reply-123');
      expect(reply).toHaveLength(1);
    });

    it('should persist reply comment', async () => {
      // Arrange
      const newReply = new NewReply({
        content: 'hello',
        owner: 'user-123',
        commentId: 'comment-123',
      });

      // Action
      const addedReply = await replyRepositoryPostgres.addReply(newReply);

      // Assert
      expect(addedReply).toStrictEqual(new AddedReply({
        id: 'reply-123',
        content: 'hello',
        owner: 'user-123',
      }));
    });
  });

  describe('deleteReply function', () => {
    it('should persist delete reply', async () => {
      // Arrange
      const reply = {
        id: 'reply-123',
        commentId: 'comment-123',
      };
      await RepliesTableTestHelper.addReply({
        id: reply.id,
        commentId: reply.commentId,
      });

      // Action
      await replyRepositoryPostgres.deleteReply(reply.id);
      const isReplyExist = await RepliesTableTestHelper.findReplyById(reply.id);

      // Assert
      expect(isReplyExist[0].is_delete).toEqual(true);
    });
  });

  describe('verifyCommentReply function', () => {
    it('should throw NotFoundError when reply not found', async () => {
      // Arrange
      const reply = {
        id: 'reply-123',
        commentId: 'comment-123',
      };

      // Action & Assert
      expect(() => replyRepositoryPostgres
        .verifyCommentReply(reply.id, reply.commentId))
        .rejects.toThrowError(NotFoundError);
    });

    it('should not throw NotFoundError when reply is found', async () => {
      // Arrange
      const reply = {
        id: 'reply-123',
        commentId: 'comment-123',
      };
      await RepliesTableTestHelper.addReply({
        id: reply.id,
        commentId: reply.commentId,
      });

      // Action & Assert
      await expect(replyRepositoryPostgres
        .verifyCommentReply(reply.id, reply.commentId))
        .resolves.not.toThrowError(NotFoundError);
    });
  });

  describe('verifyReplyOwner function', () => {
    it('should throw AuthorizationError when the reply is not own by the real owner', async () => {
      // Arrange
      const reply = {
        id: 'reply-123',
        commentId: 'comment-123',
      };
      await RepliesTableTestHelper.addReply({
        id: reply.id,
        commentId: reply.commentId,
      });

      // Action & Assert
      expect(() => replyRepositoryPostgres
        .verifyReplyOwner(reply.id, 'fake-user'))
        .rejects.toThrowError(AuthorizationError);
    });

    it('should not throw AuthorizationError when the real owner has the comment', async () => {
      // Arrange
      const reply = {
        id: 'reply-123',
        commentId: 'comment-123',
        owner: 'user-123',
      };
      await RepliesTableTestHelper.addReply({
        id: reply.id,
        commentId: reply.commentId,
        owner: reply.owner,
      });

      // Action & Assert
      await expect(replyRepositoryPostgres
        .verifyReplyOwner(reply.id, reply.owner))
        .resolves.not.toThrowError(AuthorizationError);
    });
  });

  describe('getRepliesByCommentId', () => {
    it('should persist get detail comment', async () => {
      // Arrange
      const threadId = 'thread-123';

      await RepliesTableTestHelper.addReply({
        id: 'reply-1',
        commentId: 'comment-123',
        content: 'hello1',
        date: '2000',
        isDelete: false,
      });

      // Action
      const replies = await replyRepositoryPostgres.getRepliesByThreadId(threadId);

      // Assert
      expect(replies).toHaveLength(1);
      expect(replies).toStrictEqual([
        new DetailReply({
          id: 'reply-1',
          commentId: 'comment-123',
          username: 'dicoding',
          date: '2000',
          content: 'hello1',
          isDelete: false,
        }),
      ]);
    });
  });
});
