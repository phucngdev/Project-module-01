let $ = document.querySelector.bind(document);
$("#formLogin").addEventListener("submit", (e) => {
  e.preventDefault();
  if (
    $("#userName").value === "" ||
    $("#passWord").value === "" ||
    $("#repass").value === ""
  ) {
    validateInput("#userName", "#errUser");
    validateInput("#passWord", "#errPass");
    validateInput("#repass", "#errRePass");
  } else if ($("#repass").value !== $("#passWord").value) {
    $("#errRePassValue").style.display = "block";
    $("#repass").classList.add("border-red");
  } else {
    const usersLocal = JSON.parse(localStorage.getItem("users")) || [];
    const cartUser = JSON.parse(localStorage.getItem("cartUser")) || [];
    const orderUser = JSON.parse(localStorage.getItem("orderUser")) || [];
    const newUser = {
      id: uuidv4(),
      username: $("#userName").value,
      password: $("#passWord").value,
      active: 1,
      cart: cartUser,
      order: orderUser,
      type: "user",
    };
    usersLocal.push(newUser);
    localStorage.setItem("users", JSON.stringify(usersLocal));
    window.location.href = "./login.html";
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
