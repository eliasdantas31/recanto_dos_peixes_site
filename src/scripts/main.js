import "../componentes/header/header.js";
import "../componentes/footer/footer.js";

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
            return Math.max(1, Math.floor((vpW + gap) / (itW + gap))); // ao menos 1 item
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