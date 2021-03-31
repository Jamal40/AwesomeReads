const fillers = document.querySelectorAll(".filler");

for (let filler of fillers) {
  let rating = Number(filler.getAttribute("data-rating"));
  getBillerWidthFromrating(rating, filler);
  // rating *= 125 / 5;
  // filler.style.width = `${rating}px`;
  // console.log(filler);
}

const headers = document.querySelectorAll(".bookName");
for (let header of headers) {
  header.addEventListener("click", (e) => {
    const bookId = e.target.getAttribute("data-bookid");
    open(`/api/books/${bookId}`, "_Self");
  });
}

const lovedButton = document.querySelector(".loved");
const fullButton = document.querySelector(".full-list");

lovedButton.addEventListener("click", (e) => {
  lovedButton.classList.add("active");
  fullButton.classList.remove("active");
});
fullButton.addEventListener("click", (e) => {
  fullButton.classList.add("active");
  lovedButton.classList.remove("active");
});

const searchForm = document.querySelector(".searchForm");
const searchBtn = document.querySelector(".search-btn");

searchBtn.addEventListener("click", () => {
  searchForm.submit();
});

function getBillerWidthFromrating(rate, filler) {
  let fullStars = Math.floor(rate);
  let partialStar = rate - fullStars;
  let width;
  if (partialStar > 0.5) {
    console.log("dd");
    width =
      fullStars * 25 +
      28.7174588749259 * Math.pow(partialStar - 0.5, 1.2) +
      12.5;
  }
  if (partialStar <= 0.5) {
    console.log("ftt");
    width = fullStars * 25 + 12.5 * Math.sqrt(2 * partialStar);
  }

  filler.style.width = `${width}px`;
}
