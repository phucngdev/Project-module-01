let $ = document.querySelector.bind(document);
let $S = document.querySelectorAll.bind(document);

let cartLocalStorage = JSON.parse(localStorage.getItem("cart")) || [];
let orderLocalStorage = JSON.parse(localStorage.getItem("orders")) || [];
let userLoginLocalStorage = JSON.parse(localStorage.getItem("userLogin")) || {};
let userOrder = JSON.parse(localStorage.getItem("userOrder")) || [];

// lấy api địa chỉ
var citis = document.getElementById("city");
var districts = document.getElementById("district");
var wards = document.getElementById("ward");
var Parameter = {
  url: "https://raw.githubusercontent.com/kenzouno1/DiaGioiHanhChinhVN/master/data.json",
  method: "GET",
  responseType: "application/json",
};
var promise = axios(Parameter);
promise.then(function (result) {
  renderCity(result.data);
});

function renderCity(data) {
  data.forEach((item) => {
    citis.options[citis.options.length] = new Option(item.Name, item.Id);
  });
  citis.onchange = function () {
    district.length = 1;
    ward.length = 1;
    if (this.value != "") {
      const result = data.filter((n) => n.Id === this.value);
      result[0].Districts.forEach((item) => {
        district.options[district.options.length] = new Option(
          item.Name,
          item.Id
        );
      });
    }
  };
  district.onchange = function () {
    ward.length = 1;
    const dataCity = data.filter((n) => n.Id === citis.value);
    if (this.value != "") {
      const dataWards = dataCity[0].Districts.filter(
        (n) => n.Id === this.value
      )[0].Wards;
      dataWards.forEach((item) => {
        wards.options[wards.options.length] = new Option(item.Name, item.Id);
      });
    }
  };
}

let totalProducts = 0;
if (userLoginLocalStorage.active === "Đang hoạt động") {
  userLoginLocalStorage.cart.forEach((item) => {
    let price = item.priceat;
    let numberPrice = parseFloat(price.replace(/[^\d]/g, ""));
    totalProducts = totalProducts + numberPrice;
  });
} else {
  cartLocalStorage.forEach((item) => {
    let price = item.priceat;
    let numberPrice = parseFloat(price.replace(/[^\d]/g, ""));
    totalProducts = totalProducts + numberPrice;
  });
}
let totalBill = totalProducts + 20000;
totalProducts = new Intl.NumberFormat("vi-VN", {
  style: "currency",
  currency: "VND",
}).format(totalProducts);
totalBill = new Intl.NumberFormat("vi-VN", {
  style: "currency",
  currency: "VND",
}).format(totalBill);
$("#totalProducts").innerHTML = totalProducts;
$("#totalBill").innerHTML = totalBill;

let valueCity;
let valueDistrict;
let valueWards;
$("#btnSubmitOrder").addEventListener("click", () => {
  let selectCity = citis.options[citis.selectedIndex];
  valueCity = selectCity.textContent;
  let selectDistrict = districts.options[districts.selectedIndex];
  valueDistrict = selectDistrict.textContent;
  let selectWards = wards.options[wards.selectedIndex];
  valueWards = selectWards.textContent;
  if (
    $("#username").value === "" ||
    $("#phone").value === "" ||
    $("#address").value === "" ||
    valueCity == "Chọn tỉnh thành" ||
    valueDistrict == "Chọn quận huyện" ||
    valueWards == "Chọn phường xã"
  ) {
    validateInput("#username", "#errUser");
    validateInput("#phone", "#errPhone");
    validateInput("#address", "#errAddress");
    validateSelect(valueCity, "#city", "Chọn tỉnh thành");
    validateSelect(valueDistrict, "#district", "Chọn quận huyện");
    validateSelect(valueWards, "#ward", "Chọn phường xã");
  } else {
    if (userLoginLocalStorage.active === "Đang hoạt động") {
      const newOrderUser = {
        id: uuidv4(),
        name: $("#username").value,
        phone: $("#phone").value,
        address: $("#address").value,
        city: valueCity,
        district: valueDistrict,
        ward: valueWards,
        products: userLoginLocalStorage.cart,
        totalBill: totalBill,
        orderStatus: "Đang chờ xử lý",
        created: new Date(),
      };
      orderLocalStorage.unshift(newOrderUser);
      localStorage.setItem("orders", JSON.stringify(orderLocalStorage));
      userOrder.unshift(orderLocalStorage[0]);
      localStorage.setItem("userOrder", JSON.stringify(userOrder));
      // ko bt sao userLoginLocalStorage.order nó lại là cái obj
      const arrOrderUser = Object.values(userLoginLocalStorage.order);
      const newData = {
        ...userLoginLocalStorage,
        order: arrOrderUser.concat(userOrder),
      };
      localStorage.setItem("userLogin", JSON.stringify(newData));
      let userData = JSON.parse(localStorage.getItem("users")) || [];
      const findToSave = userData.find(
        (user) => user.id === userLoginLocalStorage.id
      );
      if (findToSave) {
        const indexUser = userData.indexOf(findToSave);
        userData[indexUser] = newData;
        localStorage.setItem("users", JSON.stringify(userData));
      }
    } else {
      const newOrder = {
        id: uuidv4(),
        name: $("#username").value,
        phone: $("#phone").value,
        address: $("#address").value,
        city: valueCity,
        district: valueDistrict,
        ward: valueWards,
        products: cartLocalStorage,
        totalBill: totalBill,
        created: new Date(),
      };
      orderLocalStorage.unshift(newOrder);
      localStorage.setItem("orders", JSON.stringify(orderLocalStorage));
    }
    $("#modalSuccess").style.display = "flex";
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
function validateSelect(select, option, text) {
  if (select == text) {
    $(option).classList.add("border-red");
  } else {
    $(option).classList.remove("border-red");
  }
}

// render product trong bill
function renderProductsBuy(data) {
  const itemProducts = data.map((item) => {
    return `
      <div class="itemBuy">
        <div class="nameProductBuy">
          <div class="image">
            <img
              src="${item.image}"
              alt=""
            />
            <span class="quantity_item">1</span>
          </div>
          <div class="nameProductBuy">
            <h6>${item.name}</h6>
          </div>
        </div>
        <div class="priceProductBuy">
          <span>${item.priceat}</span>
        </div>
      </div>
    `;
  });
  const itemProduct = itemProducts.join(" ");
  $("#listBuy").innerHTML = itemProduct;
}

if (userLoginLocalStorage.active === "Đang hoạt động") {
  $("#user").style.display = "none";
  renderProductsBuy(userLoginLocalStorage.cart);
} else {
  $("#user").style.display = "flex";
  renderProductsBuy(cartLocalStorage);
}
$("#btnHome").addEventListener("click", () => {
  if (userLoginLocalStorage.active === "Đang hoạt động") {
    location.href = "./home.html";
  } else {
    location.href = "./index.html";
  }
});
$("#btnProducts").addEventListener("click", () => {
  if (userLoginLocalStorage.length === 0) {
    location.href = "./products.html";
  } else {
    location.href = "./productsLogin.html";
  }
});
$("#btnCtn").addEventListener("click", () => {
  if (userLoginLocalStorage.active === "Đang hoạt động") {
    location.href = "./home.html";
  } else {
    location.href = "./index.html";
  }
});
