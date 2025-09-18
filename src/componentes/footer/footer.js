class Footer extends HTMLElement {
    connectedCallback() {
        // caminho dinâmico para o arquivo HTML do footer
        const url = new URL("./_footer.html", import.meta.url);

        fetch(url)
            .then(res => res.text())
            .then(data => {
                this.innerHTML = data;
            })
            .catch(err => console.error("Erro ao carregar footer:", err));
    }
}

customElements.define("footer-component", Footer);