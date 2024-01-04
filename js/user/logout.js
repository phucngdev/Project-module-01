// let account = JSON.parse(localStorage.getItem("userLogin")) || {};
const btnLogout = document.querySelector("#btnLogout");
btnLogout.addEventListener("click", async () => {
  localStorage.removeItem("userLogin");
  localStorage.removeItem("cart");
  localStorage.removeItem("cartUser");
  localStorage.removeItem("userOrder");
  userLoginLocalStorage = {};
  window.location.href = "../../pages/user/index.html";
});
