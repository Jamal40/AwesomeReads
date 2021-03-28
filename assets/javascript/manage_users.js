const roleFormBtns = document.querySelectorAll(".role-form-btn");

let i = 0;
for (const roleBtn of roleFormBtns) {
  const roleForm = document.querySelector(`.role-form[data-nth = '${i}']`);
  console.log(roleFormBtns);
  roleBtn.addEventListener("click", () => {
    roleForm.submit();
    console.log("Done");
  });
  i++;
}

const searchButton = document.querySelector(".search-btn");
const searchForm = document.querySelector(".searchForm");

searchButton.addEventListener("click", () => {
  searchForm.submit();
});

$(".ui.dropdown").dropdown();
