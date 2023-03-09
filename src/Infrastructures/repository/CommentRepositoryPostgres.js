const AuthorizationError = require('../../Commons/exceptions/AuthorizationError');
const CommentRepository = require('../../Domains/comments/CommentRepository');
const AddedComment = require('../../Domains/comments/entities/AddedComment');
const DetailComment = require('../../Domains/comments/entities/DetailComment');
const NotFoundError = require('../../Commons/exceptions/NotFoundError');

class CommentRepositoryPostgres extends CommentRepository {
  constructor(pool, idGenerator) {
    super();
    this._pool = pool;
    this._idGenerator = idGenerator;
  }

  async addComment(newComment) {
    const { content, threadId, owner } = newComment;
    const id = `comment-${this._idGenerator()}`;
    const query = {
      text: 'INSERT INTO comments VALUES($1, $2, $3, $4) RETURNING id, content, owner',
      values: [id, content, threadId, owner],
    };

    const result = await this._pool.query(query);
    return new AddedComment(result.rows[0]);
  }

  async deleteComment(commentId) {
    const query = {
      text: 'UPDATE comments SET is_delete = $2 WHERE id = $1',
      values: [commentId, true],
    };

    await this._pool.query(query);
  }

  async verifyThreadComment(commentId, threadId) {
    const query = {
      text: `SELECT * FROM comments
      INNER JOIN threads
      ON comments.thread_id = threads.id
      WHERE comments.id = $1 AND threads.id = $2`,
      values: [commentId, threadId],
    };

    const result = await this._pool.query(query);
    if (!result.rowCount) {
      throw new NotFoundError('Komen tidak ditemukan');
    }
  }

  async verifyCommentOwner(commentId, owner) {
    const query = {
      text: 'SELECT * FROM comments WHERE comments.id = $1 AND comments.owner = $2',
      values: [commentId, owner],
    };

    const result = await this._pool.query(query);
    if (!result.rowCount) {
      throw new AuthorizationError('Forbidden access');
    }
  }

  async getCommentsByThreadId(threadId) {
    const query = {
      text: `SELECT comments.id, comments.date, 
      comments.content, comments.is_delete as "isDelete", users.username
      FROM comments 
      LEFT JOIN users ON comments.owner = users.id
      WHERE comments.thread_id = $1
      ORDER BY comments.date ASC`,
      values: [threadId],
    };

    const { rows } = await this._pool.query(query);

    return rows.map((comment) => new DetailComment(comment));
  }
}
module.exports = CommentRepositoryPostgres;
