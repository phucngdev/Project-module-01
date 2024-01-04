let account = JSON.parse(localStorage.getItem("adminLogin")) || {};
const btnLogout = document.querySelector("#btnLogout");
btnLogout.addEventListener("click", () => {
  localStorage.removeItem("adminLogin");

  account = {};
  window.location.href = "../../pages/user/index.html";
});
