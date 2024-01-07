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
    const newUser = {
      id: uuidv4(),
      username: $("#username").value,
      password: $("#password").value,
      active: 1,
      type: $("#type").value,
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
function blockUser(userId) {
  let userBlock = usersLocalStore.find((user) => user.id === userId);
  const newData = {
    ...userBlock,
    active: 0,
  };
  const findToSave = usersLocalStore.find((user) => user.id === userBlock.id);
  if (findToSave) {
    const indexUser = usersLocalStore.indexOf(findToSave);
    usersLocalStore[indexUser] = newData;
    localStorage.setItem("users", JSON.stringify(usersLocalStore));
  }
  renderUserLocal();
}
function unBlockUser(userId) {
  let userBlock = usersLocalStore.find((user) => user.id === userId);
  if (userBlock.active === 0) {
    const newData = {
      ...userBlock,
      active: 1,
    };
    const findToSave = usersLocalStore.find((user) => user.id === userBlock.id);
    if (findToSave) {
      const indexUser = usersLocalStore.indexOf(findToSave);
      usersLocalStore[indexUser] = newData;
      localStorage.setItem("users", JSON.stringify(usersLocalStore));
    }
    renderUserLocal();
  }
}

function renderUserLocal() {
  const trUsers = usersLocalStore.map((user, index) => {
    return `
    <tr key="${user.id}">
      <td>${index + 1}</td>
      <td>${user.username}</td>
      <td>${user.password}</td>
      <td>${user.active === 0 ? "Tài khoản bị chặn" : "Đang đoạt động"}</td>
      <td>${user.type}</td>
      <td><button class="btn btn-warning block-user" name="${
        user.id
      }">Chặn</button></td>
      <td><button class="btn btn-info unblock-user" name="${
        user.id
      }">Bỏ chặn</button></td>
      <td><button class="btn btn-danger delete-user" id="${
        user.id
      }">Xoá</button></td>
    </tr>
    `;
  });
  const trUser = trUsers.join(" ");
  $("#tbody").innerHTML = trUser;

  $S(".delete-user").forEach((button) => {
    button.addEventListener("click", (e) => {
      e.stopPropagation();
      const userId = button.id;
      $("#modalDelete").style.display = "flex";
      $("#submitDelete").addEventListener("click", () => {
        deleteUser(userId);
        $("#modalDelete").style.display = "none";
      });
    });
  });
  $S(".block-user").forEach((button) => {
    button.addEventListener("click", () => {
      const userId = button.name;
      blockUser(userId);
    });
  });
  $S(".unblock-user").forEach((button) => {
    button.addEventListener("click", () => {
      const userId = button.name;
      unBlockUser(userId);
    });
  });
}
renderUserLocal();
window.addEventListener("click", () => {
  if ($("#modalDelete").style.display === "flex") {
    $("#modalDelete").style.display = "none";
  }
});
