const API_KEY = SECRET_API_KEY;

const IMAGE_URL = "https://image.tmdb.org/t/p/w500";

const url = `https://api.themoviedb.org/3/search/multi?api_key=${API_KEY}`;

//Selecting elements from the DOM
const buttonElement = document.querySelector("#search");
const inputElement = document.querySelector("#inputValue");
const movieSearchable = document.querySelector("#movies-searchable");

let averageRatingVote = 0;

function generateUrl(path) {
  const url = `https://api.themoviedb.org/3${path}?api_key=${API_KEY}`;
  return url;
}

// maps movie section
function movieSection(movies) {
  return movies
    .map((movie) => {
      if (movie.poster_path)
        return `
        <div class="image">
          <img class="movie-poster" src=${
            IMAGE_URL + movie.poster_path
          } data-movie-id=${movie.id}/>
          
        </div>
      

        `;
    })
    .join("");
}

// function AverageRating(reviews) {
//   let averageRating = 0;
//   let sum = 0;
//   for (let i = 0; i < reviews.length; i++) {
//     // sum += reviews.results.author_details.rating;
//     const review = reviews[i];
//     console.log(review.author_details.rating);
//     sum += review.author_details.rating;
//   }
//   console.log("Sum: ", sum);
//   averageRating = sum / reviews.length;
//   console.log("average", averageRating);
//   return averageRating;
// }

//maps reviews section

function format(input) {
  var date = new Date(input);
  return [
    ("0" + date.getDate()).slice(-2),
    ("0" + (date.getMonth() + 1)).slice(-2),
    date.getFullYear(),
  ].join("/");
}
function reviewSection(reviews) {
  let averageRating = 0;
  let sum = 0;
  for (let i = 0; i < reviews.length; i++) {
    // sum += reviews.results.author_details.rating;
    const review = reviews[i];
    console.log(review.author_details.rating);
    if (review.author_details.rating !== null) {
      sum += review.author_details.rating;
    }
  }
  console.log("Sum: ", sum);
  averageRating = sum / reviews.length;
  console.log("average", averageRating);

  // const movieBlock = createMovieContainer(movies);
  // movieSearchable.appendChild(movieBlock);
  const averageBlock = AverageRatingContainer(
    reviews.length > 0 ? averageRating : ""
  );
  movieSearchable.appendChild(averageBlock);

  if (reviews.length <= 0) {
    return "<div class='no-reviews'><p>There are no reviews</p></div>";
  }
  return reviews
    .map((review) => {
      if (review.content) {
        return `
        <div class="reviews">
        <div class="line-break"></div>
          <div class="rows">
            <div class="row">
              <div class="author-info">
                <p class="author">Author: <br>${review.author}</br></p>
                <img class="profile-pic" src=${
                  review.author_details.avatar_path
                    ? IMAGE_URL + review.author_details.avatar_path
                    : ""
                }>
                <p class="created-at">Created At: <br>${format(
                  review.created_at
                )}</br></p>
            
              </div>
              <div class="content">
                <p class="author-rating">Author Rating: ${
                  review.author_details.rating
                    ? review.author_details.rating
                    : "No Rating"
                }</p>
                <p class="review-content">${review.content}</p>
              </div>
            </div>
          </div>
        </div>
  
          `;
      }
    })
    .join("");
}

// A container that conatins the average rating
function AverageRatingContainer(average) {
  total = Math.round(average);
  const averageElement = document.createElement("div");
  averageElement.setAttribute("class", "average");

  const averageTemplate =
    average > 0
      ? `
    <p class="average-review-rating">Average Review Rating: ${total}</p>`
      : `<p></p>`;

  averageElement.innerHTML = averageTemplate;
  return averageElement;
}

// create movie poster container
function createMovieContainer(movies) {
  const movieElement = document.createElement("div");
  movieElement.setAttribute("class", "movie");

  const movieTemplate = `  
    <section class="section">
        ${movieSection(movies)}
    </section>
    <div class="content">
    <p id="content-close"></p>
    </div>`;

  movieElement.innerHTML = movieTemplate;
  return movieElement;
}

function renderSearchMovies(data) {
  movieSearchable.innerHTML = "";
  const movies = data.results;
  const movieBlock = createMovieContainer(movies);
  movieSearchable.appendChild(movieBlock);
  inputElement.value = "";
  console.log("Data: ", data);
}

function renderReviewMovies(data) {
  movieSearchable.innerHTML = "";
  const reviews = data.results;
  const reviewBlock = createReviewDiv(reviews);
  movieSearchable.appendChild(reviewBlock);
  inputElement.value = "";
  console.log("Data: ", data);
}

// Fetches the multi database when searched
buttonElement.onclick = function (event) {
  event.preventDefault();
  const value = inputElement.value;
  const path = "/search/multi";

  const newUrl = generateUrl(path) + "&query=" + value;

  fetch(newUrl)
    .then((res) => res.json())
    .then((data) => {
      renderSearchMovies(data);
    })
    .catch((error) => {
      console.log("Error", error);
    });
};

// Fetches the review database when searched
// buttonElement.onclick = function (event) {
//   event.preventDefault();
//   const target = event.target;
//   const value = inputElement.value;
//   const movieId = target.dataset.movieId;
//   const path = "/search/multi";

//   const newUrl = generateUrl(path) + "&query=" + value;

//   fetch(newUrl)
//     .then((res) => res.json())
//     .then((data) => {
//       renderSearchMovies(data);
//     })
//     .catch((error) => {
//       console.log("Error", error);
//     });
//};

// Create review container

function numOfReviews(reviews) {
  if (reviews.length > 0) {
    return `<p class='num-reviews'>Number of reviews: ${reviews.length}</p>`;
  }
  return `<p> </p>`;
}
function createReviewDiv(reviews) {
  const reviewElement = document.createElement("div");
  reviewElement.setAttribute("class", "review");

  const reviewTemplate = `  
  ${numOfReviews(reviews)}
  <section class="review-section">
    ${reviewSection(reviews)}
  </section>
  <div class="content">
  <p id="content-close"></p>
  </div>`;

  reviewElement.innerHTML = reviewTemplate;
  return reviewElement;
}

document.onclick = function (event) {
  const target = event.target;
  if (target.tagName.toLowerCase() === "img") {
    const movieId = target.dataset.movieId;
    console.log("Movie Id: ", movieId);

    const path = `/movie/${movieId}/reviews`;
    const url = generateUrl(path);

    // fetch movie reviews
    fetch(url)
      .then((res) => res.json())
      .then((data) => {
        console.log("Reviews: ", data);
        renderReviewMovies(data);
        // const reviews = data.results;

        // for (let i = 0; i < length; i++) {
        //   const review = reviews[i];
        // }
      })
      .catch((error) => {
        console.log("Error", error);
      });
  }
};
