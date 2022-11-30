import {
  removeLocalStorage,
  getLocalStorage,
  movieList,
  movies,
} from "./index.js";

getLocalStorage();
console.log(movieList);

function renderMovies() {
  if (movieList.length === 0) {
    movies.innerHTML = "";
    document.querySelector(".empty").classList.remove("active");
  } else {
    document.querySelector(".form").style.display = "none";
    document.querySelector(".empty").classList.add("active");
    movies.innerHTML = "";
    for (let i = 0; i < movieList.length; i++) {
      movies.innerHTML += `
                       <div class="movie">
                        <div class="image">
                          <img
                              src="https://image.tmdb.org/t/p/original/${movieList[i].poster}"
                              alt=""
                              class="movies__poster"
                            />
                        </div>
                        <div class="details">
                          <div class="movie__title-rating">
                            <h4 class="title">${movieList[i].title}</h4>
                          </div>
                          <div class="rating">
                            <i class="fa-solid fa-star"></i>
                            <p class='rating__score'>${movieList[i].rating}</p>
                          </div>
                          <div class="remove">
                            <i class="fa-solid fa-circle-minus"></i>
                            <button type="button" class="remove-btn">Remove</button>
                          </div>
                          <div class="description">
                            <p class="paragraph">
                              ${movieList[i].overview}
                            </p>
                          </div>
                          <button class="read">Show more</button>
                          <button class="less">Show less</button>
                        </div>
                      </div>
                      `;
    }
  }
}

document.addEventListener("click", (e) => {
  const target = e.target.closest(".remove-btn");
  if (target) {
    const title = e.target
      .closest(".details")
      .querySelector(".title").textContent;
    removeLocalStorage(title);
    renderMovies();
  } else {
    return;
  }
});

renderMovies();
