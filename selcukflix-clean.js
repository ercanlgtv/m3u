(function () {
    "use strict";

    const BAD_WORDS = [
        "casino", "bahis", "bonus", "slot", "bet",
        "axwin", "dedebet", "grandpasha", "palazzo",
        "bets10", "1xbet", "betnano", "bettilt",
        "betwinner", "betgar", "kaçak bahis"
    ];

    function bad(text) {
        if (!text) return false;
        text = String(text).toLowerCase();
        return BAD_WORDS.some(w => text.includes(w));
    }

    function removeAdElement(el) {
        if (!el || el === document.body || el === document.documentElement)
            return;

        let target = el;

        // Reklam resminin içinde bulunduğu banner kutusunu da kaldır
        for (let i = 0; i < 3; i++) {
            if (!target.parentElement) break;

            const parent = target.parentElement;
            const r = parent.getBoundingClientRect();

            // Büyük banner/reklam kapsayıcısını seç
            if (
                r.width > 250 &&
                r.height > 40 &&
                r.height < 700
            ) {
                target = parent;
            } else {
                break;
            }
        }

        target.remove();
    }

    function scan() {

        document.querySelectorAll(
            "img,a,iframe,div,section,aside,span,script"
        ).forEach(el => {

            let info = "";

            try {
                info += " " + (el.src || "");
                info += " " + (el.href || "");
                info += " " + (el.alt || "");
                info += " " + (el.title || "");
                info += " " + (el.id || "");

                if (typeof el.className === "string")
                    info += " " + el.className;

                // background-image URL
                const style = getComputedStyle(el);

                if (style.backgroundImage)
                    info += " " + style.backgroundImage;

                // Sadece küçük miktarda görünür metne bak
                if (
                    el.tagName === "A" ||
                    el.tagName === "SPAN"
                ) {
                    info += " " + (el.innerText || "");
                }

            } catch (e) {}

            if (bad(info)) {
                removeAdElement(el);
            }
        });


        /*
         * Genel reklam / popup sınıfları
         */

        const selectors = [
            "[class*='advert']",
            "[id*='advert']",
            "[class*='banner-ad']",
            "[id*='banner-ad']",
            "[class*='popup-ad']",
            "[id*='popup-ad']",
            "[class*='casino']",
            "[id*='casino']",
            "[class*='bet-banner']",
            "[id*='bet-banner']"
        ];

        selectors.forEach(selector => {
            try {
                document.querySelectorAll(selector)
                    .forEach(el => el.remove());
            } catch (e) {}
        });


        /*
         * Popup kaldırıldıktan sonra sayfanın
         * kilitli kalmasını önle.
         */

        try {
            document.documentElement.style.overflow = "auto";
            document.body.style.overflow = "auto";
        } catch (e) {}
    }


    // İlk yüklemede
    scan();


    // Dinamik reklamlar
    const observer = new MutationObserver(() => scan());

    observer.observe(document.documentElement, {
        childList: true,
        subtree: true
    });


    // Gecikmeli reklamlar
    let n = 0;

    const timer = setInterval(() => {
        scan();

        if (++n >= 60)
            clearInterval(timer);

    }, 1000);


    console.log("WebHTV SelcukFlix Ad Cleaner v2 aktif");
})();
