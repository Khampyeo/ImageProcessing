import axios from "axios";
import fs from "fs";
import Jimp from "jimp";

export async function filterImageFromURL(inputURL) {
  try {
    const response = await axios.get(inputURL, {
      responseType: "arraybuffer",
    });

    const buffer = await Buffer.from(response.data, "binary");

    const image = await Jimp.read(buffer);

    const outpath =
      "/tmp/filtered." + Math.floor(Math.random() * 2000) + ".jpg";

    await image.resize(256, 256).quality(60).greyscale().writeAsync(outpath);

    return outpath;
  } catch (error) {
    throw new Error(error);
  }
}

// deleteLocalFiles
// helper function to delete files on the local disk
// useful to cleanup after tasks
// INPUTS
//    files: Array<string> an array of absolute paths to files
export async function deleteLocalFiles(files) {
  for (let file of files) {
    fs.unlinkSync(file);
  }
}
