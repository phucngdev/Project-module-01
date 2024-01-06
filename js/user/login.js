let $ = document.querySelector.bind(document);

$("#formLogin").addEventListener("submit", (e) => {
  e.preventDefault();
  if ($("#username").value === "" || $("#password").value === "") {
    validateInput("#username", "#errUser");
    validateInput("#password", "#errPass");
  } else {
    const userLocal = JSON.parse(localStorage.getItem("users")) || [];
    const findUser = userLocal.find(
      (user) =>
        user.username === $("#username").value &&
        user.password === $("#password").value
    );
    if (findUser && findUser.active === 1) {
      if (findUser.type === "admin") {
        localStorage.setItem("adminLogin", JSON.stringify(findUser));
        window.location.href = "./pages/admin/home.html";
      } else {
        localStorage.setItem("userLogin", JSON.stringify(findUser));
        setTimeout(() => {
          window.location.href = "./pages/user/home.html";
        }, 1000);
      }
    } else if (findUser && findUser.active === 0) {
      $("#errLogin").style.display = "none";
      $("#errLoginErr").style.display = "block";
    } else {
      if ($("#username").value !== "" && $("#password").value !== "") {
        $("#errLogin").style.display = "block";
        $("#errLoginErr").style.display = "none";
        $("#errPass").style.display = "none";
        $("#errUser").style.display = "none";
      }
    }
  }
});

// check input và hiện thông báo
function validateInput(inputId, errorId) {
  const inputValue = $(inputId).value;
  const errorInput = $(errorId);
  if (inputValue === "") {
    errorInput.style.display = "block";
    $(inputId).classList.add("border-red");
  } else {
    errorInput.style.display = "none";
    $(inputId).classList.remove("border-red");
  }
}
