const NodeGeocoder = require("node-geocoder");

const options = {
  provider: "mapquest",
  httpAdapter: "https",
  apiKey: "tY5k7OaKzGATvyOpA4GXgZMRzgjSyrp4",
  formatter: null,
};

const geocoder = NodeGeocoder(options);

module.exports = geocoder;
