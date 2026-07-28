/* ==========================================================
   FABINHO GUINCHOS
   script.js
   Versão 1.0
========================================================== */

"use strict";

/* ==========================================================
   LOCALIZAÇÃO DA EMPRESA (compartilhada pelo mapa e pelo botão
   "Calcular Rota" — antes cada um tinha sua própria cópia dessa
   variável em escopos diferentes, o que quebrava o botão)
========================================================== */

const EMPRESA_COORDS = {

    lat: -23.4080,
    lng: -46.3946

};

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

    document.documentElement.classList.add("menu-open");

    body.classList.add("menu-open");

    menuToggle?.classList.add("active");

    menuToggle?.setAttribute("aria-expanded","true");

    mobileMenu?.classList.add("active");

    menuOverlay?.classList.add("active");

}

function closeMenu(){

    document.documentElement.classList.remove("menu-open");

    body.classList.remove("menu-open");

    menuToggle?.classList.remove("active");

    menuToggle?.setAttribute("aria-expanded","false");

    mobileMenu?.classList.remove("active");

    menuOverlay?.classList.remove("active");

}

menuToggle?.addEventListener("click",()=>{

    if(mobileMenu?.classList.contains("active")){

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
   SCROLL EVENTS

   Guardamos a função em uma variável (em vez de passar direto
   uma função anônima pro addEventListener) só pra ser possível
   removê-la de verdade mais abaixo, quando trocamos pela versão
   com debounce. Sem isso, o removeEventListener não encontra
   a função (precisa ser a mesma referência) e o listener antigo
   fica rodando pra sempre, disparando em CADA pixel de scroll,
   além do novo — desperdiçando processamento à toa, principalmente
   em celulares mais fracos.
========================================================== */

function handleScrollInicial(){

    updateHeader();

    updateBackToTop();

}

window.addEventListener("scroll",handleScrollInicial);

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
   STAGGER ANIMATION
========================================================== */

const staggerGroups = document.querySelectorAll(

    ".services-grid, .testimonials-grid"

);

staggerGroups.forEach(group=>{

    [...group.children].forEach((card,index)=>{

        card.style.transitionDelay = `${index * 120}ms`;

    });

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

},5);

window.removeEventListener("scroll",handleScrollInicial);

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


/* ==========================================================
   MAPA - OPENSTREETMAP + LEAFLET
========================================================== */

(function(){

const mapElement = document.getElementById("map");

if(!mapElement) return;

/* ==========================================================
   MAPA
========================================================== */

const map = L.map("map",{

    zoomControl:true,
    scrollWheelZoom:false

}).setView([EMPRESA_COORDS.lat, EMPRESA_COORDS.lng],11);

/* ==========================================================
   TILES
========================================================== */

L.tileLayer(

    "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",

    {

        maxZoom:19,

        attribution:"© OpenStreetMap"

    }

).addTo(map);

/* ==========================================================
   ÍCONE DA EMPRESA
========================================================== */

const iconeEmpresa = L.icon({

    iconUrl:"img/logo.webp",

    iconSize:[50,50],

    iconAnchor:[25,50],

    popupAnchor:[0,-45]

});

const iconeCidade = L.icon({
    
    iconUrl:"img/logo-icone.webp",

    iconSize:[50,50],

    iconAnchor:[25,50],

    popupAnchor:[0,-45]
})

/* ==========================================================
   MARCADOR PRINCIPAL
========================================================== */

L.marker(

    [EMPRESA_COORDS.lat,EMPRESA_COORDS.lng],

    {

        icon:iconeEmpresa

    }

)

.addTo(map)

.bindPopup(

    "<strong>Fabinho Guinchos</strong><br>Base operacional"

);

/* ==========================================================
   ÁREA DE COBERTURA
========================================================== */

L.circle(

    [EMPRESA_COORDS.lat,EMPRESA_COORDS.lng],

    {

        radius:40000,

        color:"#F97316",

        fillColor:"#F97316",

        fillOpacity:.18,

        weight:3

    }

).addTo(map);

/* ==========================================================
   CIDADES
========================================================== */

const cidades=[

    {

        nome:"Guarulhos",

        lat:-23.4538,

        lng:-46.5333

    },

    {

        nome:"Arujá",

        lat:-23.3963,

        lng:-46.3203

    },

    {

        nome:"Itaquaquecetuba",

        lat:-23.4864,

        lng:-46.3489

    },

    {

        nome:"Mairiporã",

        lat:-23.3186,

        lng:-46.5866

    },

    {

        nome:"São Paulo",

        lat:-23.5505,

        lng:-46.6333

    }

];

cidades.forEach(cidade=>{

     L.marker(
        [cidade.lat, cidade.lng],
        {
            icon: iconeCidade
        }
    )
    .addTo(map)
    .bindPopup(cidade.nome);

});

/* ==========================================================
   AJUSTA AO REDIMENSIONAR
========================================================== */

function atualizarMapa(){

    map.invalidateSize();

}

window.addEventListener(

    "resize",

    ()=>{

        setTimeout(atualizarMapa,200);

    }

);

window.addEventListener(

    "orientationchange",

    ()=>{

        setTimeout(atualizarMapa,300);

    }

);

document.addEventListener(

    "visibilitychange",

    ()=>{

        if(document.visibilityState==="visible"){

            setTimeout(atualizarMapa,200);

        }

    }

);

})();

/* ==========================================================
   TODOS OS BOTÕES "CHAMAR NO WHATSAPP" DO SITE

   Antes, esses botões eram apenas links para wa.me, sem
   mensagem nenhuma — a pessoa precisava chamar no WhatsApp e
   DEPOIS explicar/mandar a localização por conta própria.

   Agora, ao clicar em QUALQUER botão/link "Chamar no WhatsApp"
   do site (menu mobile, botões do topo, rodapé, botão flutuante,
   CTAs das páginas de serviços etc.), a pessoa já é solicitada
   a compartilhar a localização (mesmo pedido de permissão usado
   no botão "Solicitar Guincho") e, assim que aceitar, o
   WhatsApp já abre direto com a mensagem e o link do mapa
   prontos — sem precisar clicar 2 vezes.

   Se a pessoa recusar a localização ou o navegador não suportar,
   o WhatsApp ainda assim abre normalmente (só que sem a
   localização), pra nenhum botão ficar quebrado.
========================================================== */

function montarMensagemWhatsapp(latitude, longitude){

    if(latitude !== undefined && longitude !== undefined){

        return (
        `Olá! Vim pelo site da Fabinho Guinchos e preciso de um guincho.
Minha localização é:

https://www.google.com/maps?q=${latitude},${longitude}`
        );

    }

    return "Olá! Vim pelo site da Fabinho Guinchos e preciso de um guincho.";

}

/* ==========================================================
   AVISO DE LOCALIZAÇÃO (toast)

   Sem isso, o pedido de permissão do navegador é discreto
   (aparece perto da barra de endereço) e passa despercebido
   — a pessoa nem vê que precisa aceitar, o tempo esgota (ou
   ela clica fora sem querer) e a mensagem vai pro WhatsApp
   sem a localização. Esse aviso deixa claro o que está
   acontecendo enquanto o navegador pergunta.
========================================================== */

let locationToastEl = null;
let locationToastTimer = null;

function mostrarAvisoLocalizacao(){

    if(!locationToastEl){

        locationToastEl = document.createElement("div");
        locationToastEl.className = "location-toast";
        locationToastEl.setAttribute("role","status");
        locationToastEl.setAttribute("aria-live","polite");
        locationToastEl.innerHTML =
            `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M12 21s-7-6.1-7-11a7 7 0 0114 0c0 4.9-7 11-7 11z"/>
                <circle cx="12" cy="10" r="2.5"/>
            </svg>
            <span>Seu navegador vai pedir sua localização — aceite pra já mandarmos ela pronta no WhatsApp.</span>`;
        document.body.appendChild(locationToastEl);

    }

    clearTimeout(locationToastTimer);

    /* Reabre no próximo frame pra garantir a transição, caso o
       toast já estivesse visível (clique duplo rápido) */

    requestAnimationFrame(()=>{

        locationToastEl.classList.add("show");

    });

    /* Se por algum motivo a geolocalização nunca chamar de volta,
       este limite garante que o aviso não fique preso na tela */

    locationToastTimer = setTimeout(esconderAvisoLocalizacao, 9000);

}

function esconderAvisoLocalizacao(){

    clearTimeout(locationToastTimer);

    locationToastEl?.classList.remove("show");

}

/* ==========================================================
   DETECÇÃO iOS/Safari

   Só iOS (qualquer navegador, porque no iOS TODOS usam o motor
   Safari/WebKit por exigência da Apple) e o Safari no Mac têm o
   bloqueio agressivo de pop-up assíncrono que exige abrir a aba
   ANTES da geolocalização responder.

   Em Chrome/Firefox/Edge (PC ou Android), abrir a aba antes tira
   o foco da aba original — e é justamente na aba original que o
   navegador mostra o aviso de permissão de localização. Resultado:
   a pessoa não vê o aviso, porque está olhando pra aba errada.
   Por isso só usamos o truque da aba antecipada nos navegadores
   que realmente precisam dele.
========================================================== */

function precisaAbrirAbaAntes(){

    const ua = navigator.userAgent || "";

    const ehIOS =
        /iP(hone|od|ad)/.test(ua) ||
        /* iPadOS 13+ se identifica como "MacIntel", então checa
           também suporte a touch pra diferenciar de um Mac de verdade */
        (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);

    const ehSafari =
        /^((?!chrome|android|crios|fxios|edgios).)*safari/i.test(ua);

    return ehIOS || ehSafari;

}

function abrirWhatsappComLocalizacao(numero, hrefOriginal){

    /* IMPORTANTE (compatibilidade iOS/Safari):
       A aba PRECISA ser aberta aqui, de forma síncrona, ainda
       dentro do clique do usuário — mas SÓ nos navegadores que
       precisam disso (iOS/Safari). Se abrirmos a aba só depois
       que a geolocalização responder (assíncrono), o Safari no
       iPhone bloqueia o window.open() silenciosamente — o botão
       parece não fazer nada. Por isso, só nesses navegadores,
       abrimos a aba em branco AGORA e preenchemos o endereço
       dela depois.

       Em todos os outros navegadores (Chrome/Firefox/Edge, PC ou
       Android) NÃO fazemos isso, porque tirar o foco da aba
       original agora — antes mesmo de perguntar a localização —
       esconderia o aviso de permissão da pessoa (bug real que já
       aconteceu). Esses navegadores toleram bem chamar
       window.open() um pouco depois do clique, então abrimos a
       aba só quando a localização já respondeu.

       IMPORTANTE #2: aqui NÃO podemos passar "noopener" —
       quando "noopener" é usado, o navegador sempre retorna
       null no window.open(), e a gente perde justamente a
       referência que precisa pra preencher o endereço da aba
       mais tarde (isso já causou um bug: abria uma aba em
       branco solta E navegava a aba atual, ao mesmo tempo). */

    const precisaProtecaoIOS = precisaAbrirAbaAntes();

    let janela = null;

    if(precisaProtecaoIOS){

        try{

            janela = window.open("", "_blank");

            if(janela){

                /* Remove o acesso da aba nova de volta pra esta
                   página (mesmo efeito de segurança do "noopener",
                   só que sem perder a referência que precisamos) */

                janela.opener = null;

            }

        }catch(erro){

            janela = null;

        }

    }

    function irPara(url){

        if(janela && !janela.closed){

            janela.location.href = url;

        }else if(precisaProtecaoIOS){

            /* Pop-up foi bloqueado mesmo assim no iOS/Safari: como
               último recurso, navega na própria aba pra o botão
               nunca ficar sem resposta nenhuma. */

            window.location.href = url;

        }else{

            /* Chrome/Firefox/Edge: abre a aba só agora — a pessoa
               já viu e respondeu o aviso de permissão na aba
               original, sem nenhum foco roubado antes da hora. */

            window.open(url, "_blank", "noopener,noreferrer");

        }

    }

    function abrir(latitude, longitude){

        const mensagem = montarMensagemWhatsapp(latitude, longitude);

        const url = `https://wa.me/${numero}?text=${encodeURIComponent(mensagem)}`;

        irPara(url);

    }

    if(!navigator.geolocation){

        irPara(hrefOriginal);

        return;

    }

    mostrarAvisoLocalizacao();

    navigator.geolocation.getCurrentPosition(

        posicao=>{

            esconderAvisoLocalizacao();

            abrir(posicao.coords.latitude, posicao.coords.longitude);

        },

        ()=>{

            /* Localização negada/indisponível: abre o WhatsApp
               mesmo assim, só sem a localização */

            esconderAvisoLocalizacao();

            abrir();

        },

        {

            enableHighAccuracy:true,

            timeout:10000,

            maximumAge:0

        }

    );

}

document.querySelectorAll('a[href^="https://wa.me/"]').forEach(link=>{

    link.addEventListener("click", event=>{

        event.preventDefault();

        const numero = "5511947309527";

        abrirWhatsappComLocalizacao(numero, link.href);

    });

});

/* Botão "Solicitar Guincho Agora" (não é um link wa.me, é um
   <button> — por isso precisa de um listener próprio aqui) */

const btnGuincho = document.getElementById("btnGuincho");

btnGuincho?.addEventListener("click", ()=>{

    const numero = "5511947309527";

    const hrefOriginal = `https://wa.me/${numero}`;

    abrirWhatsappComLocalizacao(numero, hrefOriginal);

});

/* ==========================================================
   CALCULAR ROTA ATÉ A EMPRESA (página atendimento.html)

   Usa a localização atual da pessoa (com permissão dela) e
   abre o Google Maps já com a rota traçada até a Fabinho
   Guinchos — funciona tanto no navegador quanto no app do
   Google Maps no celular.
========================================================== */

(function initCalcularRota(){

    const btnRota = document.getElementById("btnRota");

    if(!btnRota) return;

    const status = document.getElementById("rotaStatus");

    const textoOriginal = btnRota.textContent;

    function mostrarStatus(texto, tipo){

        if(!status) return;

        status.textContent = texto;

        status.classList.remove("is-loading","is-success","is-error");

        if(tipo){

            status.classList.add(tipo);

        }

    }

    btnRota.addEventListener("click", ()=>{

        if(!navigator.geolocation){

            mostrarStatus("Seu navegador não suporta compartilhar localização.", "is-error");

            return;

        }

        /* Mesma correção do botão do WhatsApp: só em iOS/Safari
           abrimos a aba ANTES da localização responder (pra não
           esbarrar no bloqueio de pop-up assíncrono deles). Em
           Chrome/Firefox/Edge isso é evitado de propósito, porque
           tirar o foco da aba original agora esconderia o aviso
           de permissão de localização da pessoa (bug real que já
           aconteceu no PC). */

        const precisaProtecaoIOS = precisaAbrirAbaAntes();

        let janela = null;

        if(precisaProtecaoIOS){

            try{

                janela = window.open("", "_blank");

                if(janela){

                    janela.opener = null;

                }

            }catch(erro){

                janela = null;

            }

        }

        btnRota.disabled = true;

        btnRota.textContent = "Buscando sua localização...";

        mostrarStatus("Buscando sua localização, aceite a permissão do navegador...", "is-loading");

        navigator.geolocation.getCurrentPosition(

            posicao=>{

                const origem = `${posicao.coords.latitude},${posicao.coords.longitude}`;

                const destino = `${EMPRESA_COORDS.lat},${EMPRESA_COORDS.lng}`;

                const url =
                    `https://www.google.com/maps/dir/?api=1&origin=${origem}&destination=${destino}&travelmode=driving`;

                if(janela && !janela.closed){

                    janela.location.href = url;

                }else if(precisaProtecaoIOS){

                    window.location.href = url;

                }else{

                    window.open(url, "_blank", "noopener,noreferrer");

                }

                mostrarStatus("Pronto! Abrimos a rota até nós no Google Maps.", "is-success");

                btnRota.disabled = false;

                btnRota.textContent = textoOriginal;

            },

            ()=>{

                /* Sem localização não dá pra calcular rota nenhuma
                   — fecha a aba em branco que tínhamos aberto, pra
                   não deixar uma aba vazia solta pro usuário. */

                if(janela && !janela.closed){

                    janela.close();

                }

                mostrarStatus("Não conseguimos acessar sua localização. Verifique a permissão do navegador e tente de novo.", "is-error");

                btnRota.disabled = false;

                btnRota.textContent = textoOriginal;

            },

            {

                enableHighAccuracy:true,

                timeout:10000,

                maximumAge:0

            }

        );

    });

})();

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
   BUSCA NO FAQ (página faq.html)
========================================================== */

(function initFaqSearch(){

    const campo = document.getElementById("faqSearch");

    const lista = document.getElementById("faqList");

    const vazio = document.getElementById("faqEmpty");

    if(!campo || !lista) return;

    const itens = [...lista.querySelectorAll(".faq-item")];

    campo.addEventListener("input", ()=>{

        const termo = campo.value.trim().toLowerCase();

        let visiveis = 0;

        itens.forEach(item=>{

            const texto = item.textContent.toLowerCase();

            const corresponde = texto.includes(termo);

            item.hidden = !corresponde;

            if(corresponde){

                visiveis++;

            }

        });

        if(vazio){

            vazio.hidden = visiveis > 0;

        }

    });

})();

/* ==========================================================
   FORMULÁRIO DE CONTATO (página contato.html)

   O site é 100% estático (sem servidor). Isso significa que:

   - O envio pelo WHATSAPP funciona 100% sozinho, sem precisar
     configurar nada — é só abrir o link com a mensagem pronta.

   - O envio por E-MAIL de verdade (chegando na caixa de entrada
     automaticamente) depende de um serviço externo, porque o
     JavaScript do navegador não consegue mandar e-mail sozinho
     (e colocar senha de e-mail aqui no código seria inseguro).
     Por isso usamos o EmailJS (https://www.emailjs.com), que é
     gratuito e feito exatamente pra isso.

   PARA ATIVAR O ENVIO AUTOMÁTICO DE E-MAIL (± 5 minutos):

   1. Crie uma conta grátis em https://www.emailjs.com
   2. Em "Email Services", conecte seu Gmail (ou outro provedor)
      e anote o "Service ID" gerado.
   3. Em "Email Templates", crie um template com estas variáveis
      no corpo: {{from_name}} {{from_email}} {{phone}} {{message}}
      — e no campo "To Email" do template, coloque:
      lukascspolar@gmail.com
      Anote o "Template ID" gerado.
   4. Em "Account" > "General", copie a "Public Key".
   5. Cole os 3 valores nas constantes EMAILJS_CONFIG abaixo.

   Enquanto isso não for feito, o formulário automaticamente abre
   o aplicativo de e-mail da pessoa com tudo já preenchido, então
   nada fica quebrado — só não é 100% automático até configurar.
========================================================== */


(function initContactForm(){

    const form = document.getElementById("contactForm");

    if(!form) return;

    const whatsappNumero = "5511947309527";

    const feedback = document.getElementById("formFeedback");

    const botaoEnviar = form.querySelector(".form-submit");

    const campos = {

        nome: {
            input: form.nome,
            erro: document.getElementById("erro-nome"),
            validar(valor){

                if(!valor) return "Digite seu nome.";

                if(valor.trim().length < 3) return "Digite seu nome completo.";

                return "";

            }
        },

        email: {
            input: form.email,
            erro: document.getElementById("erro-email"),
            validar(valor){

                if(!valor) return "Digite seu e-mail.";

                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

                if(!emailRegex.test(valor.trim())) return "Digite um e-mail válido.";

                return "";

            }
        },

        telefone: {
            input: form.telefone,
            erro: document.getElementById("erro-telefone"),
            validar(valor){

                if(!valor) return "Digite seu telefone.";

                const apenasNumeros = valor.replace(/\D/g,"");

                if(apenasNumeros.length < 10 || apenasNumeros.length > 11){

                    return "Digite um telefone válido, com DDD.";

                }

                return "";

            }
        },

        mensagem: {
            input: form.mensagem,
            erro: document.getElementById("erro-mensagem"),
            validar(valor){

                if(!valor) return "Escreva sua mensagem.";

                if(valor.trim().length < 10) return "Conte um pouco mais (mín. 10 caracteres).";

                return "";

            }
        }

    };

    function mostrarErro(campo, mensagem){

        campo.input.classList.toggle("invalid", Boolean(mensagem));

        if(campo.erro){

            campo.erro.textContent = mensagem;

        }

    }

    function validarCampo(nomeCampo){

        const campo = campos[nomeCampo];

        const mensagem = campo.validar(campo.input.value);

        mostrarErro(campo, mensagem);

        return mensagem === "";

    }

    function validarFormulario(){

        let valido = true;

        let primeiroInvalido = null;

        Object.keys(campos).forEach(nomeCampo=>{

            const ok = validarCampo(nomeCampo);

            if(!ok){

                valido = false;

                if(!primeiroInvalido){

                    primeiroInvalido = campos[nomeCampo].input;

                }

            }

        });

        if(primeiroInvalido){

            primeiroInvalido.focus();

        }

        return valido;

    }

    /* Limpa o erro do campo assim que a pessoa corrige */

    Object.keys(campos).forEach(nomeCampo=>{

        const campo = campos[nomeCampo];

        campo.input.addEventListener("input", ()=>{

            if(campo.input.classList.contains("invalid")){

                validarCampo(nomeCampo);

            }

        });

        campo.input.addEventListener("blur", ()=>{

            validarCampo(nomeCampo);

        });

    });

    function formatarTelefoneExibicao(valor){

        const numeros = valor.replace(/\D/g,"");

        if(numeros.length === 11){

            return `(${numeros.slice(0,2)}) ${numeros.slice(2,7)}-${numeros.slice(7)}`;

        }

        if(numeros.length === 10){

            return `(${numeros.slice(0,2)}) ${numeros.slice(2,6)}-${numeros.slice(6)}`;

        }

        return valor;

    }

    function mostrarFeedback(texto, tipo){

        if(!feedback) return;

        feedback.textContent = texto;

        feedback.classList.remove("is-error","is-success");

        feedback.classList.add(tipo === "erro" ? "is-error" : "is-success");

    }

    function abrirWhatsapp(nome, email, telefone, mensagem){

        const texto = `Olá! Vim pelo site da Fabinho Guinchos.

    *Nome:* ${nome}
    *E-mail:* ${email}
    *Telefone:* ${telefone}

    *Mensagem:*
    ${mensagem}`;

        const url = `https://wa.me/${whatsappNumero}?text=${encodeURIComponent(texto)}`;

        window.open(url, "_blank", "noopener,noreferrer");

    }
    form.addEventListener("submit", event=>{

        event.preventDefault();

        if(feedback){

            feedback.textContent = "";

            feedback.classList.remove("is-error","is-success");

        }

        if(!validarFormulario()){

            mostrarFeedback("Confira os campos destacados antes de enviar.", "erro");

            return;

        }

        const nome = form.nome.value.trim();
        const email = form.email.value.trim();
        const telefone = formatarTelefoneExibicao(form.telefone.value.trim());
        const mensagem = form.mensagem.value.trim();

        if(botaoEnviar){

            botaoEnviar.disabled = true;

            botaoEnviar.textContent = "Enviando...";

        }

        function finalizarEnvio(){

            if(botaoEnviar){

                botaoEnviar.disabled = false;

                botaoEnviar.textContent = "Enviar pelo WhatsApp";

            }

            form.reset();

            Object.keys(campos).forEach(nomeCampo=>mostrarErro(campos[nomeCampo],""));

        }

        /* WhatsApp sempre funciona, não depende de nenhuma configuração */

        abrirWhatsapp(nome, email, telefone, mensagem);

        mostrarFeedback(
            "WhatsApp aberto com sucesso! É só confirmar o envio da mensagem.",
            "sucesso"
        );

        finalizarEnvio();

    });

})();
