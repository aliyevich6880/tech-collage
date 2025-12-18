const ImageKit = require("imagekit");

const imagekit = new ImageKit({
  publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
  urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT,
});

module.exports = imagekit;

console.log("IMAGEKIT_PUBLIC_KEY:", process.env.IMAGEKIT_PUBLIC_KEY);
console.log("IMAGEKIT_PRIVATE_KEY:", process.env.IMAGEKIT_PRIVATE_KEY);
console.log("IMAGEKIT_URL_ENDPOINT:", process.env.IMAGEKIT_URL_ENDPOINT);

