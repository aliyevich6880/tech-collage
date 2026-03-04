const ImageKit = require("imagekit");

const hasImageKitConfig =
  Boolean(process.env.IMAGEKIT_PUBLIC_KEY) &&
  Boolean(process.env.IMAGEKIT_PRIVATE_KEY) &&
  Boolean(process.env.IMAGEKIT_URL_ENDPOINT);

let imagekit;

if (hasImageKitConfig) {
  imagekit = new ImageKit({
    publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
    privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
    urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT,
  });
} else {
  // Keep server bootable even when ImageKit env vars are missing.
  imagekit = {
    upload: async () => {
      throw new Error(
        "ImageKit is not configured. Set IMAGEKIT_PUBLIC_KEY, IMAGEKIT_PRIVATE_KEY and IMAGEKIT_URL_ENDPOINT."
      );
    },
  };
}

module.exports = imagekit;

