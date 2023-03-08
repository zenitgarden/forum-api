const DetailComment = require('../DetailComment');

describe('DetailComment entities', () => {
  it('should throw error when payload did not contain needed property', () => {
    // Arrange
    const payload = {
      id: 'comment-123',
      username: 'hello',
      date: new Date().toISOString(),
      content: 'hello',
    };

    // Action and Assert
    expect(() => new DetailComment(payload)).toThrowError('DETAIL_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when payload did not meet data type specification', () => {
    // Arrange
    const payload = {
      id: 'comment-123',
      username: ['hello'],
      date: new Date().toISOString(),
      content: 'hello',
      isDelete: true,
    };

    // Action and Assert
    expect(() => new DetailComment(payload)).toThrowError('DETAIL_COMMENT.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should return content = **komentar telah dihapus** correctly', () => {
    // Arrange
    const payload = {
      id: 'comment-123',
      username: 'hello',
      date: new Date().toISOString(),
      content: 'hello',
      isDelete: true,
    };

    // Action and Assert
    const comment = new DetailComment(payload);
    expect(comment.content).toEqual('**komentar telah dihapus**');
  });

  it('should create detailcomment object correctly', () => {
    // Arrange
    const payload = {
      id: 'comment-123',
      username: 'hello',
      date: new Date().toISOString(),
      content: 'hello',
      isDelete: false,
    };

    // Action
    const {
      id, content, username, date,
    } = new DetailComment(payload);

    // Assert
    expect(id).toEqual(payload.id);
    expect(content).toEqual(payload.content);
    expect(username).toEqual(payload.username);
    expect(date).toEqual(payload.date);
  });
});
