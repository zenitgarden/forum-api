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
      text: 'INSERT INTO replies VALUES($1, $2, $3)',
      values: [id, commentId, owner],
    };

    await this._pool.query(query);
  }
}
module.exports = LikeRepositoryPostgres;
