import express from "express";
import bodyParser from "body-parser";
import axios from "axios";

const app = express();
const port = 3000;

const API_URL = "https://kitsu.io/api/edge";
const limit = 20;

app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));

const getTopRated = async (offset) => {
  try {
    const response = await axios.get(
      `${API_URL}/anime?sort=-averageRating&page[limit]=${limit}&page[offset]=${offset}`
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

    const trendingAnime = trendingResponse.data.data;
    const topRatedAnime = topRatedResponse.data.data;
    res.render("index.ejs", {
      trending: trendingAnime,
      topRated: topRatedAnime,
    });
  } catch (error) {
    console.log(error);
    res.render("index.ejs");
  }
});

app.get("/top-rated", async (req, res) => {
  const page = parseInt(req.query.page) || 0;
  const offset = page * limit;

  const topAnimes = await getTopRated(offset);
  const topAnimesArr = [...topAnimes];

  res.render("toprated.ejs", {
    topAnimes: topAnimesArr,
    page: page,
    limit: limit,
  });
});

app.get("/anime-detail", async (req, res) => {
  const id = req.query.id;

  const response = await axios.get(`${API_URL}/anime/${id}`);

  res.render("anime-detail.ejs", { anime: response.data.data });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}...`);
});
