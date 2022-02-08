/*
*  setup your server config from here
*/

const minimist = require("minimist");
const fs = require("fs");
const readline = require("readline");

// cli config

const title = "Example Node.js Confluent Cloud client";
// these are placeholder values; make sure to replace it by correct values
const bootstrap_server = 'place.holder.ap-south-1.aws.confluent.cloud:8080';
const sasl_username = 'O3XDV3ZJYDPNRRBW';
const sasl_password = 'QLPPEfT7qzr8UklvpaEc87NYb34n3IyWMYqmtjYb5gIBM7JWLeKZJjP/ZzfxVus7';

const requiredConfig = {
  "bootstrap.servers": bootstrap_server,
  "sasl.username": sasl_username,
  "sasl.password": sasl_password,
  "security.protocol": "SASL_SSL",
  "sasl.mechanisms": "PLAIN",
};

// set your topic name
const topic = 'sample_topic';

module.exports = {
  requiredConfig: requiredConfig,
  topic: topic,
}
