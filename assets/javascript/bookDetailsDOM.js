const fillers = document.querySelectorAll(".filler");

for (let filler of fillers) {
  let rating = Number(filler.getAttribute("data-rating"));
  rating *= 125 / 5;
  filler.style.width = `${rating}px`;
  // console.log(filler);
}

const images = document.querySelectorAll(".avatar-image");

for (let image of images) {
  image.src = `/images/avatars/${Math.floor(Math.random() * 6 + 1)}.jpg`;
}
