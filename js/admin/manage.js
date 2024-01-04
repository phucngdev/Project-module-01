let $ = document.querySelector.bind(document);
let $S = document.querySelectorAll.bind(document);

$("#btnAdd").addEventListener("click", (e) => {
  e.stopPropagation();
  $("#modalAdd").style.display = "block";
});

$("#modalAdd").addEventListener("click", (e) => {
  e.stopPropagation();
  $("#modalAdd").style.display = "block";
});

$("#closeIcon").addEventListener("click", (e) => {
  e.stopPropagation();
  $("#modalAdd").style.display = "none";
  $("#username").value = "";
  $("#password").value = "";
});

window.addEventListener("click", () => {
  if ($("#modalAdd").style.display === "block") {
    $("#modalAdd").style.display = "none";
  }
});

$("#formAddNewUser").addEventListener("submit", (e) => {
  e.preventDefault();
  if ($("#username").value === "" || $("#password").value === "") {
    if ($("#username").value === "") {
      $("#errUser").style.display = "block";
      $("#username").classList.add("border-red");
    }
    if ($("#username").value !== "") {
      $("#errUser").style.display = "none";
      $("#username").classList.remove("border-red");
    }
    if ($("#password").value === "") {
      $("#errPass").style.display = "block";
      $("#password").classList.add("border-red");
    }
    if ($("#password").value !== "") {
      $("#errPass").style.display = "none";
      $("#password").classList.remove("border-red");
    }
  } else {
    const usersLocal = JSON.parse(localStorage.getItem("users")) || [];
    const userName = $("#username").value;
    const passWord = $("#password").value;
    const type = $("#type").value;
    const newUser = {
      id: Math.random() * 1000,
      userName: userName,
      passWord: passWord,
      active: "Đang hoạt động",
      type: type,
    };
    usersLocal.push(newUser);
    localStorage.setItem("users", JSON.stringify(usersLocal));
    $("#modalAdd").style.display = "none";
    $("#username").value = "";
    $("#password").value = "";
    window.location.reload();
  }
});

let usersLocalStore = JSON.parse(localStorage.getItem("users")) || [];

function deleteUser(userId) {
  usersLocalStore = usersLocalStore.filter((user) => user.id != userId);
  localStorage.setItem("users", JSON.stringify(usersLocalStore));
  renderUserLocal();
}

function renderUserLocal() {
  const trUsers = usersLocalStore.map((user, index) => {
    return `
    <tr key="${user.id}">
      <td>${index + 1}</td>
      <td>${user.userName}</td>
      <td>${user.passWord}</td>
      <td>${user.active}</td>
      <td>${user.type}</td>
      <td><button class="btn btn-warning">Chặn</button></td>
      <td><button class="btn btn-danger delete-user" id="${
        user.id
      }">Xoá</button></td>
    </tr>
    `;
  });
  const trUser = trUsers.join(" ");
  $("#tbody").innerHTML = trUser;

  $S(".delete-user").forEach((button) => {
    button.addEventListener("click", () => {
      const userId = button.id;
      deleteUser(userId);
    });
  });
}
renderUserLocal();
