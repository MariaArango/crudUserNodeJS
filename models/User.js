class User {
  id;
  name;
  lastname;
  email;

  constructor(user) {
    this.id = user._id;
    this.name = user.name;
    this.lastname = user.lastname;
    this.email = user.email;
  }
}
module.exports = User;
