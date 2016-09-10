module.exports = { // Declare your customize function which you want to use in your api
  
  get username() { // get uinique username. In your api use ${utils.username}
    return new Date().getTime().toString();
  }

}