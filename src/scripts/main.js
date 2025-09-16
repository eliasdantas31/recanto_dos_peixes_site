document.addEventListener("DOMContentLoaded", () => {
    // header blur (seu código original)
    window.addEventListener('scroll', () => {
        const header = document.querySelector('.header');
        if (header) header.classList.toggle('blur', window.scrollY > 0);
    });

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
            // não inicializa se algo estiver faltando
            return;
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
            // quantos itens cabem (garante ao menos 1)
            return Math.max(1, Math.floor((vpW + gap) / (itW + gap)));
        }

        function maxIndex() {
            const visible = itemsVisible();
            return Math.max(0, items.length - visible);
        }

        function update() {
            const step = stepWidth();
            // assegura index válido
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

        // resize -> recalcula (debounce)
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
            // forçar um pequeno timeout para garantir layout
            setTimeout(update, 50);
        });

        // fallback inicial
        update();
    }

    // Inicializa todos os containers que tenham uma classe começando por "carousel-"
    const possibleCarousels = document.querySelectorAll('[class*="carousel-"]');
    possibleCarousels.forEach(el => {
        // só inicializa elementos que têm exatamente uma classe raiz do tipo carousel-xxx (evita inicializar itens internos)
        const hasRoot = Array.from(el.classList).some(c => /^carousel-[a-z0-9_-]+$/.test(c));
        if (hasRoot) initCarouselBase(el);
    });

    // ---------- FIM Generic carousel initializer ----------
});