const ThreadsTableTestHelper = require('../../../../tests/ThreadsTableTestHelper');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const NotFoundError = require('../../../Commons/exceptions/NotFoundError');
const AddedThread = require('../../../Domains/threads/entities/AddedThread');
const DetailThread = require('../../../Domains/threads/entities/DetailThread');
const NewThread = require('../../../Domains/threads/entities/NewThread');
const pool = require('../../database/postgres/pool');
const ThreadRepositoryPostgres = require('../ThreadRepositoryPostgres');

describe('ThreadRepositoryPostgres ', () => {
  beforeEach(async () => {
    await UsersTableTestHelper.addUser({ id: 'user-123' });
  });
  afterEach(async () => {
    await UsersTableTestHelper.cleanTable();
    await ThreadsTableTestHelper.cleanTable();
  });
  afterAll(async () => {
    await pool.end();
  });

  const fakeIdGenerator = () => '123'; // stub!
  const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, fakeIdGenerator);

  describe('AddThread function', () => {
    it('should persist add new thread and return added thread correctly', async () => {
      // Arrange
      const newThread = new NewThread({
        title: 'new title',
        body: 'hello',
        owner: 'user-123',
      });

      // Action
      await threadRepositoryPostgres.addThread(newThread);

      // Assert
      const thread = await ThreadsTableTestHelper.findThreadById('thread-123');
      expect(thread).toHaveLength(1);
    });

    it('should return thread correctly', async () => {
      // Arrange
      const newThread = new NewThread({
        title: 'new title',
        body: 'hello',
        owner: 'user-123',
      });

      // Action
      const addedThread = await threadRepositoryPostgres.addThread(newThread);

      // Assert
      expect(addedThread).toStrictEqual(new AddedThread({
        id: 'thread-123',
        title: 'new title',
        owner: 'user-123',
      }));
    });
  });

  describe('verifyThreadById', () => {
    it('should throw notFound error when thread not found', async () => {
      // Arrange
      const id = 'thread-0';

      // Action & Assert
      await expect(threadRepositoryPostgres.verifyThreadById(id))
        .rejects.toThrowError(NotFoundError);
    });

    it('should not throw notFound error when thread found', async () => {
      // Arrange
      await ThreadsTableTestHelper.addThread({});

      // Action & Assert
      await expect(threadRepositoryPostgres.verifyThreadById('thread-123'))
        .resolves.not.toThrowError(NotFoundError);
    });
  });

  describe('getDetailThread', () => {
    it('should throw notFound error when thread not found', async () => {
      // Arrange
      const id = 'thread-0';

      // Action & Assert
      await expect(threadRepositoryPostgres.getDetailThread(id))
        .rejects.toThrowError(NotFoundError);
    });

    it('should not throw notFound error when thread found', async () => {
      // Arrange
      await ThreadsTableTestHelper.addThread({});

      // Action & Assert
      await expect(threadRepositoryPostgres.getDetailThread('thread-123'))
        .resolves.not.toThrowError(NotFoundError);
    });

    it('should persist get detail thread', async () => {
      // Arrange
      await ThreadsTableTestHelper.addThread({ date: '2023' });

      // Action & Assert
      const detailThread = await threadRepositoryPostgres.getDetailThread('thread-123');
      expect(detailThread).toStrictEqual(
        new DetailThread({
          id: 'thread-123',
          title: 'new title',
          body: 'hello',
          date: '2023',
          username: 'dicoding',
        }),
      );
    });
  });
});
