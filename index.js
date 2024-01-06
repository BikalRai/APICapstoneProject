import express from "express";
import bodyParser from "body-parser";
import axios from "axios";

const app = express();
const port = process.env.PORT || 3000;

const API_URL = "https://kitsu.io/api/edge";
const limit = 20;

app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));

// function to retrieve only top rated animes
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

// function to retrieve searched animes
const getSearchedData = async (offset, limit, query) => {
  try {
    const response = await axios.get(
      `${API_URL}/anime?filter[text]=${query}&page[limit]=${limit}&page[offset]=${offset}`
    );
    return response.data.data;
  } catch (error) {
    console.log(error);
    return [];
  }
};

app.get("/", async (req, res) => {
  try {
    // retrieving trending animes
    const trendingResponse = await axios.get(`${API_URL}/trending/anime`);

    // retrieving default 10 top rated animes
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
  // getting page value, first setting initial to zero if there is no value of page
  const page = parseInt(req.query.page) || 0;

  // setting the offset to retrieve from first page
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
  // retrieving id of anime to display its details
  const id = req.query.id;

  // retrieve specifi anime using id
  const response = await axios.get(`${API_URL}/anime/${id}`);

  res.render("anime-detail.ejs", { anime: response.data.data });
});

app.get("/search", async (req, res) => {
  // retrieving search text to be displayed
  const query = req.query.search;
  const page = parseInt(req.query.page) || 0;
  const offset = page * limit;

  const queriedData = await getSearchedData(offset, limit, query);

  res.render("results.ejs", {
    results: queriedData,
    page: page,
    limit: limit,
  });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}...`);
});
