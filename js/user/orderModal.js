let orderLocal = JSON.parse(localStorage.getItem("orders")) || [];

// đóng mở modal danh sách order
$("#btnListOrder").addEventListener("click", (e) => {
  e.stopPropagation();
  $("#modalOrder").style.display = "block";
});
$("#closeModalOrder").addEventListener("click", (e) => {
  e.stopPropagation();
  $("#modalOrder").style.display = "none";
});
$("#modalOrder").addEventListener("click", (e) => {
  e.stopPropagation();
  $("#modalOrder").style.display = "block";
});
window.addEventListener("click", () => {
  // modal order
  if ($("#modalOrder").style.display === "block") {
    $("#modalOrder").style.display = "none";
  }
});

// lấy order của user trong orders
const filteredArray = orderLocal.filter((orders) => {
  return userLoginLocalStorage.order.find((order) => order.id === orders.id);
});
userLoginLocalStorage.order = filteredArray;

// render list order của user
function renderListOrder() {
  const listOrder = userLoginLocalStorage.order.map((order, index) => {
    return `
    <tr>
      <td>
        <div class="numberOrder">
          <span>${index + 1}</span>
        </div>
      </td>
      <td>
        <div class="listProductsOrder">
          ${order.products.map((product) => {
            return `
              <div class="itemProductOrder">
                <img
                  src="${product.image}"
                  alt=""
                />
                <div class="productInfo"> 
                  <span>${product.name}</span>
                  <span>${product.priceat}</span>
                </div>
              </div>
            `;
          })}
      </td>
      <td>
        <div class="addressOrder">
          <span>${order.city}</span>
          <span>${order.district}</span>
          <span>${order.ward}</span>
          <span>${order.address}</span>
          <span>${order.name}</span>
          <span>${order.phone}</span>
        </div>
      </td>
      <td>
        <div class="totalOrder">
          <h3>${order.totalBill}</h3>
        </div>
      </td>
      <td>
        <div class="statusOrder">
          <span>${order.orderStatus}</span>
        </div>
      </td>
    </tr>
    `;
  });
  const itemOrder = listOrder.join(" ");
  $("#tbodyOrder").innerHTML = itemOrder;
}
renderListOrder();
