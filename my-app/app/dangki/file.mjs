import * as argon2 from "argon2";
const argon2 = require('argon2');
try {
  const hash = await argon2.hash("password");
  console.log(hash)
} catch (err) {
  //...
  console.log("error")
}