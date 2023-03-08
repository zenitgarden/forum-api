/* istanbul ignore file */
const LoginTestHelper = {
  async getToken(server) {
    // Register
    const requestPayload = {
      username: 'abc',
      password: 'abc',
      fullname: 'abcde',
    };
    const responseRegister = await server.inject({
      method: 'POST',
      url: '/users',
      payload: requestPayload,
    });

    // Login
    const responseLogin = await server.inject({
      method: 'POST',
      url: '/authentications',
      payload: {
        username: requestPayload.username,
        password: requestPayload.password,
      },
    });

    const { data: { addedUser: { id } } } = JSON.parse(responseRegister.payload);
    const { data: { accessToken } } = JSON.parse(responseLogin.payload);
    return { id, accessToken };
  },
};

module.exports = LoginTestHelper;
