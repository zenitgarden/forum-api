const CommentsTableTestHelper = require('../../../../tests/CommentsTableTestHelper');
const LikesTableTestHelper = require('../../../../tests/LikeTableTestHelper');
const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const pool = require('../../database/postgres/pool');
const LikeRepositoryPostgres = require('../LikeRepositoryPostgres');

describe('LikeRepositoryPostgres ', () => {
  beforeEach(async () => {
    await UsersTableTestHelper.addUser({});
    await ThreadsTableTestHelper.addThread({});
    await CommentsTableTestHelper.addComment({});
  });
  afterEach(async () => {
    await UsersTableTestHelper.cleanTable();
    await CommentsTableTestHelper.cleanTable();
    await LikesTableTestHelper.cleanTable();
    await ThreadsTableTestHelper.cleanTable();
  });
  afterAll(async () => {
    await pool.end();
  });

  // Arrange
  const fakeIdGenerator = () => '123'; // stub!
  const likeRepositoryPostgres = new LikeRepositoryPostgres(pool, fakeIdGenerator);
  const commentId = 'comment-123';
  const commentIds = ['comment-123'];
  const owner = 'user-123';

  describe('likeComment function', () => {
    it('should like comment', async () => {
      // Action
      await likeRepositoryPostgres.likeComment(commentId, owner);

      // Assert
      const like = await LikesTableTestHelper.findLikeById('like-123');
      expect(like).toHaveLength(1);
    });
  });

  describe('dislikeComment function', () => {
    it('should dislike comment', async () => {
      // Arrange
      await LikesTableTestHelper.addLike({ id: 'like-123' });

      // Action
      await likeRepositoryPostgres.dislikeComment(commentId, owner);
      const like = await LikesTableTestHelper.findLikeById(commentId);

      // Assert
      expect(like).toHaveLength(0);
    });
  });

  describe('verifyIsCommentLikeOrDislike function', () => {
    it('should return true when it is like', async () => {
      // Arrange
      await LikesTableTestHelper.addLike({ id: 'like-123' });
      // Action
      const isLike = await likeRepositoryPostgres.verifyIsCommentLikeOrDislike(commentId, owner);
      // Assert
      expect(isLike).toStrictEqual(true);
    });
    it('should return false when it is like', async () => {
      // Action
      const isLiked = await likeRepositoryPostgres.verifyIsCommentLikeOrDislike(commentId, owner);
      // Assert
      expect(isLiked).toStrictEqual(false);
    });
  });

  describe('getRepliesByCommentId', () => {
    it('should return like count correctly', async () => {
      // Arrange
      await LikesTableTestHelper.addLike({ id: 'like-123' });

      // Action
      const likeCount = await likeRepositoryPostgres.getLikesByCommentId(commentIds);

      // Assert
      expect(likeCount).toHaveLength(1);
    });
  });
});
