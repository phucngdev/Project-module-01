let productsLocalStorage = JSON.parse(localStorage.getItem("products")) || [];
let categoryLocalStorage = JSON.parse(localStorage.getItem("category")) || [];

// phân trang
const itemsPerPage = 12;
let currentPage = 1;
prevPage(productsLocalStorage);
nextPage(productsLocalStorage);
function displayProduct(page, data) {
  const startIndex = (page - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const displayItems = data.slice(startIndex, endIndex);
  renderProducts(displayItems);
}

$("#numberCurrentPage").innerHTML = currentPage;

function prevPage(data) {
  $("#prev").addEventListener("click", () => {
    if (currentPage > 1) {
      currentPage--;
      displayProduct(currentPage, data);
      $("#numberCurrentPage").innerHTML = currentPage;
    }
  });
}

function nextPage(data) {
  $("#next").addEventListener("click", () => {
    const maxPage = Math.ceil(data.length / itemsPerPage);

    if (currentPage < maxPage) {
      currentPage++;
      displayProduct(currentPage, data);
    }
    $("#numberCurrentPage").innerHTML = currentPage;
  });
}

renderProducts(productsLocalStorage);
displayProduct(currentPage, productsLocalStorage);

// ẩn hiện phân trang
function handleCurrent() {
  if (productsLocalStorage.length === 0) {
    $("#current").style.display = "none";
  } else {
    $("#current").style.display = "flex";
  }
}
handleCurrent();

// đóng mửo modal chi tiết sản phẩm
$("#modalDetail").addEventListener("click", (e) => {
  e.stopPropagation();
  if ($("#modalDetail").style.display === "block") {
    $("#modalDetail").style.display = "block";
  }
});
$("#closeModal").addEventListener("click", () => {
  $("#modalDetail").style.display = "none";
});
window.addEventListener("click", () => {
  // modal chi tiết
  if ($("#modalDetail").style.display === "block") {
    $("#modalDetail").style.display = "none";
  }
  // modal order
  if ($("#modalOrder").style.display === "block") {
    $("#modalOrder").style.display = "none";
  }
});

// render danh mục
function renderCategory() {
  const categoryList = categoryLocalStorage.map((category) => {
    return `
      <li key="${category.id}" class="itemCategory"><button class="btnCategory" id="${category.name}">${category.name}</button></li>
    `;
  });
  const categoryItem = categoryList.join(" ");
  $("#listCategory").innerHTML = categoryItem;

  $S(".btnCategory").forEach((button) => {
    button.addEventListener("click", (e) => {
      e.stopPropagation();
      const categoryValue = button.id;
      categoryProducts(categoryValue);
    });
  });
}
renderCategory();

$("#productsAll").addEventListener("click", () => {
  renderProducts(productsLocalStorage);
  displayProduct(currentPage, productsLocalStorage);
  $("#current").style.display = "flex";
});

function categoryProducts(id) {
  let indexCategory = productsLocalStorage.filter(
    (category) => category.category === id
  );
  renderProducts(indexCategory);
  $("#current").style.display = "none";
}

// render list products
function renderProducts(data) {
  const productsList = data.map((product) => {
    return `
      <div key="${product.id}"  id="${product.id}" class="itemProduct">
        <img src="${product.image}" alt=""/>
        <div class="productCart">
          <div class="productInfo">
            <span>${product.name}</span>
            <h3>${product.priceat}</h3>
          </div>
          <button name="${product.id}" class="addToCart">
            <i class="fas fa-cart-plus"></i>
            <div class="animation-click" id="${
              product.id + 2
            }">Thêm thành công</div>
          </button>
        </div>
      </div>
    `;
  });
  const productItem = productsList.join(" ");
  $("#listProducts").innerHTML = productItem;

  $S(".addToCart").forEach((button) => {
    button.addEventListener("click", (e) => {
      e.stopPropagation();
      const productName = button.name;
      addCartBtn(productName);
    });
  });
  $S(".itemProduct").forEach((item) => {
    item.addEventListener("click", (e) => {
      e.stopPropagation();
      const productId = item.id;
      if ($("#modalDetail").style.display === "block") {
        $("#modalDetail").style.display = "none";
      } else {
        $("#modalDetail").style.display = "block";
      }
      printInfoProduct(productId);
    });
  });
}

// lấy id product
function getID(id) {
  let printProduct = productsLocalStorage.filter(
    (product) => product.id === id
  );
  return printProduct;
}

// add bằng btn trong modal
function printInfoProduct(productID) {
  let itemProduct = getID(productID);
  $("#imgDetailProduct").src = itemProduct[0].image;
  $("#nameProduct").innerHTML = itemProduct[0].name;
  $("#priceProduct").innerHTML = itemProduct[0].priceat;
  $("#descriptionProduct").innerHTML = itemProduct[0].description;

  const addToCartButton = $(".btnAddToCart");
  const clonedElement = addToCartButton.cloneNode(true);
  addToCartButton.parentNode.replaceChild(clonedElement, addToCartButton);
  clonedElement.addEventListener(
    "click",
    userLoginLocalStorage.active === "Đang hoạt động"
      ? addToCartClickHandlerUser
      : addToCartClickHandler
  );
  function addToCartClickHandler() {
    cartLocalStorage.push(itemProduct[0]);
    localStorage.setItem("cart", JSON.stringify(cartLocalStorage));
    renderCart(cartLocalStorage);
  }
  function addToCartClickHandlerUser() {
    cartUser.push(itemProduct[0]);
    localStorage.setItem("cartUser", JSON.stringify(cartUser));
    renderCart(cartUser);
  }
}

// add bằng icon
function addCartBtn(productID) {
  let itemProductAdd = getID(productID);
  if (userLoginLocalStorage.active === "Đang hoạt động") {
    cartUser.push(itemProductAdd[0]);
    localStorage.setItem("cartUser", JSON.stringify(cartUser));
    renderCart(cartUser);
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
    cartLocalStorage.push(itemProductAdd[0]);
    localStorage.setItem("cart", JSON.stringify(cartLocalStorage));
    renderCart(cartLocalStorage);
    checkCart(cartLocalStorage);
  }
}

// tìm kiếm
$("#search").addEventListener("input", () => {
  let inputSearch = $("#search").value.toLowerCase();
  if (inputSearch != "") {
    const returnSearch = productsLocalStorage.filter((product) => {
      const productName = product.name.toLowerCase();
      return productName.includes(inputSearch);
    });
    renderProducts(returnSearch);
    $("#current").style.display = "none";
  } else {
    renderProducts(productsLocalStorage);
    displayProduct(currentPage, productsLocalStorage);
    $("#current").style.display = "flex";
  }
});

// ẩn hiện phân trang
function handleCurrent() {
  if (productsLocalStorage.length === 0) {
    $("#current").style.display = "none";
  } else {
    $("#current").style.display = "flex";
  }
}
handleCurrent();
