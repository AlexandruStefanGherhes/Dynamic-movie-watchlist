const searchBtn = document.getElementById("search-btn");
const form = document.querySelector(".form");
const input = document.getElementById("search");
const main = document.querySelector(".main");
const movies = document.querySelector(".movies");
const lessBtn = document.querySelectorAll(".less");
const readBtn = document.querySelectorAll(".read");
const paragraph = document.querySelectorAll(".paragraph");
const explore = document.querySelector(".explore");

let movieList = [];

class Movie {
  constructor(
    poster = "unknown",
    title = "unknown",
    rating = "unknown",
    overview = "unknown"
  ) {
    this.title = title;
    this.poster = poster;
    this.rating = rating;
    this.overview = overview;
  }
}

form.addEventListener("submit", (e) => {
  e.preventDefault();
  movies.innerHTML = "";
  explore.style.display = "none";
  getMovies();
  form.reset();
});

document.addEventListener("click", (e) => {
  const target = e.target.closest(".watchlist-btn");
  if (target) {
    const container = target.closest(".movie");
    const containerImage = container.querySelector(".movies__poster").src;
    const containerTitle = container.querySelector(".title").textContent;
    const containerScore =
      container.querySelector(".rating__score").textContent;
    const containerPlot = container.querySelector(".paragraph").textContent;

    const movie = new Movie(
      containerImage,
      containerTitle,
      containerScore,
      containerPlot
    );
    movieList.push(movie);
    saveLocal();
    console.log(movieList);
  } else {
    return;
  }
});

readBtn.forEach((btn) => (btn.onclick = expandDescription));
lessBtn.forEach((btn) => (btn.onclick = contractDescription));

function contractDescription(e) {
  const paragraph = e.target.parentElement.querySelector(".paragraph");
  const btnLess = e.target;
  const btnMore = e.target.previousElementSibling;
  btnLess.style.display = "none";
  btnMore.style.display = "block";
  paragraph.classList.add("limitHeight");
  paragraph.classList.remove("active");
}

function expandDescription(e) {
  const btnLess = e.target.nextElementSibling;
  const btnMore = e.target;
  const paragraph = e.target.parentElement.querySelector(".paragraph");
  btnMore.style.display = "none";
  btnLess.style.display = "block";
  paragraph.classList.remove("limitHeight");
  paragraph.classList.add("active");
}

function checkLength() {
  paragraph.forEach((item) => {
    if (item.offsetHeight > 90) {
      item.classList.add("limitHeight");
      const readBtn = item.parentElement.parentElement.querySelector(".read");
      readBtn.style.display = "block";
    }
  });
  //   console.log("ran");
}

async function getMovies() {
  try {
    const pullMovie = await fetch(
      `https://api.themoviedb.org/3/search/movie?api_key=f954291460bfca85d90554f2e8596032&query=${input.value}`
    );
    const result = await pullMovie.json();

    if (result.success === false || result.results.length === 0) {
      document.querySelector(".not-found").style.display = "block";
    } else {
      for (let i = 0; i < result.results.length; i++) {
        document.querySelector(".not-found").style.display = "none";
        movies.innerHTML += `
                   <div class="movie">
                    <div class="image">
                      <img
                          src="https://image.tmdb.org/t/p/original/${result.results[i].poster_path}"
                          alt=""
                          class="movies__poster"
                        />
                    </div>
                    <div class="details">
                      <div class="movie__title-rating">
                        <h4 class="title">${result.results[i].original_title}</h4>
                      </div>
                      <div class="rating">
                        <i class="fa-solid fa-star"></i>
                        <p class='rating__score'>${result.results[i].vote_average}</p>
                      </div>
                      <div class="movie-details">
                        <i class="fa-solid fa-circle-plus"></i>
                        <button type="button" class="watchlist-btn">Watchlist</button>
                      </div>
                      <div class="description">
                        <p class="paragraph">
                          ${result.results[i].overview}
                        </p>
                      </div>
                      <button class="read">Show more</button>
                      <button class="less">Show less</button>
                    </div>
                  </div>
                  `;
        console.log("rendering finished");
      }
    }
  } catch (error) {
    console.log(error);
  }
  checkLength();
}

function saveLocal() {
  localStorage.setItem("movieList", JSON.stringify(movieList));
}

function getLocalStorage() {
  const movies = JSON.parse(localStorage.getItem("movieList"));
  if (movies) {
    movieList = movies.map(
      (movie) =>
        new Movie(movie.poster, movie.title, movie.rating, movie.overview)
    );
  } else {
    movieList = [];
  }
}

function removeLocalStorage(title) {
  const movies = JSON.parse(localStorage.getItem("movieList"));
  movieList = movies.filter((movie) => movie.title !== title);
  console.log(movieList);
  saveLocal();
}

export { removeLocalStorage, getLocalStorage, movieList, movies };
