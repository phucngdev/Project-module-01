import upload from "../../utils/firebase.config.js";

let $ = document.querySelector.bind(document);
let $S = document.querySelectorAll.bind(document);
let imageUrl = "";
let imageUrlEdit = "";

let productsLocalStorage = JSON.parse(localStorage.getItem("products")) || [];
let categoryLocalStorage = JSON.parse(localStorage.getItem("category")) || [];

// phân trang
const itemsPerPage = 5;
let currentPage = 1;
prevPage(productsLocalStorage);
nextPage(productsLocalStorage);
function displayProduct(page, data) {
  const startIndex = (page - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const displayItems = data.slice(startIndex, endIndex);
  renderProductsLocal(displayItems);
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

displayProduct(currentPage, productsLocalStorage);

// mở modal add
function handleOpenModal(e) {
  e.stopPropagation();
  $("#modalAddProduct").style.display = "block";
}

// đóng modal add
function handleCloseModal(e) {
  e.stopPropagation();
  $("#modalAddProduct").style.display = "none";
  resetForm();
}

$("#btnAddProduct").addEventListener("click", handleOpenModal);
$("#modalAddProduct").addEventListener("click", handleOpenModal);
$("#closeIconProduct").addEventListener("click", handleCloseModal);
$("#btnCancel").addEventListener("click", handleCloseModal);

// mở modal edit
function handleOpenModalEdit(e) {
  e.stopPropagation();
  $("#modalEditProduct").style.display = "block";
}

// đóng modal edit
function handleCloseModalEdit(e) {
  e.stopPropagation();
  $("#modalEditProduct").style.display = "none";
  resetForm();
  resetFormEdit();
}

$("#modalEditProduct").addEventListener("click", handleOpenModalEdit);
$("#closeIconEdit").addEventListener("click", handleCloseModalEdit);
$("#btnCancelEdit").addEventListener("click", handleCloseModalEdit);

// đóng modal khi click ra ngoài
function windowCloseModal(modal) {
  const modalClose = $(modal);
  window.addEventListener("click", () => {
    if ((modalClose.style.display = "block")) {
      modalClose.style.display = "none";
    }
    resetForm();
    resetFormEdit();
  });
}
windowCloseModal("#modalAddProduct");
windowCloseModal("#modalEditProduct");

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

// lấy ảnh form add
$("#file").addEventListener("change", async (e) => {
  $("#loadding").style.display = "flex";
  const getUrl = await upload(e.target);
  imageUrl = getUrl;
  $("#image").src = getUrl;
  $("#loadding").style.display = "none";
});

// submit form add
$("#formAddProduct").addEventListener("submit", (e) => {
  e.preventDefault();
  if (
    $("#file").value === "" ||
    $("#namePro").value === "" ||
    $("#codePro").value === "" ||
    $("#nccPro").value === "" ||
    $("#pbfPro").value === "" ||
    $("#patPro").value === "" ||
    $("#slPro").value === "" ||
    $("#descriptionPro").value === ""
  ) {
    validateInput("#file", "#errImage");
    validateInput("#namePro", "#errName");
    validateInput("#codePro", "#errCode");
    validateInput("#nccPro", "#errNcc");
    validateInput("#pbfPro", "#errPbf");
    validateInput("#patPro", "#errPat");
    validateInput("#slPro", "#errSl");
    validateInput("#descriptionPro", "#errDes");
  } else {
    let pricebf = $("#pbfPro").value;
    let priceat = $("#patPro").value;
    pricebf = new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(pricebf);
    priceat = new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(priceat);

    const newProduct = {
      id: uuidv4(),
      image: imageUrl,
      name: $("#namePro").value,
      barcode: $("#codePro").value,
      category: $("#catePro").value,
      ncc: $("#nccPro").value,
      pricebf: pricebf,
      priceat: priceat,
      quantity: $("#slPro").value,
      description: $("#descriptionPro").value,
      createdTime: new Date(),
    };
    productsLocalStorage.unshift(newProduct);
    localStorage.setItem("products", JSON.stringify(productsLocalStorage));
    $("#modalAddProduct").style.display = "none";
    resetForm();
    renderProductsLocal(productsLocalStorage);
    displayProduct(currentPage, productsLocalStorage);
    $("#current").style.display = "flex";
  }
});

// xoá sản phẩm
function deleteProduct(productId) {
  let productsLocal = productsLocalStorage.filter(
    (product) => product.id != productId
  );
  localStorage.setItem("products", JSON.stringify(productsLocal));
  productsLocalStorage = productsLocal;
  renderProductsLocal(productsLocalStorage);
  displayProduct(currentPage, productsLocalStorage);
}

// lấy ảnh form edit
$("#fileEdit").addEventListener("change", async (e) => {
  const getUrl = await upload(e.target);
  imageUrlEdit = getUrl;
  $("#imageEdit").src = getUrl;
});

// sửa sản phẩm
function getIndex(data) {
  let editProductsIndex = productsLocalStorage.filter(
    (product) => product.id === data
  );
  return editProductsIndex;
}
let itemProduct;
function editProduct(productName) {
  itemProduct = getIndex(productName);
  $("#imageEdit").src = itemProduct[0].image;
  $("#nameProEdit").value = itemProduct[0].name;
  $("#codeProEdit").value = itemProduct[0].barcode;
  $("#cateProEdit").value = itemProduct[0].category;
  $("#nccProEdit").value = itemProduct[0].ncc;
  $("#slProEdit").value = itemProduct[0].quantity;
  $("#descriptionProEdit").value = itemProduct[0].description;
  let numberPriceat = parseFloat(itemProduct[0].priceat.replace(/[^\d]/g, ""));
  let numberPricebf = parseFloat(itemProduct[0].pricebf.replace(/[^\d]/g, ""));
  $("#patProEdit").value = numberPriceat;
  $("#pbfProEdit").value = numberPricebf;

  $("#formEditProduct").addEventListener("submit", (e) => {
    e.preventDefault();
    if (
      $("#nameProEdit").value === "" ||
      $("#codeProEdit").value === "" ||
      $("#nccProEdit").value === "" ||
      $("#pbfProEdit").value === "" ||
      $("#patProEdit").value === "" ||
      $("#slProEdit").value === "" ||
      $("#descriptionProEdit").value === ""
    ) {
      validateInput("#nameProEdit", "#errNameEdit");
      validateInput("#codeProEdit", "#errCodeEdit");
      validateInput("#nccProEdit", "#errNccEdit");
      validateInput("#pbfProEdit", "#errPbfEdit");
      validateInput("#patProEdit", "#errPatEdit");
      validateInput("#slProEdit", "#errSlEdit");
      validateInput("#descriptionProEdit", "#errDesEdit");
    } else {
      numberPriceat = $("#patProEdit").value;
      numberPricebf = $("#pbfProEdit").value;
      numberPriceat = new Intl.NumberFormat("vi-VN", {
        style: "currency",
        currency: "VND",
      }).format(numberPriceat);
      numberPricebf = new Intl.NumberFormat("vi-VN", {
        style: "currency",
        currency: "VND",
      }).format(numberPricebf);
      if (imageUrlEdit === "") {
        imageUrlEdit = imageUrl;
      }
      if (fileEdit.files.length === 0) {
        imageUrlEdit = itemProduct[0].image;
      } else {
        imageUrlEdit = $("#imageEdit").src;
      }
      let newData = {
        ...itemProduct[0],
        image: imageUrlEdit,
        name: $("#nameProEdit").value,
        barcode: $("#codeProEdit").value,
        category: $("#cateProEdit").value,
        ncc: $("#nccProEdit").value,
        pricebf: numberPricebf,
        priceat: numberPriceat,
        quantity: $("#slProEdit").value,
        description: $("#descriptionProEdit").value,
        editedTime: new Date(),
      };
      let findToSaveIndex = productsLocalStorage.findIndex(
        (product) => product.id === newData.id
      );
      if (findToSaveIndex !== -1) {
        productsLocalStorage[findToSaveIndex] = newData;
        localStorage.setItem("products", JSON.stringify(productsLocalStorage));
        $("#modalEditProduct").style.display = "none";
      }
      renderProductsLocal(productsLocalStorage);
      displayProduct(currentPage, productsLocalStorage);
      handleCurrent();
      resetFormEdit();
    }
  });
}

// tìm kiếm sản phẩm
$("#searchInput").addEventListener("input", () => {
  let inputSearch = $("#searchInput").value.toLowerCase();
  if (inputSearch != "") {
    const returnSearch = productsLocalStorage.filter((product) => {
      const productName = product.name.toLowerCase();
      const productBarcode = product.barcode.toLowerCase();
      const productNcc = product.ncc.toLowerCase();
      return (
        productName.includes(inputSearch) ||
        productBarcode.includes(inputSearch) ||
        productNcc.includes(inputSearch)
      );
    });
    renderProductsLocal(returnSearch);
    $("#current").style.display = "none";
  } else {
    renderProductsLocal(productsLocalStorage);
    displayProduct(currentPage, productsLocalStorage);
    handleCurrent();
  }
});

// in danh sách sản phẩm
function renderProductsLocal(data) {
  const trProducts = data.map((product) => {
    return `
    <tr key="${product.id}">
      <td class="td-img"><img src="${product.image}" alt="" class="img-render"/></td>
      <td>${product.name}</td>
      <td>${product.barcode}</td>
      <td>${product.category}</td>
      <td>${product.ncc}</td>
      <td>${product.pricebf}</td>
      <td>${product.priceat}</td>
      <td>${product.quantity}</td>
      <td>
        <button class="btn btn-warning edit-products" name="${product.id}">Sửa</button>
      </td>
      <td>
        <button class="btn btn-danger delete-products" id="${product.id}">Xoá</button>
      </td>
    </tr>
    `;
  });
  const trProduct = trProducts.join(" ");
  $("#tbody").innerHTML = trProduct;

  $S(".delete-products").forEach((button) => {
    button.addEventListener("click", () => {
      const productId = button.id;
      deleteProduct(productId);
    });
  });
  $S(".edit-products").forEach((button) => {
    button.addEventListener("click", (e) => {
      e.stopPropagation();
      const productName = button.name;
      editProduct(productName);
      $("#modalEditProduct").style.display = "block";
    });
  });
}

// render danh mục trong form
function renderCategory() {
  const optionCategory = categoryLocalStorage.map((category, index) => {
    if (index === 0) {
      return `
        <option key="${category.id}" value="${category.name}" selected>${category.name}</option>
      `;
    }
    return `
      <option key="${category.id}" value="${category.name}">${category.name}</option>
    `;
  });
  const optionCate = optionCategory.join(" ");
  $("#catePro").innerHTML = optionCate;
  $("#cateProEdit").innerHTML = optionCate;
}
renderCategory();

// ẩn hiện phân trang
function handleCurrent() {
  if (productsLocalStorage.length === 0) {
    $("#current").style.display = "none";
  } else {
    $("#current").style.display = "flex";
  }
}
handleCurrent();

// reset form add
function resetForm() {
  $("#file").value = "";
  $("#image").src = "";
  $("#namePro").value = "";
  $("#codePro").value = "";
  $("#nccPro").value = "";
  $("#pbfPro").value = "";
  $("#patPro").value = "";
  $("#slPro").value = "";
  $("#descriptionPro").value = "";
  $("#errImage").style.display = "none";
  $("#iconUpImage").classList.remove("border-red");
  $("#errName").style.display = "none";
  $("#namePro").classList.remove("border-red");
  $("#errCode").style.display = "none";
  $("#codePro").classList.remove("border-red");
  $("#errNcc").style.display = "none";
  $("#nccPro").classList.remove("border-red");
  $("#errPbf").style.display = "none";
  $("#pbfPro").classList.remove("border-red");
  $("#errPat").style.display = "none";
  $("#patPro").classList.remove("border-red");
  $("#errSl").style.display = "none";
  $("#slPro").classList.remove("border-red");
  $("#errDes").style.display = "none";
  $("#descriptionPro").classList.remove("border-red");
}
function resetFormEdit() {
  $("#errNameEdit").style.display = "none";
  $("#nameProEdit").classList.remove("border-red");
  $("#errCodeEdit").style.display = "none";
  $("#codeProEdit").classList.remove("border-red");
  $("#errNccEdit").style.display = "none";
  $("#nccProEdit").classList.remove("border-red");
  $("#errPbfEdit").style.display = "none";
  $("#pbfProEdit").classList.remove("border-red");
  $("#errPatEdit").style.display = "none";
  $("#patProEdit").classList.remove("border-red");
  $("#errSlEdit").style.display = "none";
  $("#slProEdit").classList.remove("border-red");
  $("#errDesEdit").style.display = "none";
  $("#descriptionProEdit").classList.remove("border-red");
}
