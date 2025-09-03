document.addEventListener("DOMContentLoaded", () => {

    // Js Header
    window.addEventListener('scroll', () => {
        const header = document.querySelector('.header');
        header.classList.toggle('blur', window.scrollY > 0);
    })


    // Js carousel _restaurante_home.scss
    const track = document.querySelector(".carousel-restaurante__track");
    const items = [...document.querySelectorAll(".carousel-restaurante__item")];
    const prevBtn = document.querySelector(".carousel-restaurante__control--prev");
    const nextBtn = document.querySelector(".carousel-restaurante__control--next");

    const itemsToShow = 3;
    let index = 0;

    function stepWidth() {
        const itemW = items[0].getBoundingClientRect().width;
        const styles = getComputedStyle(track);
        const gap = parseFloat(styles.gap || styles.columnGap || 0);
        return itemW + gap;
    }

    function update() {
        track.style.transform = `translateX(-${index * stepWidth()}px)`;
    }

    nextBtn.addEventListener("click", () => {
        index++;
        const maxIndex = Math.max(0, items.length - itemsToShow);
        if (index > maxIndex) index = 0;
        update();
    });

    prevBtn.addEventListener("click", () => {
        index--;
        const maxIndex = Math.max(0, items.length - itemsToShow);
        if (index < 0) index = maxIndex;
        update();
    });

    window.addEventListener("resize", update, { passive: true });

    update();
});