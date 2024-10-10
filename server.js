import express from "express";
import bodyParser from "body-parser";
import { filterImageFromURL, deleteLocalFiles } from "./util/util.js";

// Init the Express application
const app = express();

// Set the network port
const port = process.env.PORT || 8082;

// Use the body parser middleware for post requests
app.use(bodyParser.json());
app.get("/filteredimage", async (req, res) => {
  const { image_url } = req.query;

  if (!image_url) {
    return res.status(400).send({ message: "image_url is required" });
  }

  try {
    const filteredImagePath = await filterImageFromURL(image_url);

    res.sendFile(filteredImagePath, async (err) => {
      if (err) {
        return res.status(500).send({ message: err });
      }

      await deleteLocalFiles([filteredImagePath]);
    });
  } catch (err) {
    return res.status(422).send({ message: err });
  }
});

// Root Endpoint
// Displays a simple message to the user
app.get("/", async (req, res) => {
  res.send("try GET /filteredimage?image_url={{}}");
});

// Start the Server
app.listen(port, () => {
  console.log(`server running http://localhost:${port}`);
  console.log(`press CTRL+C to stop server`);
});
