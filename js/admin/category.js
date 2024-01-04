let $ = document.querySelector.bind(document);
let $S = document.querySelectorAll.bind(document);

let categoryLocalStorage = JSON.parse(localStorage.getItem("category")) || [];

// phân trang
const itemsPerPage = 10;
let currentPage = 1;
prevPage(categoryLocalStorage);
nextPage(categoryLocalStorage);
function displayCategory(page, data) {
  const startIndex = (page - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const displayItems = data.slice(startIndex, endIndex);
  renderCategoryLocal(displayItems);
}

$("#numberCurrentPage").innerHTML = currentPage;

function prevPage(data) {
  $("#prev").addEventListener("click", () => {
    if (currentPage > 1) {
      currentPage--;
      displayCategory(currentPage, data);
      $("#numberCurrentPage").innerHTML = currentPage;
    }
  });
}

function nextPage(data) {
  $("#next").addEventListener("click", () => {
    const maxPage = Math.ceil(data.length / itemsPerPage);

    if (currentPage < maxPage) {
      currentPage++;
      displayCategory(currentPage, data);
    }
    $("#numberCurrentPage").innerHTML = currentPage;
  });
}

displayCategory(currentPage, categoryLocalStorage);

// mở modal add
function handleOpenModal(e) {
  e.stopPropagation();
  $("#modalAddCategory").style.display = "block";
}

// đóng modal add
function handleCloseModal(e) {
  e.stopPropagation();
  $("#modalAddCategory").style.display = "none";
  resetForm();
}

$("#btnAddProduct").addEventListener("click", handleOpenModal);
$("#modalAddCategory").addEventListener("click", handleOpenModal);
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
windowCloseModal("#modalAddCategory");
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

// submit form add
$("#formAddCategory").addEventListener("submit", (e) => {
  e.preventDefault();
  if ($("#nameCate").value === "") {
    validateInput("#nameCate", "#errName");
  } else {
    const newCategory = {
      id: uuidv4(),
      name: $("#nameCate").value,
      createdTime: new Date(),
    };
    categoryLocalStorage.unshift(newCategory);
    localStorage.setItem("category", JSON.stringify(categoryLocalStorage));
    $("#modalAddCategory").style.display = "none";
    resetForm();
    renderCategoryLocal(categoryLocalStorage);
    displayCategory(currentPage, categoryLocalStorage);
    $("#current").style.display = "flex";
  }
});

// xoá
function deleteCategory(categoryId) {
  let categoryLocal = categoryLocalStorage.filter(
    (category) => category.id != categoryId
  );
  localStorage.setItem("category", JSON.stringify(categoryLocal));
  categoryLocalStorage = categoryLocal;
  renderCategoryLocal(categoryLocalStorage);
  displayCategory(currentPage, categoryLocalStorage);
}

// sửa sản phẩm
function getIndex(data) {
  let editCategoryIndex = categoryLocalStorage.filter(
    (category) => category.id === data
  );
  return editCategoryIndex;
}
function editCategory(categoryName) {
  let itemCategory = getIndex(categoryName);
  $("#nameEdit").value = itemCategory[0].name;
}

// submit form sửa
$("#formEditProduct").addEventListener("submit", (e) => {
  e.preventDefault();
  if ($("#nameEdit").value === "") {
    validateInput("#nameEdit", "#errNameEdit");
  } else {
    // code chức năng sửa
  }
});

// tìm kiếm sản phẩm
$("#searchInput").addEventListener("input", () => {
  let inputSearch = $("#searchInput").value.toLowerCase();
  if (inputSearch != "") {
    const returnSearch = categoryLocalStorage.filter((category) => {
      const categoryName = category.name.toLowerCase();
      return categoryName.includes(inputSearch);
    });
    renderCategoryLocal(returnSearch);
    $("#current").style.display = "none";
  } else {
    renderCategoryLocal(categoryLocalStorage);
    displayCategory(currentPage, categoryLocalStorage);
    handleCurrent();
  }
});

// in danh sách sản phẩm
function renderCategoryLocal(data) {
  const trCategory = data.map((category) => {
    return `
    <tr key="${category.id}">
      <td>${category.name}</td>
      <td>
        <button class="btn btn-warning edit-category" name="${category.id}">Sửa</button>
      </td>
      <td>
        <button class="btn btn-danger delete-category" id="${category.id}">Xoá</button>
      </td>
    </tr>
    `;
  });
  const trCate = trCategory.join(" ");
  $("#tbody").innerHTML = trCate;

  $S(".delete-category").forEach((button) => {
    button.addEventListener("click", (e) => {
      e.stopPropagation();
      const categoryId = button.id;
      deleteCategory(categoryId);
    });
  });
  $S(".edit-category").forEach((button) => {
    button.addEventListener("click", (e) => {
      e.stopPropagation();
      const categoryName = button.name;
      editCategory(categoryName);
      $("#modalEditProduct").style.display = "block";
    });
  });
}

function handleCurrent() {
  if (categoryLocalStorage.length === 0) {
    $("#current").style.display = "none";
  } else {
    $("#current").style.display = "flex";
  }
}
handleCurrent();
// reset form add
function resetForm() {
  $("#nameCate").value = "";
  $("#errName").style.display = "none";
  $("#nameCate").classList.remove("border-red");
}
function resetFormEdit() {
  $("#errNameEdit").style.display = "none";
  $("#nameEdit").classList.remove("border-red");
}
