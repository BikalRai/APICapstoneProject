import express from "express";
import bodyParser from "body-parser";
import axios from "axios";

const app = express();
const port = 3000;

const API_URL = "https://api.jikan.moe/v4/anime";

app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));

app.use("/", async (req, res) => {
  try {
    const response = await axios.get(API_URL);
    console.log(response.data);
  } catch (error) {
    console.log(error);
  }

  res.render("index.ejs");
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}...`);
});
