AOS.init();

document.addEventListener("DOMContentLoaded", () => {
    // ---------- Generic carousel initializer ----------
    function initCarouselBase(containerEl) {
        // encontra a "base class" do tipo carousel-xxx (ex: carousel-infraestrutura)
        const baseClass = Array.from(containerEl.classList).find(c => c.startsWith('carousel-') && !c.includes('__'));
        if (!baseClass) return;

        const track = containerEl.querySelector(`.${baseClass}__track`);
        const viewport = containerEl.querySelector(`.${baseClass}__viewport`);
        const items = Array.from(containerEl.querySelectorAll(`.${baseClass}__item`));
        const prevBtn = containerEl.querySelector(`.${baseClass}__control--prev`);
        const nextBtn = containerEl.querySelector(`.${baseClass}__control--next`);

        if (!track || !viewport || items.length === 0 || !prevBtn || !nextBtn) {
            return; // não inicializa se algo estiver faltando
        }

        let index = 0;

        function getGap() {
            const styles = getComputedStyle(track);
            return parseFloat(styles.gap || styles.columnGap || 0) || 0;
        }

        function stepWidth() {
            const itemRect = items[0].getBoundingClientRect();
            return itemRect.width + getGap();
        }

        function itemsVisible() {
            const vpW = viewport.clientWidth;
            const itW = items[0].getBoundingClientRect().width;
            const gap = getGap();
            return Math.max(1, Math.floor((vpW + gap) / (itW + gap)));
        }

        function maxIndex() {
            const visible = itemsVisible();
            return Math.max(0, items.length - visible);
        }

        function update() {
            const step = stepWidth();
            const max = maxIndex();
            if (index < 0) index = max;
            if (index > max) index = 0;
            track.style.transform = `translateX(-${index * step}px)`;
        }

        nextBtn.addEventListener("click", () => {
            index++;
            if (index > maxIndex()) index = 0;
            update();
        });

        prevBtn.addEventListener("click", () => {
            index--;
            if (index < 0) index = maxIndex();
            update();
        });

        // resize -> recalcula (com debounce)
        let rt;
        window.addEventListener('resize', () => {
            clearTimeout(rt);
            rt = setTimeout(update, 80);
        }, { passive: true });

        // espera imagens carregarem antes do primeiro cálculo
        const imgs = items.map(it => it.querySelector('img')).filter(Boolean);
        const loadPromises = imgs.map(img => new Promise(resolve => {
            if (img.complete) return resolve();
            img.addEventListener('load', resolve);
            img.addEventListener('error', resolve);
        }));

        Promise.all(loadPromises).then(() => {
            setTimeout(update, 50);
        });

        // fallback inicial
        update();
    }

    // Inicializa todos os containers que tenham uma classe começando por "carousel-"
    const possibleCarousels = document.querySelectorAll('[class*="carousel-"]');
    possibleCarousels.forEach(el => {
        const hasRoot = Array.from(el.classList).some(c => /^carousel-[a-z0-9_-]+$/.test(c));
        if (hasRoot) initCarouselBase(el);
    });
    // ---------- FIM Generic carousel initializer ----------
});

// componentização header
class Header extends HTMLElement {
    connectedCallback() {
        const url = new URL("../components/header.html", import.meta.url);

        fetch(url)
            .then(res => res.text())
            .then(data => {
                this.innerHTML = data;

                const toggle = this.querySelector("#header-toggle");
                const toggleIcon = this.querySelector("#header-toggle-icon");
                const mobile = this.querySelector("#header-mobile");
                const header = this.querySelector(".header");

                if (toggle && mobile) {
                    toggle.addEventListener("click", () => {
                        if (mobile.attributes['aria-hidden'].value === "true") {
                            mobile.setAttribute("aria-hidden", "false");
                            mobile.classList.add("is-active");
                            header.style.backgroundColor = "#fff";
                            toggle.style.color = "#000";
                            toggleIcon.classList.replace("bi-list", "bi-x-lg");
                        } else {
                            mobile.setAttribute("aria-hidden", "true");
                            mobile.classList.remove("is-active");
                            header.style.backgroundColor = "transparent";
                            toggle.style.color = "#fff";
                            toggleIcon.classList.replace("bi-x-lg", "bi-list");
                        }
                    });
                }

                window.addEventListener("scroll", () => {
                    if (header) {
                        header.classList.toggle("blur", window.scrollY > 0);
                    }
                });
            })
            .catch(err => console.error("Erro ao carregar header:", err));
    }
}
customElements.define("header-component", Header);

// componentização footer
class Footer extends HTMLElement {
    connectedCallback() {
        const url = new URL("../components/footer.html", import.meta.url);

        fetch(url)
            .then(res => res.text())
            .then(data => {
                this.innerHTML = data;
            })
            .catch(err => console.error("Erro ao carregar footer:", err));
    }
}
customElements.define("footer-component", Footer);

//componentização Whatsapp
class Whatsapp extends HTMLElement {
    connectedCallback() {
        const url = new URL("../components/whatsapp_icon.html", import.meta.url);

        fetch(url)
            .then(res => res.text())
            .then(data => {
                this.innerHTML = data;

                const whatsappIcon = this.querySelector("#whatsapp-icon");

                window.addEventListener("scroll", () => {
                    if (whatsappIcon) {
                        whatsappIcon.classList.toggle("whatsapp-icon-show", window.scrollY > 0);
                    }
                });
            })
            .catch(err => console.error("Erro ao carregar whatsapp:", err));
    }
}

customElements.define("whatsapp-component", Whatsapp);