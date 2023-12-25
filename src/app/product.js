import { app, cartBtn, cartItems, cartUi, productSection } from "../core/selectors";
import { products } from "../core/variables";
import { calculateCartTotalAmount, cartCountTotal, createCartUi } from "./cart";

export const productRender = (elementList) => {
  // console.log(elementList[0]);
  productSection.innerHTML = ``;
  elementList.forEach((el) => productSection.append(createProductCard(el)));
};

export const ratingUi = (rate) => {
  let result = "";
  for (let i = 1; i <= 5; i++) {
    result += `
    <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    stroke-width="1.5"
    stroke="currentColor"
    class="w-6 h-6 stroke-1 ${
      i <= rate.toFixed(0)
        ? "stroke-neural-700 fill-neutral-700"
        : "stroke-neural-300 fill-neutral-300"
    }"
  >
    <path
      stroke-linecap="round"
      stroke-linejoin="round"
      d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z"
    />
    </svg>
    `;
  }
  return result;
};

export const createProductCard = ({
  id,
  title,
  image,
  description,
  price,
  rating: { rate, count },
}) => {
  const card = document.createElement("div");
  const isCartItem = cartItems.querySelector(`[product-id='${id}']`);
  card.classList.add("product-card");
  card.setAttribute("data-id", id);
  card.innerHTML = `
  <div class=" w-full text-neutral-700">
  <img
    class="h-36 ms-3 -mb-16 product-img"
    src="${image}"
    alt=""
  />
  <div class="product-info border border-neutral-700 p-3 pt-20">
    <h4 class="font-heading font-bold line-clamp-1 mb-5 text-lg">
     ${title}
    </h4>
    <!-- <p>men's clothing</p> -->
    <p class="text-neutral-500 text-sm mb-5 line-clamp-3">
    ${description}
    </p>

    <div
      class="rating flex justify-between border-b border-neutral-700 pb-5 mb-5"
    >
      <div class="flex rating-stars">
       ${ratingUi(rate)}
      </div>
      <p class="rating-text">(${rate}/${count} )</p>
    </div>
    <p class="font-bold text-xl mb-2 font-heading">
      $ <span>${price}</span>
    </p>
    <div>
      <button ${
        isCartItem && "disabled"
      } class="add-to-cart-btn border font-heading border-neutral-700 w-full block p-3  ${
    isCartItem && "bg-neutral-700 border-white text-white"
  }">
       ${isCartItem ? "Added" : " Add to Cart"}
      </button>
    </div>
  </div>
</div>`;
  const addToCartBtn = card.querySelector(".add-to-cart-btn");
  addToCartBtn.addEventListener("click", addToCartBtnHandler);

  return card;
};
export const setCartAddedBtn = (id) => {
  const btn = app.querySelector(`[data-id='${id}'] .add-to-cart-btn`);
  btn.innerText = "Added";
  btn.toggleAttribute("disabled");
  btn.classList.add("bg-neutral-700", "border-white", "text-white");
};
export const removeCartAddedBtn = (id) => {
  const btn = app.querySelector(`[data-id='${id}'] .add-to-cart-btn`);
  btn.innerText = "Add to Cart";
  btn.toggleAttribute("disabled");
  btn.classList.remove("bg-neutral-700", "border-white", "text-white");
};
const addToCartBtnHandler = (event) => {
  const btn = event.target;
  const currentCart = event.target.closest(".product-card");
  const currentCartImg = currentCart.querySelector("img");
  const currentId = currentCart.getAttribute("data-id");
  setCartAddedBtn(currentId);
  const currentProduct = products.find((el) => el.id == currentId);
  cartItems.append(createCartUi(currentProduct));
  const img = currentCartImg.getBoundingClientRect();
  const cartShoppingBtn = cartBtn.querySelector("svg").getBoundingClientRect();
  const cartItemsRect=cartItems.getBoundingClientRect();
  // console.log(cartShoppingBtn);
  // console.log(img);
  let effect;
  if(cartUi.classList.contains("translate-x-full")){
    effect = [
      {
        top: img.top + "px",
        left: img.left + "px",
        width: img.width + "px",
        rotate: 0 + "deg",
      },
      {
        top: cartShoppingBtn.top + "px",
        left: cartShoppingBtn.left + "px",
        width: 0,
        rotate: 360 + "deg",
      },
    ];
  }else{
    effect = [
      {
        top: img.top + "px",
        left: img.left + "px",
        width: img.width + "px",
        rotate: 0 + "deg",
      },
      {
        top: cartItemsRect.top + 300+"px",
        left: cartItemsRect.left + 200+"px",
        width: 0,
        rotate: 360 + "deg",
      },
    ];
  }
 

  const timeline = {
    duration: 500,
    iterations: 1,
  };
  const newImg = new Image(img.width, img.height);
  newImg.src = currentCartImg.src;
  newImg.style.position = "fixed";
  newImg.style.zIndex = "51";
  newImg.style.top = img.top + "px";
  newImg.style.left = img.left + "px";
  // newImg.style.filter="grayscale(100%)"
  document.body.append(newImg);
  const newImgAnimation = newImg.animate(effect, timeline);
  newImgAnimation.addEventListener("finish", () => {
    cartBtn.classList.add("animate__tada");
    cartBtn.addEventListener("animationend", () => {
      cartBtn.classList.remove("animate__tada");
    });
    newImg.remove();
  });
};
