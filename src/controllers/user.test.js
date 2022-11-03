const { createRequest, createResponse } = require('node-mocks-http');
const bcryptjs = require('bcryptjs');
const UserSchema = require('../models/userSchema');

jest.mock('../models/userSchema');

describe('User controller test', () => {
  it('createUser succesfull', async () => {
    const req = createRequest({
      body: {
        email: 'correo@correo.com',
        name: 'name',
        password: 'password',
        lastname: 'lastname',
      },
    });
    UserSchema.findOne = jest.fn().mockImplementationOnce(() => {
      return Promise.resolve({
        email: 'correo@correo.com',
        name: 'name',
        password: 'password',
        lastname: 'lastname',
        _id: '1',
      });
    });
    const res = createResponse();
    const { createUser } = require('./user');
    const user = await createUser(req, res);
    expect(res._getStatusCode()).toEqual(200);
  });

  it('createUser error email', async () => {
    const req = createRequest({
      body: {
        email: '',
        name: 'name',
        lastname: 'lastname',
        password: 'password',
      },
    });
    const res = createResponse();
    const { createUser } = require('./user');
    const user = await createUser(req, res);
    expect(res._getStatusCode()).toEqual(400);
  });

  it('createUser error name', async () => {
    const req = createRequest({
      body: {
        email: 'correo@correo.com',
        name: '',
        lastname: 'lastname',
        password: 'password',
      },
    });
    const res = createResponse();
    const { createUser } = require('./user');
    const user = await createUser(req, res);
    expect(res._getStatusCode()).toEqual(400);
  });

  it('createUser error lastname', async () => {
    const req = createRequest({
      body: {
        email: 'correo@correo.com',
        name: 'name',
        lastname: '',
        password: 'password',
      },
    });
    const res = createResponse();
    const { createUser } = require('./user');
    const user = await createUser(req, res);
    expect(res._getStatusCode()).toEqual(400);
  });

  it('createUser error password', async () => {
    const req = createRequest({
      body: {
        email: 'correo@correo.com',
        name: 'name',
        lastname: 'lastname',
        password: '',
      },
    });
    const res = createResponse();
    const { createUser } = require('./user');
    const user = await createUser(req, res);
    expect(res._getStatusCode()).toEqual(400);
  });

  it('createUser eamil already exists', async () => {
    const req = createRequest({
      body: {
        email: 'correo@correo.com',
        name: 'name',
        password: 'password',
        lastname: 'lastname',
      },
    });
    const res = createResponse();
    const { createUser } = require('./user');
    UserSchema.findOne = jest.fn().mockImplementationOnce(() => {
      return Promise.resolve({
        email: 'correo@correo.com',
        name: 'name',
        password: 'password',
        lastname: 'lastname',
        _id: '1',
      });
    });
    const user = await createUser(req, res);
    expect(res._getStatusCode()).toEqual(400);
  });

  it('createUser error 500', async () => {
    const req = createRequest({
      body: {
        email: 'correo@correo.com',
        name: 'name',
        password: 'password',
        lastname: 'lastname',
      },
    });
    const res = createResponse();
    const { createUser } = require('./user');
    UserSchema.findOne = jest.fn().mockImplementationOnce(() => {
      throw new Error('Error 500 forzado');
    });
    const user = await createUser(req, res);
    expect(res._getStatusCode()).toEqual(500);
  });

  it('UserLogin succesfull', async () => {
    const req = createRequest({
      body: {
        email: 'correo@correo.com',
        password: 'password',
      },
    });
    const res = createResponse();
    const { login } = require('./user');
    UserSchema.findOne = jest.fn().mockImplementationOnce(() => {
      return Promise.resolve({
        email: 'correo@correo.com',
        name: 'name',
        password: 'password',
        lastname: 'lastname',
        _id: '1',
      });
    });

    const user = await login(req, res);
    expect(res._getStatusCode()).toEqual(200);
  });

  it('UserLogin error password', async () => {
    const req = createRequest({
      body: {
        email: 'correo@correo.com',
        password: '',
      },
    });
    const res = createResponse();
    const { login } = require('./user');

    const user = await login(req, res);

    expect(res._getStatusCode()).toEqual(400);
  });

  it('UserLogin error email', async () => {
    const req = createRequest({
      body: {
        password: 'password',
      },
    });
    const res = createResponse();
    const { login } = require('./user');
    const user = await login(req, res);

    expect(res._getStatusCode()).toEqual(400);
  });

  it('UserLogin error user', async () => {
    const req = createRequest({
      body: {
        email: 'correo@correo.com',
        password: 'password',
      },
    });
    const res = createResponse();
    const { login } = require('./user');
    UserSchema.findOne = jest.fn().mockImplementationOnce(() => {
      return Promise.resolve(null);
    });

    const user = await login(req, res);

    expect(res._getStatusCode()).toEqual(400);
  });

  it.only('UserLogin error passwordSuccess', async () => {
    const req = createRequest({
      body: {
        email: 'correo@corre.com',
        password: 'password',
      },
    });
    const res = createResponse();
    const { login } = require('./user');
    UserSchema.findOne = jest.fn().mockImplementationOnce(() => {
      return Promise.resolve({
        email: 'correo@correo.com',
        name: 'name',
        password: 'pass',
        lastname: 'lastname',
        _id: '1',
      });
    });
    const user = await login(req, res);

    expect(res._getStatusCode()).toEqual(400);
  });

  it('UserLogin error 500', async () => {
    const req = createRequest({
      body: {
        email: 'correo@corre.com',
        password: 'password',
      },
    });
    const res = createResponse();
    const { login } = require('./user');
    UserSchema.findOne = jest.fn().mockImplementationOnce(() => {
      throw new Error('Error 500 forzado');
    });
    const user = await login(req, res);

    expect(res._getStatusCode()).toEqual(500);
  });

  it('getUsers succesfull', async () => {
    const req = createRequest();
    const res = createResponse();

    const { getUsers } = require('./user');
    UserSchema.find = jest.fn().mockImplementationOnce(() => {
      return Promise.resolve([
        {
          email: 'correo@correo.com',
          name: 'name',
          password: 'password',
          lastname: 'lastname',
          _id: '1',
        },
      ]);
    });

    const users = await getUsers(req, res);

    expect(res._getStatusCode()).toEqual(200);
  });

  it('getUsers error 500', async () => {
    const req = createRequest();
    const res = createResponse();

    const { getUsers } = require('./user');
    UserSchema.find = jest.fn().mockImplementationOnce(() => {
      throw new Error('Error 500 forzado');
    });
    const user = await getUsers(req, res);
    // expect(Promise(res._getStatusCode(500))).rejects.toEqual(500);
    expect(res._getStatusCode()).toEqual(500);
  });

  it('GetUserById succesfull', async () => {
    const req = createRequest({
      params: {
        _id: '1',
      },
    });
    const res = createResponse();
    const { getUserById } = require('./user');
    UserSchema.findById = jest.fn().mockImplementationOnce(() => {
      return Promise.resolve({
        email: 'correo@correo.com',
        name: 'name',
        password: 'password',
        lastname: 'lastname',
        _id: '1',
      });
    });
    const user = await getUserById(req, res);
    expect(res._getStatusCode()).toEqual(200);
  });

  it('GetUserById error usuario', async () => {
    const req = createRequest({
      params: {
        _id: '1',
      },
    });
    const res = createResponse();
    const { getUserById } = require('./user');
    UserSchema.findById = jest.fn().mockImplementationOnce(() => {
      throw new Error(
        'Cast to ObjectId failed for value "1" (type string) at path "_id" for model "User"'
      ).stack;
    });
    const user = await getUserById(req, res);
    expect(res._getStatusCode()).toEqual(404);
  });

  it('GetUserById error 500', async () => {
    const req = createRequest({
      params: {
        _id: '1',
      },
    });
    const res = createResponse();
    const { getUserById } = require('./user');
    UserSchema.findById = jest.fn().mockImplementationOnce(() => {
      throw new Error(
        'to ObjectId failed for value "1" (type string) at path "_id" for model "User"'
      );
    });
    const user = await getUserById(req, res);
    expect(res._getStatusCode()).toEqual(500);
  });

  it('updateUser succesfull', async () => {
    const req = createRequest({
      params: {
        _id: '1',
      },
    });
    const res = createResponse();
    const { updateUser } = require('./user');
    UserSchema.findByIdAndUpdate = jest.fn().mockImplementationOnce(() => {
      return Promise.resolve({
        email: 'correo@correo.com',
        name: 'name',
        password: 'password',
        lastname: 'lastname',
        _id: '1',
      });
    });
    const user = await updateUser(req, res);
    expect(res._getStatusCode()).toEqual(200);
  });

  it('updateUser error usuario', async () => {
    const req = createRequest({
      params: {
        _id: '1',
      },
    });
    const res = createResponse();
    const { updateUser } = require('./user');
    UserSchema.findByIdAndUpdate = jest.fn().mockImplementationOnce(() => {
      throw new Error(
        'Cast to ObjectId failed for value "1" (type string) at path "_id" for model "User"'
      );
    });

    const user = await updateUser(req, res);
    expect(res._getStatusCode()).toEqual(404);
  });

  it('updateUser error 500', async () => {
    const req = createRequest({
      params: {
        _id: '1',
      },
    });
    const res = createResponse();
    const { updateUser } = require('./user');
    UserSchema.findByIdAndUpdate = jest.fn().mockImplementationOnce(() => {
      throw new Error(
        ' to ObjectId failed for value "1" (type string) at path "_id" for model "User"'
      );
    });

    const user = await updateUser(req, res);
    expect(res._getStatusCode()).toEqual(500);
  });

  it('deleteUser succesfull', async () => {
    const req = createRequest({
      params: {
        _id: '1',
      },
    });
    const res = createResponse();
    const { deleteUser } = require('./user');
    UserSchema.findByIdAndDelete = jest.fn().mockImplementationOnce(() => {
      return Promise.resolve(String);
    });
    const user = await deleteUser(req, res);
    expect(res._getStatusCode()).toEqual(204);
  });

  it('deleteUser error usuario', async () => {
    const req = createRequest({
      params: {
        _id: '1',
      },
    });
    const res = createResponse();
    const { deleteUser } = require('./user');
    UserSchema.findByIdAndDelete = jest.fn().mockImplementationOnce(() => {
      return Promise.resolve(null);
    });
    const user = await deleteUser(req, res);
    expect(res._getStatusCode()).toEqual(204);
  });

  it('deleteUser error 500', async () => {
    const req = createRequest({
      params: {
        _id: '1',
      },
    });
    const res = createResponse();
    const { deleteUser } = require('./user');
    UserSchema.findByIdAndDelete = jest.fn().mockImplementationOnce(() => {
      throw new Error('Error 500 forzado');
    });
    const user = await deleteUser(req, res);
    expect(res._getStatusCode()).toEqual(500);
  });
});
