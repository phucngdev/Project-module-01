let $ = document.querySelector.bind(document);

$("#formLogin").addEventListener("submit", (e) => {
  e.preventDefault();
  if ($("#floatingInput").value === "" || $("#floatingPassword").value === "") {
    validateInput("#floatingInput", "#errUser");
    validateInput("#floatingPassword", "#errPass");
  } else {
    const userLocal = JSON.parse(localStorage.getItem("users")) || [];
    const findUser = userLocal.find(
      (user) =>
        user.userName === $("#floatingInput").value &&
        user.passWord === $("#floatingPassword").value
    );
    if (findUser) {
      if (findUser.type === "admin") {
        localStorage.setItem("adminLogin", JSON.stringify(findUser));
        window.location.href = "./pages/admin/home.html";
      } else {
        localStorage.setItem("userLogin", JSON.stringify(findUser));
        setTimeout(() => {
          window.location.href = "./pages/user/home.html";
        }, 1000);
      }
    } else {
      if (
        $("#floatingInput").value !== "" &&
        $("#floatingPassword").value !== ""
      ) {
        $("#errLogin").style.display = "block";
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
