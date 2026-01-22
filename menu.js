/* Geração dinâmica dos capítulos */
const grid = document.getElementById("genesis-chapters");
const nomeDaPastaLivro = "Genesis";

for (let i = 1; i <= 50; i++) {
    const btn = document.createElement("a");
    btn.href = `${nomeDaPastaLivro}/genesis_${i}/index.html`;
    btn.className = "chapter-btn";
    btn.textContent = i;
    grid.appendChild(btn);
}

/* Registro do Service Worker */
if ("serviceWorker" in navigator) {
    window.addEventListener("load", () => {
        navigator.serviceWorker.register("service-worker.js");
    });
}
