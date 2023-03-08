const CommentsTableTestHelper = require('../../../../tests/CommentsTableTestHelper');
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const AuthorizationError = require('../../../Commons/exceptions/AuthorizationError');
const NotFoundError = require('../../../Commons/exceptions/NotFoundError');
const AddedComment = require('../../../Domains/comments/entities/AddedComment');
const NewComment = require('../../../Domains/comments/entities/NewComment');
const pool = require('../../database/postgres/pool');
const CommentRepositoryPostgres = require('../CommentRepositoryPostgres');

describe('CommentRepositoryPostgres ', () => {
  beforeEach(async () => {
    await UsersTableTestHelper.addUser({});
    await ThreadsTableTestHelper.addThread({});
  });
  afterEach(async () => {
    await UsersTableTestHelper.cleanTable();
    await CommentsTableTestHelper.cleanTable();
    await ThreadsTableTestHelper.cleanTable();
  });
  afterAll(async () => {
    await pool.end();
  });

  const fakeIdGenerator = () => '123'; // stub!
  const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, fakeIdGenerator);

  describe('addComment function', () => {
    it('should persist add new comment and return added comment correctly', async () => {
      // Arrange
      const newComment = new NewComment({
        content: 'hello',
        owner: 'user-123',
        threadId: 'thread-123',
      });

      // Action
      await commentRepositoryPostgres.addComment(newComment);

      // Assert
      const comment = await CommentsTableTestHelper.findCommentById('comment-123');
      expect(comment).toHaveLength(1);
    });

    it('should persist add comment', async () => {
      // Arrange
      const newComment = new NewComment({
        content: 'hello',
        owner: 'user-123',
        threadId: 'thread-123',
      });

      // Action
      const addedComment = await commentRepositoryPostgres.addComment(newComment);

      // Assert
      expect(addedComment).toStrictEqual(new AddedComment({
        id: 'comment-123',
        content: 'hello',
        owner: 'user-123',
      }));
    });
  });

  describe('deleteComment function', () => {
    it('should persist delete comment', async () => {
      // Arrange
      const comment = {
        id: 'comment-123',
        threadId: 'thread-123',
      };
      await CommentsTableTestHelper.addComment({
        id: comment.id,
        threadId: comment.threadId,
      });

      // Action
      await commentRepositoryPostgres.deleteComment(comment.id);
      const isCommentExist = await CommentsTableTestHelper.findCommentById(comment.id);

      // Assert
      expect(isCommentExist[0].is_delete).toEqual(true);
    });
  });

  describe('verifyThreadComment function', () => {
    it('should throw NotFoundError when comment not found', async () => {
      // Arrange
      const comment = {
        commentId: 'comment-123',
        threadId: 'thread-123',
      };

      // Action & Assert
      expect(() => commentRepositoryPostgres
        .verifyThreadComment(comment.commentId, comment.threadId))
        .rejects.toThrowError(NotFoundError);
    });

    it('should not throw NotFoundError when comment is found', async () => {
      // Arrange
      const comment = {
        commentId: 'comment-123',
        threadId: 'thread-123',
      };
      await CommentsTableTestHelper.addComment({
        id: comment.commentId,
        threadId: comment.threadId,
      });

      // Action & Assert
      await expect(commentRepositoryPostgres
        .verifyThreadComment(comment.commentId, comment.threadId))
        .resolves.not.toThrowError(NotFoundError);
    });
  });

  describe('verifyCommentOwner function', () => {
    it('should throw AuthorizationError when the comment is not owner comment', async () => {
      // Arrange
      const comment = {
        commentId: 'comment-123',
        threadId: 'thread-123',
        owner: 'user-123',
      };
      await CommentsTableTestHelper.addComment({
        id: comment.commentId,
        threadId: comment.threadId,
        owner: comment.owner,
      });

      // Action & Assert
      expect(() => commentRepositoryPostgres
        .verifyCommentOwner(comment.commentId, 'fake-user'))
        .rejects.toThrowError(AuthorizationError);
    });

    it('should not throw AuthorizationError when the actual owner has the comment', async () => {
      // Arrange
      const comment = {
        commentId: 'comment-123',
        threadId: 'thread-123',
        owner: 'user-123',
      };
      await CommentsTableTestHelper.addComment({
        id: comment.commentId,
        threadId: comment.threadId,
        owner: comment.owner,
      });

      // Action & Assert
      await expect(commentRepositoryPostgres
        .verifyCommentOwner(comment.commentId, comment.owner))
        .resolves.not.toThrowError(AuthorizationError);
    });
  });

  describe('getCommentByThreadId', () => {
    it('should persist get detail comment', async () => {
      // Arrange
      const threadId = 'thread-123';
      const isDelete = false;

      await CommentsTableTestHelper.addComment({
        id: 'comment-1',
        threadId,
        content: 'hello1',
        date: '2000',
        isDelete,
      });
      await CommentsTableTestHelper.addComment({
        id: 'comment-2',
        threadId,
        content: 'hello2',
        date: '2001',
        isDelete,
      });

      // Action
      const comments = await commentRepositoryPostgres.getCommentsByThreadId(threadId);

      // Assert
      expect(comments).toHaveLength(2);
    });
  });
});
