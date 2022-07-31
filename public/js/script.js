// Burger menu for mobile view
const burger = document.querySelector(".nav__burger-container");
const navLinksContainer = document.querySelector(".nav__links");
const navLinks = document.querySelectorAll(".nav__link");
const navIcons = document.querySelectorAll(".nav-icon");
const navLogo = document.querySelector(".nav__logo-img");
// Slider
const slides = document.querySelectorAll(".articles__slide");

let initialX = null;
let initialY = null;

const arrowLeft = document.querySelector(".btn__slide--left");
const arrowRight = document.querySelector(".btn__slide--right");
const dots = document.querySelectorAll(".articles__slider-dot");
let index = 0;
// Sticky navigation
const nav = document.querySelector(".nav");
// const header = document.querySelector('.header')
const headerBannerContainer = document.querySelector(
  ".header__banner-container"
);
const headerBanner = document.querySelector(".header__banner");
const navHeight = nav.getBoundingClientRect().height;
// Map Z-index
const maps = document.getElementById("map");
const leafletAttr = document.querySelector(
  ".leaflet-control-attribution.leaflet-control"
);
const orsAttributionMarkup =
  '| © <a href="www.openrouteservice.org">openrouteservice.org</a> by HeiGIT ';

const galleryBtn = document.querySelector(".gallery__btn");
const galleryContainer = document.querySelector(".gallery__container");
const imgsContainer = document.querySelector(".gallery__imgs");

const galleryCloseBtn = document.querySelector(".close-btn__container");
// Cookies
const cookiesBtn = document.querySelector(".cookies__btn");
const cookies = document.querySelector(".cookies");
const cookiesContainer = document.querySelector(".cookies__container");

// Z-index of map
if (maps) {
  maps.style.zIndex = 1;
  leafletAttr.insertAdjacentHTML("beforeend", orsAttributionMarkup);
}

// Mobile menu

// Toogle class on mobile menu elementys
const burgerMenuToggle = function () {
  [burger, navLinksContainer, navLogo].forEach((item) =>
    item.classList.toggle("menu--active")
  );
  console.log("click");
};

// Event listeners
navLinks.forEach((navLink) =>
  navLink.addEventListener("click", function (e) {
    if (e.target.classList.contains("nav__search")) return;
    if (window.innerWidth > 1024) return;
    burgerMenuToggle();
  })
);
burger.addEventListener("click", burgerMenuToggle);

// Search
const searchInput = document.querySelector(".nav__form-container");
const searchLink = document.querySelector(".nav__search");

searchLink.addEventListener("click", function (e) {
  e.preventDefault();

  if (!searchLink.classList.contains("search-active")) {
    searchLink.classList.add("search-active");
    searchInput.classList.remove("search-active");
  }
});

document.addEventListener("click", function (e) {
  if (
    searchLink.classList.contains("search-active") &&
    e.target !== searchInput &&
    e.target !== searchLink &&
    !e.target.classList.contains("form__input") &&
    !e.target.classList.contains("btn-search")
  ) {
    searchLink.classList.remove("search-active");
    searchInput.classList.add("search-active");
  }
});

const headerPanel = document.querySelector(".header__panel");

if (headerPanel) {
  headerBanner.style.position = "fixed";
  headerBanner.style.top = 0;
  headerBanner.style.left = 0;
  headerBanner.style.height = "100vh";
}

// Hoover/blur - navlinks

const blurLinksOnHoover = function (event) {
  navLinks.forEach((navlink) =>
    navlink.addEventListener(`${event}`, function (e) {
      if (
        event === "mouseover" &&
        (e.target.classList.contains("nav__link") ||
          e.target.classList.contains("nav-icon"))
      ) {
        navLinks.forEach((navlink) => {
          navlink.classList.add("blur");
        });

        e.target.classList.remove("blur");
        e.target.parentElement.classList.remove("blur");
      }
      if (event === "mouseout") {
        navLinks.forEach((navlink) => {
          navlink.classList.remove("blur");
        });
      }

      if (event === "focus") {
        navLinks.forEach((navlink) => {
          navlink.classList.add("blur");
        });
      }
      // console.log('link hoverd:', e.target);
    })
  );
};

blurLinksOnHoover("mouseover");
blurLinksOnHoover("mouseout");
blurLinksOnHoover("focus");

// Basic function to organize slider layout and change slides
const slidePosition = function () {
  slides.forEach(
    (slide, i) =>
      (slide.style.transform = `translateX(${(index - i) * 250 - 50}%)`)
  );
  if (dots.length !== 0) {
    dots.forEach((dot) => dot.classList.remove("slider__dot--active"));
    dots[index].classList.add("slider__dot--active");
  }
};

slidePosition();

const moveSlideRight = function () {
  if (index === slides.length - 1) return;
  index++;
  slidePosition();

  console.log("click right", index);
};
const moveSlideLeft = function () {
  if (index === 0) return;
  index--;
  slidePosition();

  console.log("click left", index);
};

// Swipe posts

const startTouch = function (e) {
  initialX = e.touches[0].clientX;
  initialY = e.touches[0].clientY;
};

function moveTouch(e) {
  if (initialX === null || initialY === null) return;

  let currentX = e.touches[0].clientX;
  let currentY = e.touches[0].clientY;
  let diffX = initialX - currentX;
  let diffY = initialY - currentY;
  if (Math.abs(diffX) > Math.abs(diffY)) {
    diffX > 0 ? moveSlideLeft() : moveSlideRight();
  }
  initialX = initialY = null;
  e.preventDefault();
}

slides.forEach((slide) => {
  slide.addEventListener("touchstart", startTouch, false);
  slide.addEventListener("touchmove", moveTouch, false);
});

if (dots.length !== 0) {
  arrowRight.addEventListener("click", moveSlideLeft);
  arrowLeft.addEventListener("click", moveSlideRight);
}

dots.forEach((dot, i) =>
  dot.addEventListener("click", function () {
    index = i;
    slidePosition();
  })
);
// TO DO INFINITE SLIDER??

//Sticky navigation -> OBSERVER API

const articlesContainer = document.querySelector(".aside__about");

const stickyNav = function (entries) {
  const [entry] = entries;

  if (!entry.isIntersecting) nav.classList.add("sticky");
  else nav.classList.remove("sticky");
};

const headerObserver = new IntersectionObserver(stickyNav, {
  root: null,
  threshold: 0,
  rootMargin: `-${navHeight}px`,
});
headerObserver.observe(headerBannerContainer);

const motivationQuote = [
  {
    quote:
      '"Jeśli myślisz, że przygody bywają niebezpieczne, spróbuj rutyny. Ona jest śmiercionośna."',
    author: "Paulo Coelho",
  },
  {
    quote: '"Turyści nie wiedzą gdzie byli, podróżnicy nie wiedzą gdzie będą."',
    author: "Paul Theroux",
  },
  {
    quote: '"Życie albo jest śmiałą przygodą, albo niczym."',
    author: "Helen Keller",
  },
  {
    quote: '"Przygoda warta jest każdego trudu."',
    author: "Arystoteles",
  },
  {
    quote: '"Podróżować to żyć."',
    author: "Hans Christian Andersen",
  },
  {
    quote:
      '"Jeśli naszym przeznaczeniem byłoby być w jednym miejscu, mielibyśmy korzenie zamiast stóp."',
    author: "Rachel Wolchin",
  },
  {
    quote:
      '"Za dwadzieścia lat bardziej będziesz żałował tego czego nie zrobiłeś, niż tego co zrobiłeś. Więc odwiąż liny, opuść bezpieczną przystań. Złap w żagle pomyślne wiatry. Podróżuj. Śnij. Odkrywaj."',
    author: "Mark Twain",
  },
  {
    quote: '"Nie wszyscy ci, którzy wędrują, są pogubieni."',
    author: "JRR Tolkien",
  },
  {
    quote: '"Inwestycja w podróże to inwestycja w siebie"',
    author: "Matthew Karsten",
  },
];
const markupParentEl = document.querySelector(
  ".header__motivation-quote-container"
);

if (markupParentEl) {
  let quote = "";

  const randomNumberGenerator = function (min, max) {
    return Math.floor(Math.random() * (max - min) + min);
  };

  const randomQuoteGenerator = function () {
    markupParentEl.innerHTML = "";

    const quoteIndex = randomNumberGenerator(0, motivationQuote.length);
    quote = motivationQuote[quoteIndex];
    const markup = `
        <p class="header__motivation-quote">  ${quote.quote}</p>
    <p class="motivation__quote-author">${quote.author}</p>
    `;

    markupParentEl.insertAdjacentHTML("afterbegin", markup);
  };

  setInterval(randomQuoteGenerator, 6000);
}

// Cookies

if (cookiesBtn) {
  cookiesBtn.addEventListener("click", async function () {
    fetch("/cookies", {
      method: "GET",
    })
      .then((res) => res.json())
      .then((data) => socket.emit("cookies", data))
      .catch(function (error) {
        //   likesCounter.textContent = error;
        console.log(error);
      });
  });
}

// Submit-form
const postFormContainer = document.querySelector(".post__form-container");

let addSectionBtn = document.getElementById("addSection");
let postContent = document.querySelector(".section__content");
let sectionParentEl = document.querySelector(".post__section-container");

let socket = io();

const commentsForm = document.querySelector(".post__comments");
const likeBtn = document.querySelector(".like");
let likeIco = document.querySelector(".likes-ico");
const likesCounter = document.querySelector(".likes-count");

if (commentsForm && !likeBtn) {
  likeIco.innerHTML = '<i class="fa-solid fa-heart"></i>';
}

if (likeBtn) {
  likeBtn.addEventListener("click", async function () {
    likeIco.innerHTML = '<i class="fa-solid fa-heart"></i>';
    const postId = likeBtn.getAttribute("postId");
    console.log(postId);
    console.log("click");
    let flag = document.cookie.indexOf("a" + commentsForm.postId.value);
    fetch("/post/" + postId, {
      method: "POST",
    })
      .then((res) => res.json())
      .then((data) => socket.emit("newLike", data))
      .catch(function (error) {
        likesCounter.textContent = error;
        console.log(error);
      });
  });
}

if (commentsForm) {
  commentsForm.addEventListener("submit", async function (e) {
    e.preventDefault();
    const data = {
      userName: commentsForm.userName.value,
      comment: commentsForm.comment.value,
      id: commentsForm.postId.value,
      data: `${new Date().getDate()}.${
        new Date().getMonth() + 1
      }.${new Date().getFullYear()}`,
    };
    if (commentsForm.userName.value === "") {
      alert("Podaj imię");
      return;
    }
    if (commentsForm.comment.value === "") {
      alert("Wpisz komentarz");
      return;
    }

    console.log(data);

    fetch("/post-comment", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })
      .then((res) => res.json())
      .then((res) => {
        console.log(res);
        socket.emit("newComment", data);
        alert(res.text);
      })
      .catch((err) => console.log(err));
    // return false
  });
}

socket.on("newComment", (comment) => {
  let markup = ``;
  markup += `<p class="comments__user">${comment.comment}</p>`;
  markup += `<p class="comments__commnent">${comment.userName}</p>`;
  console.log(markup);
  document.querySelector(".comment").insertAdjacentHTML("afterbegin", markup);
  console.log(comment);
});
socket.on("newLike", (data) => {
  console.log(data);

  let flag = document.cookie.indexOf("a" + commentsForm.postId.value);
  if (flag !== -1) {
    likeBtn.style.display = "none";
    likesCounter.textContent = `${data.likes}`;
    likeIco.innerHTML = '<i class="fa-solid fa-heart"></i>';
  }
});

//
socket.on("cookies", (data) => {
  console.log(data, data.cookies);

  let cookies = data.cookies;
  if (cookies) {
    cookiesContainer.style.display = "none";
  }
});
//
const updateQueryString = function (urlParams, page) {
  urlParams.set("page", page);
  return (window.location.search = urlParams);
};

const paginationBtnsContainer = document.querySelector(
  ".pagination__panel-container "
);
if (paginationBtnsContainer) {
  const btnPrev = document.querySelector(".previous-page");
  const btnNext = document.querySelector(".next-page");
  const limit = document.querySelector(".limit-of__posts").textContent;
  const noOfPosts = document.querySelector(".no-of__posts").textContent;
  const lastPage = document.querySelector(".last-page");
  const max = Math.round(((noOfPosts * 1) / limit) * 1);
  const urlParams = new URLSearchParams(window.location.search);
  const curPage = urlParams.get("page") * 1 || 1;
  lastPage.textContent = max;
  if (curPage === max) {
    btnNext.classList.add("hidden");
  }
  if (curPage === 1) {
    btnPrev.classList.add("hidden");
  }

  btnNext.addEventListener("click", function () {
    let page = curPage + 1;

    console.log(page, max);

    updateQueryString(urlParams, page);
  });

  btnPrev.addEventListener("click", function () {
    let page = curPage - 1;

    console.log(page, max);

    updateQueryString(urlParams, page);
  });
}

const loginPanel = document.querySelector(".header__panel");
const footer = document.querySelector(".footer");

if (loginPanel) {
  [nav, footer].forEach((el) => (el.style.display = "none"));
}

// Counters
const distance = document.querySelectorAll(".route__distance");
let daysPassed;
let days = 0;
let km = 0;
let sumDistance = 0;

distance.forEach((el) => {
  sumDistance += el.value * 1;
});
console.log(sumDistance);

const daysCounter = document.querySelector(".date-counter");
const distanceCounter = document.querySelector(".km-counter");
if (daysCounter) {
  //
  const startDate = new Date("2022/02/22 15:00:00");
  const date = new Date();
  daysPassed = Math.floor(Math.abs(date - startDate) / (1000 * 3600 * 24));
  daysCounter.textContent = 0;

  const incrementDays = function () {
    days++;
    daysCounter.textContent = days;

    if (days == daysPassed) {
      clearInterval(interval);
    }
  };
  const incrementDistance = function () {
    km += 100;
    distanceCounter.textContent = km;

    if (km > sumDistance + 5000 - 100) {
      km++;
    }
    if (km >= sumDistance + 8000) {
      clearInterval(intervalKM);
    }
  };

  let interval = setInterval(incrementDays, 30);
  let intervalKM = setInterval(incrementDistance, 25);
}

// Panel gallery spinner
const panelSpinnerContainer = document.querySelector(
  ".panel__spinner-container"
);
const galleryBtnsContainer = document.querySelector(".gallery-btns__container");
let galleryEnd = 4;
// let galleryStart = 0
const galleryIndex = 4;
let imgs;
const galleryNextPage = document.querySelector(".gallery__next");
const galleryPrevPage = document.querySelector(".gallery__prev");
let galleryCurPage = document.querySelector(".gallery__cur-page");
const galleryMaxPage = document.querySelector(".gallery__max-page");
let makrdownImageText = document.querySelector(".gallery__markdown-img");
let galleryPage = 1;

// Oppen/close popup gallery

const galleryPopUp = function (data) {
  galleryContainer.classList.toggle("hidden");
};
// Change copy btns text content
const restoreContent = function (el) {
  el.textContent = "Kopiuj";
};

//
const getGalleryPage = function (page) {
  const start = (page - 1) * galleryIndex;
  const end = page * galleryIndex;
  let scope = imgs.slice(start, end);
  console.log(start, end, scope);
  imgsContainer.textContent = "";
  scope.forEach((img, i) => {
    imgsContainer.insertAdjacentHTML(
      "beforeend",
      ` <div class="gallery__img" style="background-image:url('${
        img.path
      }'); background-size:cover; "><button class="btn copy__link" data-index="${
        start + i
      }">Kopiuj</button>
        <p class="gallery__img-txt">${
          img.description
        }</p></div>  <input class="gallery__makrdown-img" type="hidden" value="![${
        img.description
      }](${img.path})">`
    );
  });
  // Calc max page of gallery
  let maxPage = Math.ceil(imgs.length / galleryIndex);
  // Update current page (default = 1) and max page
  galleryCurPage.textContent = galleryPage;
  galleryMaxPage.textContent = maxPage;
  // Redeclarete display property for next page and prev page btns
  galleryPrevPage.style.display = "inline";
  galleryNextPage.style.display = "inline";
  // Hidding next or prev page btns according to the current page
  if (galleryPage === 1) {
    galleryPrevPage.style.display = "none";
  }
  if (galleryPage === maxPage) {
    galleryNextPage.style.display = "none";
  }
};

// Event delegation for copy btns
if (imgsContainer) {
  imgsContainer.addEventListener("click", function (e) {
    const copyBtn = e.target.closest("copy__link");
    if (!e.target.classList.contains("copy__link")) return;
    const index = e.target.getAttribute("data-index");
    // copy text
    navigator.clipboard.writeText(
      `![${imgs[index].description}](${imgs[index].path})`
    );
    const target = e.target;
    console.log(target);
    target.textContent = "Skopiowano!";

    setTimeout(restoreContent.bind(null, target), 1500);
  });
}
// Generate gallery

const getGallery = async function () {
  try {
    const res = await fetch("/admin-panel/upload/gallery");
    res.status === 200
      ? (panelSpinnerContainer.style.display = "none")
      : (panelSpinnerContainer.style.display = "flex");
    galleryBtnsContainer.classList.remove("hidden");
    const data = await res.json();
    imgs = await data.imgs;
    getGalleryPage((page = 1));

    console.log(data);
  } catch (error) {
    console.log(error);
  }
};
if (imgsContainer) {
  galleryNextPage.addEventListener("click", function (e) {
    e.preventDefault();
    if (imgs.length === galleryEnd) return;

    galleryPage++;
    galleryCurPage.textContent = galleryPage;
    getGalleryPage(galleryPage);
  });

  galleryPrevPage.addEventListener("click", function (e) {
    e.preventDefault();
    galleryPage--;
    if (galleryPage === 0) return;
    imgsContainer.textContent = "";
    galleryCurPage.textContent = galleryPage;
    getGalleryPage(galleryPage);
  });

  galleryBtn.addEventListener("click", function (e) {
    e.preventDefault();
    galleryPopUp();
    getGallery();
  });

  galleryCloseBtn.addEventListener("click", function () {
    // starting conditions

    galleryPage = 1;
    galleryBtnsContainer.classList.add("hidden");
    galleryPopUp();
  });
}

// Upload spinner
const btnSubmit = document.querySelector(".btn__submit");
const spinnerOverlay = document.querySelector(".panel__spinner-overlay");
if (btnSubmit) {
  btnSubmit.addEventListener("click", function () {
    spinnerOverlay.style.display = "block";
  });
}
