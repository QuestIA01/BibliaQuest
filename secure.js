// secure.js
// Bloqueia alterações no link de doação e previne mudanças críticas via console

(function() {
    // Definir o link correto da doação
    const donationLink = "https://link.mercadopago.com.br/questia";

    const donationBtn = document.querySelector(".donation-btn");

    if (donationBtn) {
        donationBtn.href = donationLink;

        // Observa alterações no elemento do botão
        const observer = new MutationObserver(mutations => {
            mutations.forEach(mutation => {
                if (donationBtn.href !== donationLink) {
                    console.warn("Tentativa de alteração detectada. Restaurando link.");
                    donationBtn.href = donationLink;
                }
            });
        });

        observer.observe(donationBtn, {
            attributes: true,
            attributeFilter: ["href"]
        });
    }

    // Prevenir modificações críticas via console
    Object.freeze(donationBtn); // impede reatribuição do botão
})();
