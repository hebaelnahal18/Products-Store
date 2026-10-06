const productsContainer = document.getElementById("productsContainer");
const loading = document.getElementById("loading");
const noProducts = document.getElementById("noProducts");
const searchInput = document.getElementById("searchInput");
const searchBtn = document.getElementById("searchBtn");
const modalBody = document.getElementById("modalBody");
const favorite = document.getElementById("favorite");
const favoritesContainer = document.getElementById("favoritesContainer");
const noFavorites = document.getElementById("noFavorites");
const favoritesSection = document.getElementById("favorites");
const productsSection = document.getElementById("products");
const home = document.getElementById("home");
const productsBtn = document.getElementById("productsBtn");
const hero = document.getElementById("hero");
const links = document.querySelectorAll(".nav-link");
const exampleModalLabel = document.querySelector("#exampleModalLabel");
let productsData;
const categoriesContainer = document.getElementById("categoriesContainer");
const pagination = document.getElementById("pagination");
let currentPage = 1;
let limit = 12;
let totalProducts;
let totalPages;
let currentCategory = "";
const cart=document.querySelector('#cart')
const cartBtn=document.getElementById('cartBtn')
// Get All Products
async function getProducts() {
  loading.classList.remove("d-none");
  try {
    let skip = (currentPage - 1) * limit;
    let response = await fetch(
      `https://dummyjson.com/products?limit=${limit}&skip=${skip}`,
    );
    let data = await response.json();
    productsData = data.products;
    totalProducts = data.total;
    totalPages = Math.ceil(totalProducts / limit);
    // console.log(totalProducts);
    displayPagination();
    // console.log(productsData);
    displayProducts(productsData);
  } catch (error) {
    console.log("Error" + error);
  } finally {
    loading.classList.add("d-none");
  }
}
function displayPagination() {
  pagination.innerHTML = "";
  let pages = "";
  for (let i = 1; i <= totalPages; i++) {
    pages += `
      <li class="page-item ${i === currentPage ? "active" : ""}">
        <button class="page-link mx-1 rounded" onclick='goToPage(${i})'>${i}</button>
      </li>

`;
  }
  pagination.innerHTML = `
    ${pages}
    `;
}
function goToPage(page) {
  currentPage = page;
  if (currentCategory === "") {
    getProducts();
  } else {
    getProductsByCategory(currentCategory);
  }
}
getProducts();
// Display All Products
function displayProducts(products) {
  let data = "";
  if (products.length == 0) {
    noProducts.classList.remove("d-none");
    productsContainer.innerHTML = "";
    return;
  }
  noProducts.classList.add("d-none");
  const favoritesProducts = JSON.parse(localStorage.getItem("favorites")) || [];
  products.forEach((product) => {
    const isFavorite = favoritesProducts.some(
      (favProduct) => favProduct.id === product.id,
    );
    data += createProductCard(product, isFavorite);
  });
  productsContainer.innerHTML = data;
}
// Search Product
searchBtn.addEventListener("click", function () {
  searchProducts(searchInput.value);
});
searchInput.addEventListener('keydown',(event)=>{
  if(event.key==='Enter'){
    searchProducts(searchInput.value);
  }
  searchProducts(searchInput.value);
})
// Search Products function
async function searchProducts(productsSearch) {
  if (productsSearch.trim() === "") {
    displayProducts(productsData);
    return;
  }
  try {
    let response = await fetch(
      `https://dummyjson.com/products/search?q=${productsSearch}`,
    );
    let data = await response.json();
    console.log(data);
    const filterProducts = data.products;
    displayProducts(filterProducts);
  } catch (error) {
    console.log("Error:" + error);
  }
}
// Display Product Details
async function displayCategoryProduct(id) {
  try {
    let response = await fetch(`https://dummyjson.com/products/${id}`);
    let product = await response.json();
    displayOneProduct(product);
  } catch (error) {
    console.log("Error:" + error);
  }
}
function displayOneProduct(product) {
  let data = `
       <div class="row align-items-center">
    <div class="col-md-5 text-center">
      <img 
        src="${product.thumbnail}" 
        class="img-fluid"
        alt="${product.title}"
      >
    </div>
    <div class="col-md-7">
      <h3 class="mb-3">${product.title}</h3>
      <p>${product.description}</p>
      <p><strong>Category:</strong> ${product.category}</p>
      <p><strong>Price:</strong> $${product.price}</p>
      <p><strong>Rating:</strong> ⭐ ${product.rating}</p>
      <p><strong>Brand:</strong> ${product.brand}</p>
      <p><strong>Stock:</strong> ${product.stock}</p>
      <p><strong>Discount:</strong> ${product.discountPercentage}%</p>
    </div>
  </div>`;
  exampleModalLabel.innerHTML = product.title;
  modalBody.innerHTML = data;
}
// Function  add to favorites
function addToFavorites(id) {
  let product = productsData.find((prod) => {
    return prod.id === id;
  });

  let favoritesProducts = JSON.parse(localStorage.getItem("favorites")) || [];

  let exist = favoritesProducts.some((prod) => {
    return prod.id === id;
  });

  if (!exist) {
    favoritesProducts.push(product);
  } else {
    favoritesProducts = favoritesProducts.filter((prod) => {
      return prod.id !== id;
    });
  }
  localStorage.setItem("favorites", JSON.stringify(favoritesProducts));
  if (!favoritesSection.classList.contains("d-none")) {
    displayFavorites();
    return;
  }
  displayProducts(productsData);
  const favoriteAlert = document.getElementById(`favoriteAlert-${id}`);
  if (!exist) {
    favoriteAlert.textContent = "Product added to favorites ❤️";
  } else {
    favoriteAlert.textContent = "Product removed from favorites 💔";
  }
  favoriteAlert.classList.remove("d-none");
  setTimeout(() => {
    favoriteAlert.classList.add("d-none");
  }, 3000);
  // console.log(favoritesProducts);
}
favorite.addEventListener("click", () => {
  showFavorites();
  displayFavorites();
});
// Function to display favorite Products
function displayFavorites() {
  let favoritesProducts = JSON.parse(localStorage.getItem("favorites")) || [];
  let data = "";
  if (favoritesProducts.length === 0) {
    favoritesContainer.innerHTML = "";
    noFavorites.classList.remove("d-none");
    return;
  }
  noFavorites.classList.add("d-none");
  favoritesProducts.forEach((product) => {
    data += createProductCard(product, true);
  });
  favoritesContainer.innerHTML = data;
}

home.addEventListener("click", function () {
  showProducts();
});
productsBtn.addEventListener("click", function () {
  showProducts();
});
// Remove active from all links and add to the link active
links.forEach((link) => {
  link.addEventListener("click", () => {
    links.forEach((link) => {
      link.classList.remove("active");
    });

    link.classList.add("active");
  });
});
function showProducts() {
  hero.classList.remove("d-none");
  productsSection.classList.remove("d-none");
  favoritesSection.classList.add("d-none");
  cart.classList.add('d-none')
}
function showFavorites() {
  hero.classList.add("d-none");
  productsSection.classList.add("d-none");
  favoritesSection.classList.remove("d-none");
  cart.classList.add('d-none')
}
function createProductCard(product, isFavorites = false) {
  return `
    <div class='col-xl-3 col-lg-4 col-md-6'>
                <div class="product-card">
              <div class="product-image-container">
                <img src="${product.thumbnail}" alt="${product.title}" class="product-image" />
              </div>
              <div class="product-content">
                <span class="product-category">${product.category} </span>
                <h5 class="product-title">${product.title}</h5>
                <p class="product-description">${product.description}</p>

                <div class="product-bottom">
                  <span class="product-price">${product.price}</span>
                  <span class="rating">${product.rating}</span>
                </div>
                <div class='d-flex justify-content-between'>
                <button  class="btn showProduct py-2"   data-bs-toggle="modal"
  data-bs-target="#exampleModal"
   onclick='displayCategoryProduct(${product.id})'>Show Product</button>
   <button class="btn py-2" onclick='addToFavorites(${product.id})'>
   ${
     isFavorites
       ? '<i class="fa-solid fa-heart text-danger"></i>'
       : '<i class="fa-regular fa-heart"></i>'
   }
   </button>
   <button class="btn py-2 showProduct" onclick='addToCart(${product.id})'>
  <i class="fa-solid fa-cart-shopping"></i>
</button>
   </div>
             <div id="favoriteAlert-${product.id}" class="alert alert-success d-none w-100">
  Product added to favorites ❤️
</div>
              </div>
            </div>
    </div>

    `;
}
async function getCategories() {
  try {
    let response = await fetch(`https://dummyjson.com/products/categories`);
    let data = await response.json();
    const categories = data;
    // console.log(data)
    categories.forEach((category) => {
      categoriesContainer.innerHTML += `
      <option class="btn btn-outline-dark" value='${category.slug}'>${category.name}</option>`;
    });
    categoriesContainer.addEventListener("change", function () {
      currentCategory = categoriesContainer.value;
      if (currentCategory === "") {
        currentPage = 1;
        getProducts();
        // displayProducts(productsData);
        return;
      }
      currentPage = 1;
      getProductsByCategory(currentCategory);
    });
  } catch (error) {
    console.log("Error:" + error);
  }
}
async function getProductsByCategory(category) {
  try {
    let skip = (currentPage - 1) * limit;
    let response = await fetch(
      `https://dummyjson.com/products/category/${category}?limit=${limit}&skip=${skip}`,
    );

    let data = await response.json();
    productsData = data.products;
    totalProducts = data.total;
    totalPages = Math.ceil(totalProducts / limit);
    displayPagination();
    displayProducts(productsData);
    // console.log(data.products)
  } catch (error) {
    console.log("Error:" + error);
  }
}
getCategories();
 let productsCart=JSON.parse(localStorage.getItem("cart")) || [];
// Add to cart function
function addToCart(id) {
  let product = productsData.find((prod) => {
    return prod.id === id;
  });
   productsCart = JSON.parse(localStorage.getItem("cart")) || [];
  let exist = productsCart.find((prod) => {
    return prod.id === id;
  });
  if (!exist) {
    product.quantity = 1;
    productsCart.push(product);
    console.log(product.quantity);
    console.log("added to cart");
  } else {
    exist.quantity++;
    console.log("already in cart");
    console.log(exist.quantity);
  }
  localStorage.setItem("cart", JSON.stringify(productsCart));
}
const cartContainer=document.querySelector('#cartContainer')
const noCart=document.querySelector('#noCart')
function displayCart() {
   productsCart = JSON.parse(localStorage.getItem("cart")) || [];
  let data = "";
  if (productsCart.length === 0) {
    cartContainer.innerHTML = "";
    noCart.classList.remove("d-none");
    displayCartTotal();
    
    return;
  }
  noCart.classList.add("d-none");
  productsCart.forEach((product) => {
data += `
  <div class="col-xl-6 col-lg-6 col-md-12">
    <div class="product-card">

      <div class="row align-items-center">

        <div class="col-md-5">
          <div class="product-image-container m-2">
            <img 
              src="${product.thumbnail}" 
              alt="${product.title}" 
              class="product-image "
            />
          </div>
        </div>

        <div class="col-md-7">
          <div class="product-content">

            <span class="product-category">
              ${product.category}
            </span>

            <h5 class="product-title">
              ${product.title}
            </h5>

            <p class="product-price mb-3">
              $${product.price}
            </p>

            <div class="d-flex align-items-center gap-2 mb-3">
              <span>Quantity:</span>

              <button 
                class="btn btn-sm btn-outline-dark"
                onclick="decreaseQuantity(${product.id})">
                −
              </button>

              <span class="fw-bold">
                ${product.quantity}
              </span>

              <button 
                class="btn btn-sm btn-outline-dark"
                onclick="increaseQuantity(${product.id})">
                +
              </button>
            </div>

            <p class="mb-3">
              <strong>Subtotal:</strong>
              $${(product.price * product.quantity).toFixed(2)}
            </p>

            <button 
              class="btn btn-outline-danger btn-sm"
              onclick="removeFromCart(${product.id})">
              <i class="fa-solid fa-trash"></i>
              Remove
            </button>

          </div>
        </div>

      </div>

    </div>
  </div>
`;
  });
  cartContainer.innerHTML = data;
  displayCartTotal()
;
}
cartBtn.addEventListener("click", () => {
  showCart();
  displayCart();
  
});
function showCart(){
    hero.classList.add("d-none");
  productsSection.classList.add("d-none");
  favoritesSection.classList.add("d-none");
  cart.classList.remove('d-none')
}
function removeFromCart(id){
 const isDelete= window.confirm('Are you sure to delete item?')
 if(isDelete){

   const newProductCart=productsCart.filter((product)=>{
    return product.id!==id
  })
  productsCart=newProductCart;
    localStorage.setItem("cart", JSON.stringify(productsCart));
    displayCart()
 }
 else{
  return;
 }

}
function increaseQuantity(id){
    let product = productsCart.find((prod) => {
    return prod.id === id;
  });
  product.quantity++;
  localStorage.setItem("cart", JSON.stringify(productsCart));
  displayCart()
}
function decreaseQuantity(id){
    let product = productsCart.find((prod) => {
    return prod.id === id;
  });
  if(product.quantity==1){
    return;
  }
    product.quantity--;
  localStorage.setItem("cart", JSON.stringify(productsCart));
  displayCart()
}
const totalItems=document.querySelector('#totalItems')
const totalPrice=document.querySelector('#totalPrice')
function displayCartTotal(){
  let productItem=0;
  let totalPriceItem=0.00;

productsCart.forEach((product)=>{
    productItem+=product.quantity;

  })
  productsCart.forEach((product)=>{
    totalPriceItem+=(product.quantity*product.price);

  })
    totalItems.innerHTML=`${productItem} $`;
    totalPrice.innerHTML=`${totalPriceItem.toFixed(2)} $`;

}
displayCartTotal();
