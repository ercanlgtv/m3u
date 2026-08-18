(function () {
    "use strict";

    const BAD_WORDS = [
        "casino",
        "bet",
        "bahis",
        "bonus",
        "slot",
        "grandpasha",
        "palazzo",
        "betnano",
        "bettilt",
        "betgar",
        "betwinner",
        "1xbet",
        "bets10"
    ];

    const BAD_SELECTORS = [
        ".ads",
        ".ad",
        ".advert",
        ".advertisement",
        ".ad-container",
        ".ad-wrapper",
        ".popup",
        ".pop-up",
        ".overlay",
        ".modal-backdrop",
        "[class*='advert']",
        "[id*='advert']",
        "[class*='casino']",
        "[id*='casino']",
        "[class*='bet-']",
        "[id*='bet-']",
        "[class*='popup']",
        "[id*='popup']"
    ];

    function containsBadWord(text) {
        if (!text) return false;

        text = String(text).toLowerCase();

        return BAD_WORDS.some(function (word) {
            return text.indexOf(word) !== -1;
        });
    }

    function removeKnownAds() {
        BAD_SELECTORS.forEach(function (selector) {
            try {
                document.querySelectorAll(selector).forEach(function (el) {
                    el.remove();
                });
            } catch (e) {}
        });
    }

    function inspectElement(el) {
        if (!el || !el.tagName) return;

        const tag = el.tagName.toLowerCase();

        const src =
            el.src ||
            el.getAttribute("src") ||
            "";

        const href =
            el.href ||
            el.getAttribute("href") ||
            "";

        const cls =
            typeof el.className === "string"
                ? el.className
                : "";

        const id = el.id || "";

        const title =
            el.getAttribute("title") ||
            el.getAttribute("aria-label") ||
            "";

        const combined =
            src + " " +
            href + " " +
            cls + " " +
            id + " " +
            title;

        if (containsBadWord(combined)) {
            /*
             * Script/link/img/iframe doğrudan reklam domainine
             * gidiyorsa kaldır.
             */
            if (
                tag === "iframe" ||
                tag === "img" ||
                tag === "script" ||
                tag === "a"
            ) {
                el.remove();
                return;
            }

            /*
             * Büyük sabit reklam bloklarını kaldır.
             */
            try {
                const style = getComputedStyle(el);
                const rect = el.getBoundingClientRect();

                if (
                    style.position === "fixed" ||
                    style.position === "sticky" ||
                    rect.width > 250 ||
                    rect.height > 120
                ) {
                    el.remove();
                }
            } catch (e) {}
        }
    }

    function cleanPage() {
        removeKnownAds();

        document
            .querySelectorAll(
                "iframe,img,a,script,aside,section,div"
            )
            .forEach(inspectElement);

        /*
         * Reklam kaldırılınca body üzerinde kalan
         * scroll kilidini aç.
         */
        try {
            document.documentElement.style.overflow = "auto";
            document.body.style.overflow = "auto";
        } catch (e) {}
    }

    /*
     * İlk yükleme.
     */
    cleanPage();

    /*
     * Sonradan açılan popup/reklamları izle.
     */
    const observer = new MutationObserver(function (mutations) {
        mutations.forEach(function (mutation) {
            mutation.addedNodes.forEach(function (node) {
                if (node.nodeType === 1) {
                    inspectElement(node);

                    if (node.querySelectorAll) {
                        node
                            .querySelectorAll(
                                "iframe,img,a,script,aside,section,div"
                            )
                            .forEach(inspectElement);
                    }
                }
            });
        });

        removeKnownAds();
    });

    observer.observe(document.documentElement, {
        childList: true,
        subtree: true
    });

    /*
     * Bazı reklamlar gecikmeli geldiği için
     * ilk 30 saniye periyodik temizlik.
     */
    let count = 0;

    const timer = setInterval(function () {
        cleanPage();

        count++;

        if (count >= 30) {
            clearInterval(timer);
        }
    }, 1000);

    console.log("[WebHTV] SelcukFlix Clean extension active");
})();