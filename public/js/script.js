// Burger menu for mobile view
const burger = document.querySelector('.nav__burger-container');
const navLinksContainer = document.querySelector('.nav__links');
const navLinks = document.querySelectorAll('.nav__link');
const navIcons = document.querySelectorAll('.nav-icon')
const navLogo = document.querySelector('.nav__logo-img');
// Slider constraints
const slides = document.querySelectorAll('.articles__slide');

const arrowLeft = document.querySelector('.btn__slide--left');
const arrowRight = document.querySelector('.btn__slide--right');
const dots = document.querySelectorAll('.articles__slider-dot')
let index = 0;
// Sticky navigation
const nav = document.querySelector('.nav');
// const header = document.querySelector('.header')
const headerBanner = document.querySelector('.header__banner-container')
const navHeight = nav.getBoundingClientRect().height;
// Map Z-index
const maps = document.getElementById('map')

// Z-index of map
if (maps) {
    maps.style.zIndex = 1;
}


// Mobile menu

// Toogle class on mobile menu elementys
const burgerMenuToggle = function () {
    [burger, navLinksContainer, navLogo].forEach(item => item.classList.toggle('menu--active'))
    console.log('click');
}


// Event listeners
navLinks.forEach(navLink => navLink.addEventListener('click', function (e) {
    if (e.target.classList.contains('nav__search')) return
    if (window.innerWidth > 1024) return
    burgerMenuToggle()
}))
burger.addEventListener('click', burgerMenuToggle);


// Search 
const searchInput = document.querySelector('.nav__form-container')
const searchLink = document.querySelector('.nav__search');






searchLink.addEventListener('click', function (e) {
    e.preventDefault();
    // searchLink.classList.toggle('hidden');
    // searchInput.classList.toggle('hidden');
    searchLink.classList.toggle('search-active');
    searchInput.classList.toggle('search-active');
})







// Smooth scrolling

// const smoothScroll = function (id) {
//     document.querySelector(id).scrollIntoView({
//         behavior: 'smooth',

//     });
// }

// navLinksContainer.addEventListener('click', function (e) {
//     e.preventDefault();
//     // setAttribute();


//     if (e.target.classList.contains('nav__link')) {
//         const id = e.target.getAttribute('href');

//         smoothScroll(id);
//     };

//     if (e.target.classList.contains('nav-icon')) {
//         const id = e.target.parentElement.getAttribute('href');
//         smoothScroll(id);
//     };
// });



// Hoover/blur - navlinks
// 
// || 
const blurLinksOnHoover = function (event) {
    navLinks.forEach(navlink => navlink.addEventListener(`${event}`, function (e) {

        if (event === 'mouseover' && (e.target.classList.contains('nav__link') || e.target.classList.contains('nav-icon'))) {
            navLinks.forEach(navlink => {
                navlink.classList.add('blur');
            });

            e.target.classList.remove('blur')
            e.target.parentElement.classList.remove('blur')

        }
        if (event === 'mouseout') {
            navLinks.forEach(navlink => {
                navlink.classList.remove('blur')
            });

        }

        if (event === 'focus') {
            navLinks.forEach(navlink => {
                navlink.classList.add('blur');
            });
        }
        // console.log('link hoverd:', e.target);
    }))
}


blurLinksOnHoover('mouseover');
blurLinksOnHoover('mouseout');
blurLinksOnHoover('focus');


if (slides.length > 0) {
    // Slider
    // Basic function to organize slider layout and change slides
    const slidePosition = function () {
        slides.forEach((slide, i) => slide.style.transform = `translateX(${(index - i)*250-50}%)`)

        dots.forEach(dot => dot.classList.remove('slider__dot--active'));
        dots[index].classList.add('slider__dot--active');
    }

    slidePosition();



    const moveSlideRight = function () {
        if (index === slides.length - 1) return
        index++
        slidePosition()

        console.log('click right', index);
    }
    const moveSlideLeft = function () {
        if (index === 0) return
        index--;
        slidePosition();

        console.log('click left', index);
    }


    // Swipe posts

    let initialX = null;
    let initialY = null;

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
    };


    slides.forEach(slide => {
        slide.addEventListener('touchstart', startTouch, false);
        slide.addEventListener('touchmove', moveTouch, false);
    });

    arrowRight.addEventListener('click', moveSlideRight);
    arrowLeft.addEventListener('click', moveSlideLeft);

    dots.forEach((dot, i) => dot.addEventListener('click', function () {
        index = i;
        slidePosition();
    }));

    // TO DO INFINITE SLIDER??

}







//Sticky navigation -> OBSERVER API

// const navHeight = nav.getBoundingClientRect().height;
console.log(navHeight);

const articlesContainer = document.querySelector('.aside__about')

const stickyNav = function (entries) {
    const [entry] = entries;


    if (!entry.isIntersecting) nav.classList.add('sticky');
    else nav.classList.remove('sticky');
};

const headerObserver = new IntersectionObserver(stickyNav, {
    root: null,
    threshold: 0,
    rootMargin: `-${navHeight}px`,
});


headerBanner ? headerObserver.observe(headerBanner) : headerObserver.observe(articlesContainer)



// Leaflet
// map ------------------

if (maps) {

    var map = L.map('map', {

        dragging: window.innerWidth < 1024 ? false : true,
        tap: window.innerWidth < 1024 ? false : true,

        inertia: false,
        scrollWheelZoom: false,
    }).setView([10.01, -84.221388888889], 3);
    L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=pk.eyJ1IjoiemFiaWVnbGkiLCJhIjoiY2t0eGE5NjhkMTJsczMwbXhkb2N0Y2UxZCJ9.9LFCbpbXL3o5trk3NM7WRw', {
        attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
        maxZoom: 18,
        minZoom: 3,
        id: 'mapbox/light-v9',
        tileSize: 512,
        zoomOffset: -1,
        accessToken: 'your.mapbox.access.token'
    }).addTo(map);


    // Pin - icon

    var pinkIcon = L.icon({
        iconUrl: './IMG/pin2.png',
        iconSize: [40, 60],
        iconAnchor: [20, 60],
    });

    var greenIcon = L.icon({
        iconUrl: './IMG/pin.png',
        // shadowUrl: 'leaf-shadow.png',

        iconSize: [40, 60], // size of the icon
        // shadowSize: [50, 64], // size of the shadow
        iconAnchor: [20, 60], // point of the icon which will correspond to marker's location
        // shadowAnchor: [4, 62], // the same for the shadow
        // popupAnchor: [-3, -76] // point from which the popup should open relative to the iconAnchor
    });
    L.marker([9.976416, -83.85344], {
        icon: greenIcon
    }).addTo(map).bindPopup("<b>Kostaryka</b><br>brvolcán irazú</br><br><biutton class='btn'>Zobacz więcej</button>").closePopup();

    L.marker([8.976416, -73.85344], {
        icon: pinkIcon
    }).addTo(map).bindPopup("<b>Kostaryka</b><br>brvolcán irazú</br><br>").closePopup();
}

// Random quote gnerator




const motivationQuote = [{
        quote: '"Jeśli myślisz, że przygody bywają niebezpieczne, spróbuj rutyny. Ona jest śmiercionośna."',
        author: 'Paulo Coelho'
    }, {
        quote: '"Turyści nie wiedzą gdzie byli, podróżnicy nie wiedzą gdzie będą."',
        author: 'Paul Theroux'
    }, {
        quote: '"Życie albo jest śmiałą przygodą, albo niczym."',
        author: 'Helen Keller'
    }, {
        quote: '"Przygoda warta jest każdego trudu."',
        author: 'Arystoteles'
    },
    {
        quote: '"Podróżować to żyć."',
        author: 'Hans Christian Andersen'
    },
    {
        quote: '"Jeśli naszym przeznaczeniem byłoby być w jednym miejscu, mielibyśmy korzenie zamiast stóp."',
        author: 'Rachel Wolchin'
    },
    {
        quote: '"Za dwadzieścia lat bardziej będziesz żałował tego czego nie zrobiłeś, niż tego co zrobiłeś. Więc odwiąż liny, opuść bezpieczną przystań. Złap w żagle pomyślne wiatry. Podróżuj. Śnij. Odkrywaj."',
        author: 'Mark Twain'
    },
    {
        quote: '"Nie wszyscy ci, którzy wędrują, są pogubieni."',
        author: 'JRR Tolkien'
    },
    {
        quote: '"Inwestycja w podróże to inwestycja w siebie"',
        author: 'Matthew Karsten'
    },

];
const markupParentEl = document.querySelector('.header__motivation-quote-container');

if (markupParentEl) {



    let quote = '';

    const randomNumberGenerator = function (min, max) {
        return Math.floor(Math.random() * (max - min) + min);
    }

    const randomQuoteGenerator = function () {
        markupParentEl.innerHTML = '';

        const quoteIndex = randomNumberGenerator(0, motivationQuote.length);
        quote = motivationQuote[quoteIndex]
        const markup = `
        <p class="header__motivation-quote">  ${quote.quote}</p>
    <p class="motivation__quote-author">${quote.author}</p>
    `;

        // console.log(markup);

        markupParentEl.insertAdjacentHTML('afterbegin', markup);
    }


    setInterval(randomQuoteGenerator, 6000)
}

// Submit-form
const postFormContainer = document.querySelector('.post__form-container')



let addSectionBtn = document.getElementById('addSection');
let postContent = document.querySelector('.section__content');
let sectionParentEl = document.querySelector('.post__section-container');
// let addListElBtn = document.getElementById('addListElement');
// let listParentEl = document.querySelector('.list-container')
// let listEl = document.querySelector('.list-element')

// addListElBtn.addEventListener('click', function () {
//     let newListEl = listEl.cloneNode(false);
//     listParentEl.appendChild(newListEl)
// })


// addSectionBtn.addEventListener('click', function () {
//     let newSection = postContent.cloneNode(true);
//     // newSection.te = '';
//     sectionParentEl.appendChild(newSection)
// })
let socket = io();


const commentsForm = document.querySelector('.post__comments');
const likeBtn = document.querySelector('.like');
let likeIco = document.querySelector('.likes-ico');
const likesCounter = document.querySelector('.likes-count');

if (commentsForm && !likeBtn) {
    likeIco.innerHTML = '<i class="fa-solid fa-heart"></i>'
}


if (likeBtn) {
    likeBtn.addEventListener('click', async function () {
        likeIco.innerHTML = '<i class="fa-solid fa-heart"></i>'
        const postId = likeBtn.getAttribute('postId');
        console.log(postId);
        console.log('click');
        fetch('/post/' + postId, {
                method: 'POST'
            })
            // .then(res => res.json()).then(data => likesCounter.textContent = data.likes)
            .then(res => res.json()).then(data => socket.emit("newLike", data))

            // throw new Error('Request failed.');

            .catch(function (error) {
                likesCounter.textContent = error;
                console.log(error);
            });
    });

}






if (commentsForm) {
    commentsForm.addEventListener('submit', async function (e) {
        e.preventDefault();
        const data = {
            userName: commentsForm.userName.value,
            comment: commentsForm.comment.value,
            id: commentsForm.postId.value
        };
        if (commentsForm.userName.value === '') {
            alert('Podaj imię')
            return
        };
        if (commentsForm.comment.value === '') {
            alert('Wpisz komentarz')
            return
        };

        console.log(data);

        fetch('/post-comment', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data),

        }).then(res => res.json()).then(res => {
            console.log(res)
            socket.emit("newComment", data)
            alert(res.text)
        }).catch(err => console.log(err))
        // return false
    })
}



socket.on("newComment", (comment) => {
    let markup = "";
    markup += `<p>${comment.userName}</p>`;
    markup += `<p>${comment.comment}</p>`;
    console.log(markup);
    document.querySelector('.comments__container').insertAdjacentHTML('afterbegin', markup)
    console.log(comment);
})
socket.on("newLike", (data) => {
    console.log(data);
    likesCounter.textContent = `${data.likes}`

    if (data.postId === commentsForm.postId.value) {
        likeBtn.style.display = 'none';


    };

})


const updateQueryString = function (urlParams, page) {
    urlParams.set('page', page)
    return window.location.search = urlParams;
}



const paginationBtnsContainer = document.querySelector('.pagination__panel-container ')
if (paginationBtnsContainer) {
    const btnPrev = document.querySelector('.previous-page');
    const btnNext = document.querySelector('.next-page');
    const limit = document.querySelector('.limit-of__posts').textContent;
    const noOfPosts = document.querySelector('.no-of__posts').textContent;
    const lastPage = document.querySelector('.last-page')
    const max = Math.round(noOfPosts * 1 / limit * 1);
    const urlParams = new URLSearchParams(window.location.search)
    const curPage = urlParams.get("page") * 1 || 1;
    lastPage.textContent = max;
    if (curPage === max) {
        btnNext.classList.add('hidden')
    }
    if (curPage === 1) {
        btnPrev.classList.add('hidden')
    }
    // console.log(noOfPosts, limit * 1);
    // console.log(Math.round(noOfPosts * 1 / limit * 1));

    btnNext.addEventListener('click', function () {

        let page = curPage + 1;

        console.log(page, max);
        // console.log('page++', page);
        // urlParams.delete('page')
        updateQueryString(urlParams, page)
        // urlParams.set('page', page)
        // window.location.search = urlParams;

    })

    btnPrev.addEventListener('click', function () {

        let page = curPage - 1;

        console.log(page, max);
        // console.log('page++', page);
        // urlParams.delete('page')
        updateQueryString(urlParams, page)


    })


}
// Test - api pagination

// const btnExplore = document.querySelector('.articles__featured--btn');

// btnExplore.addEventListener('click', async function (skip, limit) {
//     fetch(`//posts?skip=${skip}&limit=${limit}`).then(res => console.log(res))
// })


const loginPanel = document.querySelector('.header__panel')
const footer = document.querySelector('.footer')

if (loginPanel) {
    [nav, footer].forEach(el => el.style.display = 'none')
}