let $ = document.querySelector.bind(document);
let $S = document.querySelectorAll.bind(document);

let userLoginLocalStorage = JSON.parse(localStorage.getItem("userLogin")) || {};
let cartLocalStorage = JSON.parse(localStorage.getItem("cart")) || [];
let userData = JSON.parse(localStorage.getItem("users")) || [];
let cartUser = JSON.parse(localStorage.getItem("cartUser")) || [];

if (userLoginLocalStorage.active === "Đang hoạt động") {
  cartUser = userLoginLocalStorage.cart;
  renderCart(cartUser);
  checkCart(cartUser);
} else {
  checkCart(cartLocalStorage);
}

// đóng mở modal cart
$("#btn-cart").addEventListener("click", (e) => {
  e.stopPropagation();
  if ($("#modalCart").style.display === "none") {
    $("#modalCart").style.display = "block";
  } else {
    $("#modalCart").style.display = "none";
  }
});
$("#modalCart").addEventListener("click", (e) => {
  e.stopPropagation();
  $("#modalCart").style.display = "block";
});
window.addEventListener("click", () => {
  if (($("#modalCart").style.display = "block")) {
    $("#modalCart").style.display = "none";
  }
});

// render sản phẩm trong cart
function renderCart(data) {
  let listCart = data.map((product) => {
    return `
      <tr>
        <td class="imgCart">
          <img src="${product.image}" alt=""/>
        </td>
        <td class="nameProductCart">${product.name}</td>
        <td>
          <div class="quantityCart">
            <button class="reduce" id="${product.id}">-</button>
            <input
              type="number"
              class="quantityProductCart"
              id="${product.quantity}"
              value="1"
              readonly
            />
            <button class="increase" name="${product.id}">+</button>
          </div>
        </td>
        <td>${product.priceat}</td>
        <td>
          <button class="btnDelete" id="${product.id + 1}">Xoá</button>
        </td>
      </tr>
    `;
  });

  const productItemCart = listCart.join(" ");
  $("#tbody").innerHTML = productItemCart;

  // xoá sản phẩm khỏi cart
  $S(".btnDelete").forEach((button) => {
    button.addEventListener("click", (e) => {
      e.stopPropagation();
      const productDelete = button.id;
      if (userLoginLocalStorage.active === "Đang hoạt động") {
        deleteProductCartUser(productDelete);
        checkCart(cartUser);
        const newData = {
          ...userLoginLocalStorage,
          cart: cartUser,
        };
        localStorage.setItem("userLogin", JSON.stringify(newData));
        const findToSave = userData.find(
          (user) => user.id === userLoginLocalStorage.id
        );
        if (findToSave) {
          const indexUser = userData.indexOf(findToSave);
          userData[indexUser] = newData;
          localStorage.setItem("users", JSON.stringify(userData));
        }
      } else {
        deleteProductCart(productDelete);
        checkCart(cartLocalStorage);
      }
    });
  });
  // $S(".reduce").forEach((button) => {
  //   button.addEventListener("click", (e) => {
  //     e.stopPropagation();
  //     const productReduce = button.id;
  //     console.log(productReduce);
  //   });
  // });
  // $S(".increase").forEach((button) => {
  //   button.addEventListener("click", (e) => {
  //     e.stopPropagation();
  //     const productIncrease = button.name;
  //     console.log(productIncrease);
  //   });
  // });
}
// renderCart(cartLocalStorage);

function deleteProductCart(buttonId) {
  let cartLocal = cartLocalStorage.filter(
    (product) => product.id + 1 != buttonId
  );
  localStorage.setItem("cart", JSON.stringify(cartLocal));
  cartLocalStorage = cartLocal;
  renderCart(cartLocalStorage);
}

function deleteProductCartUser(buttonId) {
  let cartLocalUser = cartUser.filter((product) => product.id + 1 != buttonId);
  localStorage.setItem("cartUser", JSON.stringify(cartLocalUser));
  cartUser = cartLocalUser;
  renderCart(cartUser);
}

function checkCart(data) {
  if (Array.isArray(data) && data.length > 0) {
    $("#notProduct").style.display = "none";
    $("#buy").style.display = "flex";
  } else {
    $("#notProduct").style.display = "flex";
    $("#buy").style.display = "none";
  }
}
