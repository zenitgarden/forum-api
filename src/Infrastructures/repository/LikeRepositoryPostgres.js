const LikeRepository = require('../../Domains/likes/LikeRepository');

class LikeRepositoryPostgres extends LikeRepository {
  constructor(pool, idGenerator) {
    super();
    this._pool = pool;
    this._idGenerator = idGenerator;
  }

  async likeComment(commentId, owner) {
    const id = `like-${this._idGenerator()}`;
    const query = {
      text: 'INSERT INTO likes VALUES($1, $2, $3)',
      values: [id, commentId, owner],
    };

    await this._pool.query(query);
  }

  async dislikeComment(commentId, owner) {
    const query = {
      text: 'DELETE FROM likes WHERE comment_id = $1 AND owner = $2',
      values: [commentId, owner],
    };

    await this._pool.query(query);
  }

  async verifyIsCommentLikeOrDislike(commentId, owner) {
    const query = {
      text: 'SELECT * FROM likes WHERE comment_id = $1 AND owner = $2',
      values: [commentId, owner],
    };

    const { rowCount } = await this._pool.query(query);
    if (!rowCount) return false;

    return true;
  }

  async getLikesByCommentId(commentId) {
    const query = {
      text: 'SELECT likes.comment_id as "commentId", likes.id, likes.owner FROM likes where comment_id = ANY($1::text[])',
      values: [commentId],
    };

    const { rows } = await this._pool.query(query);
    return rows;
  }
}
module.exports = LikeRepositoryPostgres;
