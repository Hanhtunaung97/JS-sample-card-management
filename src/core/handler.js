import Swal from "sweetalert2";
import { productRender, removeCartAddedBtn } from "../app/product";
import { cartItems, cartTotalAmount, cartUi, searchInput } from "./selectors";
import { products } from "./variables";

export const cartBtnHandler = () => {
  cartUi.classList.toggle("translate-x-full");
  cartUi.classList.add("duration-300");
};

export const categoryListsHandler = (event) => {
  if (event.target.classList.contains("category-badge")) {
    const currentCategoryBtn = event.target;
    console.log(currentCategoryBtn);
    const currentCategory = currentCategoryBtn.innerText.toLowerCase();
    const lastActiveBtn = app.querySelector(".category-badge.active");
    lastActiveBtn.classList.toggle("active");
    currentCategoryBtn.classList.add("active");
    productRender(
      products.filter(
        (product) =>
          product.category == currentCategory || currentCategory === "all"
      )
    );
  }
};

export const orderNowBtnHandler = (event) => {
  Swal.fire({
    title: "Sure to Order?",
    text: "You won't be able to revert this!",
    icon: "question",
    showCancelButton: true,
    // confirmButtonColor: "#3085d6",
    // cancelButtonColor: "#d33",
    confirmButtonText: "Yes, order it!",
  }).then((result) => {
    if (result.isConfirmed) {
      const customerId = Math.floor(Math.random() * 10000);
      const total = parseFloat(cartTotalAmount.innerText);
      const time = Date.now();
      const orderItems = [];
      const orderCarts = cartItems.querySelectorAll(".cart-item");
      orderCarts.forEach((el) => {
        const productId = parseFloat(el.getAttribute("product-id"));
        const quantity = parseInt(el.querySelector(".cart-q").innerText);
        orderItems.push({
          product_id: productId,
          quantity: quantity,
        });
        el.remove();
        removeCartAddedBtn(productId);
        const order = { customerId, total, time, orderItems };
        console.log(order);
      });

      Swal.fire({
        title: "ordered!",
        text: "Your products have been ordered.",
        icon: "success",
      });
    }
  });
  // customer_id,product_id,quantity,time,total
  const order = { customerId, time, total, orderItems };
  // console.log(order);
};

export const searchBtnHandler = () => {
  // searchInput.classList.toggle("opacity-0");
  // searchInput.classList.toggle("pointer-events-none");
  searchInput.classList.add("animate__lightSpeedInLeft");
  searchInput.addEventListener("animationend", () => {
    searchInput.classList.remove("animate__lightSpeedInLeft");
  });
  searchInput.focus();
};
export const searchInputHandler = (event) => {
  productRender(
    products.filter(
      (product) =>
        product.title.toLowerCase().search(event.target.value.toLowerCase()) >=
        0
    )
  );
};
