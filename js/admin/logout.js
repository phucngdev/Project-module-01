let account = JSON.parse(localStorage.getItem("adminLogin")) || {};

const btnModalLogout = document.querySelector("#btnModalLogout");
const modalLogOut = document.querySelector("#modalLogOut");
const btnLogout = document.querySelector("#btnLogout");
btnModalLogout.addEventListener("click", (e) => {
  e.stopPropagation();
  modalLogOut.style.display = "flex";
});
window.addEventListener("click", () => {
  if (modalLogOut.style.display === "flex") {
    modalLogOut.style.display = "none";
  }
});

btnLogout.addEventListener("click", () => {
  localStorage.removeItem("adminLogin");

  account = {};
  window.location.href = "../../pages/user/index.html";
});
