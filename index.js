import express from "express";
import bodyParser from "body-parser";
import axios from "axios";

const app = express();
const port = 3000;

const API_URL = "https://kitsu.io/api/edge";
const limit = 10;

app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));

const getTopRated = async (offset) => {
  try {
    const response = await axios.get(
      `${API_URL}/anime?sort=-averageRating&page[limit]=${limit}&page[offset] = ${offset}`
    );
    return response.data.data;
  } catch (error) {
    console.log(error);
    return [];
  }
};

app.get("/", async (req, res) => {
  try {
    const trendingResponse = await axios.get(`${API_URL}/trending/anime`);
    const topRatedResponse = await axios.get(
      `${API_URL}/anime?sort=-averageRating`
    );

    const page = parseInt(req.query.page) || 0;
    console.log(page);

    const offset = page * limit;

    const trendingAnime = trendingResponse.data.data;
    const topRatedAnime = await getTopRated(offset);

    res.render("index.ejs", {
      trending: trendingAnime,
      topRated: topRatedAnime,
      page: page,
      limit: limit,
    });
  } catch (error) {
    console.log(error);
  }
  res.render("index.ejs");
});

app.get("/top-rated", async (req, res) => {
  res.render("toprated.ejs");
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}...`);
});
