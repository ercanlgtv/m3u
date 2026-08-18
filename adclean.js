(function () {
    "use strict";

    const BAD_WORDS = [
        "casino",
        "bahis",
        "bonus",
        "slot",
        "bet",
        "1xbet",
        "bets10",
        "betwinner",
        "grandpasha",
        "palazzo",
        "axwin",
        "dedebet",
        "betnano",
        "bettilt",
        "betgar"
    ];

    const BAD_SELECTORS = [
        ".ads",
        ".ad",
        ".advert",
        ".advertisement",
        ".ad-container",
        ".ad-wrapper",
        ".ad-banner",
        ".banner-ad",
        ".popup",
        ".popup-ad",
        ".overlay",
        ".modal-backdrop",
        "[class*='advert']",
        "[id*='advert']",
        "[class*='popup']",
        "[id*='popup']",
        "[class*='casino']",
        "[id*='casino']",
        "[class*='bet-banner']",
        "[id*='bet-banner']"
    ];

    function hasBadWord(text) {
        if (!text) return false;

        text = String(text).toLowerCase();

        return BAD_WORDS.some(function (word) {
            return text.indexOf(word) !== -1;
        });
    }

    function removeContainer(el) {
        if (!el || el === document.body || el === document.documentElement) {
            return;
        }

        let target = el;

        for (let i = 0; i < 3; i++) {
            if (!target.parentElement) break;

            const parent = target.parentElement;

            try {
                const rect = parent.getBoundingClientRect();

                if (
                    rect.width > 220 &&
                    rect.height > 40 &&
                    rect.height < 700
                ) {
                    target = parent;
                } else {
                    break;
                }
            } catch (e) {
                break;
            }
        }

        try {
            target.remove();
        } catch (e) {}
    }

    function inspect(el) {
        if (!el || !el.tagName) return;

        let info = "";

        try {
            info += " " + (el.src || "");
            info += " " + (el.href || "");
            info += " " + (el.alt || "");
            info += " " + (el.title || "");
            info += " " + (el.id || "");

            if (typeof el.className === "string") {
                info += " " + el.className;
            }

            const style = getComputedStyle(el);

            if (style.backgroundImage) {
                info += " " + style.backgroundImage;
            }

            if (
                el.tagName === "A" ||
                el.tagName === "SPAN"
            ) {
                info += " " + (el.innerText || "");
            }

        } catch (e) {}

        if (!hasBadWord(info)) return;

        const tag = el.tagName.toLowerCase();

        if (
            tag === "iframe" ||
            tag === "img" ||
            tag === "a" ||
            tag === "script"
        ) {
            removeContainer(el);
            return;
        }

        try {
            const style = getComputedStyle(el);
            const rect = el.getBoundingClientRect();

            if (
                style.position === "fixed" ||
                style.position === "sticky" ||
                rect.width > 250 ||
                rect.height > 100
            ) {
                removeContainer(el);
            }
        } catch (e) {}
    }

    function clean() {
        BAD_SELECTORS.forEach(function (selector) {
            try {
                document.querySelectorAll(selector).forEach(function (el) {
                    el.remove();
                });
            } catch (e) {}
        });

        document.querySelectorAll(
            "iframe,img,a,script,aside,section,div,span"
        ).forEach(inspect);

        try {
            document.documentElement.style.overflow = "auto";
            document.body.style.overflow = "auto";
        } catch (e) {}
    }

    clean();

    const observer = new MutationObserver(function (mutations) {
        mutations.forEach(function (mutation) {
            mutation.addedNodes.forEach(function (node) {
                if (node.nodeType !== 1) return;

                inspect(node);

                if (node.querySelectorAll) {
                    node.querySelectorAll(
                        "iframe,img,a,script,aside,section,div,span"
                    ).forEach(inspect);
                }
            });
        });

        clean();
    });

    observer.observe(document.documentElement, {
        childList: true,
        subtree: true
    });

    let count = 0;

    const timer = setInterval(function () {
        clean();

        count++;

        if (count >= 60) {
            clearInterval(timer);
        }
    }, 1000);

    console.log("[WebHTV] General AdClean aktif");
})();