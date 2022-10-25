class User {
  id;

  name;

  lastname;

  email;

  constructor(user) {
    // eslint-disable-next-line no-underscore-dangle
    this.id = user._id;
    this.name = user.name;
    this.lastname = user.lastname;
    this.email = user.email;
  }
}
module.exports = User;
