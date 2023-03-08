const DetailReply = require('../DetailReply');

describe('DetailReply entities', () => {
  it('should throw error when payload did not contain needed property', () => {
    // Arrange
    const payload = {
      id: 'reply-123',
      username: 'hello',
      date: new Date().toISOString(),
      content: 'hello',
      commentId: 'comment-123',
    };

    // Action and Assert
    expect(() => new DetailReply(payload)).toThrowError('DETAIL_REPLY.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw error when payload did not meet data type specification', () => {
    // Arrange
    const payload = {
      id: 'reply-123',
      username: ['hello'],
      date: new Date().toISOString(),
      content: 'hello',
      isDelete: true,
      commentId: 'comment-123',
    };

    // Action and Assert
    expect(() => new DetailReply(payload)).toThrowError('DETAIL_REPLY.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should return content = **balasan telah dihapus** correctly', () => {
    // Arrange
    const payload = {
      id: 'reply-123',
      username: 'hello',
      date: new Date().toISOString(),
      content: 'hello',
      isDelete: true,
      commentId: 'comment-123',
    };

    // Action and Assert
    const comment = new DetailReply(payload);
    expect(comment.content).toEqual('**balasan telah dihapus**');
  });

  it('should create detailcomment object correctly', () => {
    // Arrange
    const payload = {
      id: 'reply-123',
      username: 'hello',
      date: new Date().toISOString(),
      content: 'hello',
      isDelete: false,
      commentId: 'comment-123',
    };

    // Action
    const {
      id, content, username, date, commentId,
    } = new DetailReply(payload);

    // Assert
    expect(id).toEqual(payload.id);
    expect(content).toEqual(payload.content);
    expect(username).toEqual(payload.username);
    expect(date).toEqual(payload.date);
    expect(commentId).toEqual(payload.commentId);
  });
});
