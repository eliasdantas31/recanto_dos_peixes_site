class Header extends HTMLElement {
    connectedCallback() {
        // caminho dinâmico para o arquivo HTML do header
        const url = new URL("./_header.html", import.meta.url);

        fetch(url)
            .then(res => res.text())
            .then(data => {
                this.innerHTML = data;

                // elementos do header
                const toggle = this.querySelector("#header-toggle");
                const mobile = this.querySelector("#header-mobile");
                const close = this.querySelector("#header-close");
                const header = this.querySelector(".header");

                // menu mobile
                if (toggle && mobile && close) {
                    toggle.addEventListener("click", () => {
                        mobile.setAttribute("aria-hidden", "false");
                        mobile.classList.add("is-active");
                    });

                    close.addEventListener("click", () => {
                        mobile.setAttribute("aria-hidden", "true");
                        mobile.classList.remove("is-active");
                    });
                }

                // efeito blur ao scroll
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