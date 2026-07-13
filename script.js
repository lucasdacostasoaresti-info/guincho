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

    menuToggle?.setAttribute("aria-expanded","true");

    mobileMenu?.classList.add("active");

    menuOverlay?.classList.add("active");

}

function closeMenu(){

    body.classList.remove("menu-open");

    menuToggle?.classList.remove("active");

    menuToggle?.setAttribute("aria-expanded","false");

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



let map = null;

const empresa = {
    lat: -23.315,
    lng: -46.221
};

function initMap() {

    const mapEl = document.getElementById("map");

    if(!mapEl) return;

    map = new google.maps.Map(mapEl, {
        center: empresa,
        zoom: 11,
        mapTypeId: "roadmap"
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

    /* ==========================================================
       CORRIGE O MAPA FICANDO EM BRANCO AO REDIMENSIONAR A TELA

       O Google Maps só desenha os "tiles" com base no tamanho
       do contêiner NO MOMENTO da criação. Quando o layout muda
       (ex: media queries alterando a altura de .coverage-map ao
       trocar o tamanho da tela / rotacionar o celular), o mapa
       não percebe sozinho e o canvas fica em branco.

       A solução é observar mudanças de tamanho do contêiner e
       disparar manualmente o evento "resize" do Maps, seguido
       de um recentralização (senão ele "resize" mas desloca o
       mapa para o canto).
    ========================================================== */

    function refreshMap(){

        if(!map) return;

        google.maps.event.trigger(map, "resize");

        map.setCenter(empresa);

    }

    if("ResizeObserver" in window){

        const mapResizeObserver = new ResizeObserver(debounce(refreshMap, 150));

        mapResizeObserver.observe(mapEl);

    }

    window.addEventListener("resize", debounce(refreshMap, 150));

    window.addEventListener("orientationchange", ()=>{

        setTimeout(refreshMap, 200);

    });

    /* Caso a aba fique oculta (troca de app no celular) e volte,
       o mapa também pode renderizar em branco */

    document.addEventListener("visibilitychange", ()=>{

        if(document.visibilityState === "visible"){

            setTimeout(refreshMap, 150);

        }

    });

}

/* ==========================================================
   CARREGAMENTO DO GOOGLE MAPS

   Antes, o script do Maps era carregado direto no HTML com
   "async" (que na prática ignora o "defer" junto dele). Isso
   criava uma condição de corrida: dependendo da velocidade da
   conexão/cache, o Maps podia terminar de carregar e tentar
   chamar initMap() ANTES deste arquivo (script.js) terminar de
   rodar e definir a função — resultando em erro silencioso e
   mapa em branco, de forma intermitente e difícil de reproduzir.

   A solução é só pedir o script do Maps depois que initMap já
   existe (aqui embaixo), garantindo 100% a ordem de execução.
========================================================== */

if(document.getElementById("map")){

    const mapsScript = document.createElement("script");

    mapsScript.src =
        "https://maps.googleapis.com/maps/api/js?key=AIzaSyBD6RDnhX-J5kb06tZzmvwgcb4xLAD9rZo&loading=async&callback=initMap";

    mapsScript.async = true;

    document.head.appendChild(mapsScript);

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
   SLIDER "QUEM SOMOS"
========================================================== */

(function initAboutSlider(){

    const slider = document.getElementById("aboutSlider");

    if(!slider) return;

    const track = slider.querySelector(".about-slider-track");
    const slides = [...slider.querySelectorAll(".about-slide")];
    const prevBtn = document.getElementById("aboutSliderPrev");
    const nextBtn = document.getElementById("aboutSliderNext");
    const dotsWrap = document.getElementById("aboutSliderDots");

    if(!track || slides.length === 0) return;

    let current = 0;

    let autoplayTimer = null;

    let resumeTimer = null;

    const AUTOPLAY_DELAY = 5000;

    const RESUME_DELAY = 10000;

    /* Cria os dots dinamicamente */

    slides.forEach((_, index)=>{

        const dot = document.createElement("button");

        dot.type = "button";

        dot.setAttribute("aria-label", `Ir para imagem ${index + 1}`);

        if(index === 0) dot.classList.add("active");

        dot.addEventListener("click", ()=>{

            goToSlide(index);

            handleManualInteraction();

        });

        dotsWrap?.appendChild(dot);

    });

    const dots = dotsWrap ? [...dotsWrap.children] : [];

    function update(){

        track.style.transform = `translateX(-${current * 100}%)`;

        slides.forEach((slide, index)=>{

            slide.classList.toggle("active", index === current);

        });

        dots.forEach((dot, index)=>{

            dot.classList.toggle("active", index === current);

        });

    }

    function goToSlide(index){

        current = (index + slides.length) % slides.length;

        update();

    }

    function nextSlide(){

        goToSlide(current + 1);

    }

    function prevSlide(){

        goToSlide(current - 1);

    }

    function startAutoplay(){

        stopAutoplay();

        autoplayTimer = setInterval(nextSlide, AUTOPLAY_DELAY);

    }

    function stopAutoplay(){

        if(autoplayTimer){

            clearInterval(autoplayTimer);

            autoplayTimer = null;

        }

    }

    /* Ao clicar manualmente: para o autoplay e agenda retomada em 10s */

    function handleManualInteraction(){

        stopAutoplay();

        if(resumeTimer){

            clearTimeout(resumeTimer);

        }

        resumeTimer = setTimeout(()=>{

            startAutoplay();

        }, RESUME_DELAY);

    }

    nextBtn?.addEventListener("click", ()=>{

        nextSlide();

        handleManualInteraction();

    });

    prevBtn?.addEventListener("click", ()=>{

        prevSlide();

        handleManualInteraction();

    });

    /* Swipe em telas touch */

    let touchStartX = 0;

    let touchEndX = 0;

    slider.addEventListener("touchstart", event=>{

        touchStartX = event.changedTouches[0].screenX;

    }, {passive:true});

    slider.addEventListener("touchend", event=>{

        touchEndX = event.changedTouches[0].screenX;

        const diff = touchStartX - touchEndX;

        if(Math.abs(diff) > 40){

            if(diff > 0){

                nextSlide();

            }

            else{

                prevSlide();

            }

            handleManualInteraction();

        }

    }, {passive:true});

    update();

    startAutoplay();

})();


/* ==========================================================
   DEBUG
========================================================== */

// console.log("Fabinho Guinchos carregado.");