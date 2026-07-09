/* ==========================================================
   FABINHO GUINCHOS
   script.js
   Versão 1.0
========================================================== */

"use strict";

/* ==========================================================
   ELEMENTOS
========================================================== */

const body = document.body;

const header = document.querySelector(".header");

const menuToggle = document.querySelector(".menu-toggle");

const mobileMenu = document.querySelector(".mobile-menu");

const menuOverlay = document.querySelector(".menu-overlay");

const backToTop = document.getElementById("backToTop");

const navLinks = document.querySelectorAll(
    ".navbar a, .mobile-menu a"
);

const faqItems = document.querySelectorAll(".faq-item");

const fadeElements = document.querySelectorAll(".fade-in");

/* ==========================================================
   HEADER SCROLL
========================================================== */

function updateHeader(){

    if(window.scrollY > 40){

        header?.classList.add("scrolled");

    }

    else{

        header?.classList.remove("scrolled");

    }

}

/* ==========================================================
   MENU MOBILE
========================================================== */

function openMenu(){

    body.classList.add("menu-open");

    menuToggle?.classList.add("active");

    mobileMenu?.classList.add("active");

    menuOverlay?.classList.add("active");

}

function closeMenu(){

    body.classList.remove("menu-open");

    menuToggle?.classList.remove("active");

    mobileMenu?.classList.remove("active");

    menuOverlay?.classList.remove("active");

}

menuToggle?.addEventListener("click",()=>{

    if(mobileMenu.classList.contains("active")){

        closeMenu();

    }

    else{

        openMenu();

    }

});

menuOverlay?.addEventListener("click",closeMenu);

/* ==========================================================
   FECHAR MENU AO CLICAR
========================================================== */

navLinks.forEach(link=>{

    link.addEventListener("click",()=>{

        closeMenu();

    });

});

/* ==========================================================
   BOTÃO VOLTAR AO TOPO
========================================================== */

function updateBackToTop(){

    if(!backToTop) return;

    if(window.scrollY > 500){

        backToTop.classList.add("show");

    }

    else{

        backToTop.classList.remove("show");

    }

}

backToTop?.addEventListener("click",()=>{

    window.scrollTo({

        top:0,

        behavior:"smooth"

    });

});

/* ==========================================================
   FAQ
========================================================== */

faqItems.forEach(item=>{

    item.addEventListener("toggle",()=>{

        if(item.open){

            faqItems.forEach(other=>{

                if(other !== item){

                    other.open = false;

                }

            });

        }

    });

});

/* ==========================================================
   SCROLL SUAVE
========================================================== */

navLinks.forEach(link=>{

    link.addEventListener("click",event=>{

        const href = link.getAttribute("href");

        if(!href || !href.startsWith("#")) return;

        event.preventDefault();

        const section = document.querySelector(href);

        if(!section) return;

        section.scrollIntoView({

            behavior:"smooth",

            block:"start"

        });

    });

});

/* ==========================================================
   INTERSECTION OBSERVER
========================================================== */

const observer = new IntersectionObserver(

(entries)=>{

    entries.forEach(entry=>{

        if(entry.isIntersecting){

            entry.target.classList.add("show");

            observer.unobserve(entry.target);

        }

    });

},

{

    threshold:.15

}

);

fadeElements.forEach(element=>{

    observer.observe(element);

});

/* ==========================================================
   SCROLL EVENTS
========================================================== */

window.addEventListener("scroll",()=>{

    updateHeader();

    updateBackToTop();

});

/* ==========================================================
   LOAD
========================================================== */

window.addEventListener("load",()=>{

    updateHeader();

    updateBackToTop();

});

/* ==========================================================
   SCROLL SPY
========================================================== */

const sections = document.querySelectorAll("section[id]");

function updateActiveMenu(){

    const scrollPosition = window.scrollY + 150;

    sections.forEach(section=>{

        const sectionTop = section.offsetTop;
        const sectionHeight = section.offsetHeight;
        const id = section.getAttribute("id");

        if(
            scrollPosition >= sectionTop &&
            scrollPosition < sectionTop + sectionHeight
        ){

            document
                .querySelectorAll(".navbar a, .mobile-menu a")
                .forEach(link=>{

                    link.classList.remove("active");

                    if(link.getAttribute("href") === `#${id}`){

                        link.classList.add("active");

                    }

                });

        }

    });

}

/* ==========================================================
   PARALLAX HERO
========================================================== */

const heroBackground = document.querySelector(".hero-background");

function heroParallax(){

    if(!heroBackground) return;

    const offset = window.scrollY * 0.25;

    heroBackground.style.transform =
        `translateY(${offset}px)`;

}

/* ==========================================================
   STAGGER ANIMATION
========================================================== */

const staggerGroups = document.querySelectorAll(

    ".services-grid, .differentials-grid, .testimonials-grid"

);

staggerGroups.forEach(group=>{

    [...group.children].forEach((card,index)=>{

        card.style.transitionDelay = `${index * 120}ms`;

    });

});

/* ==========================================================
   CONTADORES
========================================================== */

const counters = document.querySelectorAll("[data-counter]");

function animateCounter(counter){

    const target = Number(counter.dataset.counter);

    let current = 0;

    const increment = target / 100;

    const timer = setInterval(()=>{

        current += increment;

        if(current >= target){

            counter.textContent = target;

            clearInterval(timer);

            return;

        }

        counter.textContent = Math.floor(current);

    },15);

}

const counterObserver = new IntersectionObserver(

entries=>{

    entries.forEach(entry=>{

        if(entry.isIntersecting){

            animateCounter(entry.target);

            counterObserver.unobserve(entry.target);

        }

    });

},

{

    threshold:.5

}

);

counters.forEach(counter=>{

    counterObserver.observe(counter);

});

/* ==========================================================
   LAZY IMAGES
========================================================== */

const lazyImages = document.querySelectorAll("img[data-src]");

const lazyObserver = new IntersectionObserver(

entries=>{

    entries.forEach(entry=>{

        if(!entry.isIntersecting) return;

        const img = entry.target;

        img.src = img.dataset.src;

        img.removeAttribute("data-src");

        lazyObserver.unobserve(img);

    });

},

{

    rootMargin:"200px"

}

);

lazyImages.forEach(img=>{

    lazyObserver.observe(img);

});

/* ==========================================================
   DEBOUNCE
========================================================== */

function debounce(fn,delay){

    let timeout;

    return (...args)=>{

        clearTimeout(timeout);

        timeout = setTimeout(()=>{

            fn(...args);

        },delay);

    };

}

/* ==========================================================
   SCROLL EVENTS OTIMIZADOS
========================================================== */

const optimizedScroll = debounce(()=>{

    updateHeader();

    updateBackToTop();

    updateActiveMenu();

    heroParallax();

},5);

window.removeEventListener("scroll",updateHeader);

window.removeEventListener("scroll",updateBackToTop);

window.addEventListener("scroll",optimizedScroll);

/* ==========================================================
   RESIZE
========================================================== */

window.addEventListener("resize",debounce(()=>{

    updateActiveMenu();

},100));

/* ==========================================================
   ESC
========================================================== */

document.addEventListener("keydown",event=>{

    if(event.key === "Escape"){

        closeMenu();

    }

});

/* ==========================================================
   PRELOAD
========================================================== */

window.addEventListener("DOMContentLoaded",()=>{

    document.body.classList.remove("loading");

});

/* ==========================================================
   PERFORMANCE
========================================================== */

window.addEventListener("pageshow",()=>{

    updateHeader();

    updateBackToTop();

    updateActiveMenu();

});



const empresa = {
    lat: -23.3166,
    lng: -46.0369
};

function initMap() {

    const empresa = {
        lat: -23.315,
        lng: -46.221
    };

    const map = new google.maps.Map(document.getElementById("map"), {
        center: empresa,
        zoom: 11,
        mapTypeId: "roadmap"
    });

    new google.maps.Marker({
        position: empresa,
        map: map,
        title: "Fabinho Guinchos"
    });

    const circle = new google.maps.Circle({
        strokeColor: "#F97316",
        strokeOpacity: 1,
        strokeWeight: 3,
        fillColor: "#F97316",
        fillOpacity: 0.25,
        map: map,
        center: empresa,
        radius: 30000
    });

        
    new google.maps.Marker({

        position: empresa,

        map: map,

        title: "Fabinho Guinchos"

    });

    new google.maps.Circle({

        map,

        center: empresa,

        radius:30000,

        strokeColor:"#F97316",

        strokeOpacity:.9,

        strokeWeight:3,

        fillColor:"#F97316",

        fillOpacity:.18

    });

    const cidades = [

        {

            nome:"Santa Isabel",

            lat:-23.315,

            lng:-46.221

        },

        {

            nome:"Arujá",

            lat:-23.396,

            lng:-46.320

        },

        {

            nome:"Guarulhos",

            lat:-23.454,

            lng:-46.533

        },

        {

            nome:"Mogi das Cruzes",

            lat:-23.522,

            lng:-46.188

        }

    ];

    cidades.forEach(cidade=>{

        new google.maps.Marker({

            position:cidade,

            map,

            title:cidade.nome

        });

    });

    console.log(circle);
}


const telefone = "5511935052743";

document
.getElementById("btnGuincho")
.addEventListener("click", solicitarGuincho);

function solicitarGuincho(){

    if(!navigator.geolocation){

        alert("Seu navegador não suporta localização.");

        return;

    }

    navigator.geolocation.getCurrentPosition(

        sucesso,

        erro,

        {

            enableHighAccuracy:true,

            timeout:10000,

            maximumAge:0

        }

    );

}

function sucesso(posicao){

    const latitude = posicao.coords.latitude;

    const longitude = posicao.coords.longitude;

    const mensagem =

`Olá!

Preciso de um guincho.

Minha localização é:

https://www.google.com/maps?q=${latitude},${longitude}`;

    const url =

`https://wa.me/${telefone}?text=${encodeURIComponent(mensagem)}`;

    window.open(url,"_blank");

}

function erro(){

    alert("Não foi possível obter sua localização.");

}

/* ==========================================================
   DEBUG
========================================================== */

// console.log("Fabinho Guinchos carregado.");