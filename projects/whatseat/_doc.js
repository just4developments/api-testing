exports = module.exports = {
  groups: [
    {'place': 'Document for place', 'group 1': 'Group 1'}
  ],  
  declare: {
    user: {
      "#": "User information",
      "id": "User UUID",
      "username": "Username",
      "email": "User email",
      "infor": {
        "#": "User details information",
        "fullname": "Full name",
        "gender": "Gender",
        "phone": "User phone",
        "address": "User address",
        "city": "City",
        "region": "Region",
        "country": "Country",
        "avatar": "User avatar",
        "location": {
          "#": "User location",
          "lat": "Latitude",
          "lng": "Longitude"
        }
      },
      "devices": {
        "#": "User device information",
        "model": "Device model",
        "platform": "Device platform",
        "build_code": "OS Build code",
        "build_number": "OS Build number",
        "brand": "OS Brand",
        "device_id": "Device ID"
      },
      "reviews": "List mealID, placeID which user can review"
    },
    users: {
      "#": "List user",
      "${user}": undefined
    },
    "req.header": {
      "content-type": "Request content type",
      "access_token": "User access token which is gotten after user login done",
      "app": "App ID which you login, signup... Each app have one App ID (Itogo, Shopkeeper...)"
    },
    "res.header": {
      "access_token": "User access token which is gotten after user login done",
    }
  }
}