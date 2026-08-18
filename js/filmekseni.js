var rule = {
    title: 'FilmEkseni',
    host: 'https://filmekseni.vip',

    homeUrl: '/',

    url: '/fyclass/page/fypage/',

    searchUrl: '/?s=**',

    searchable: 2,
    quickSearch: 1,
    filterable: 0,

    headers: {
        'User-Agent': 'MOBILE_UA'
    },

    timeout: 5000,

    class_name: 'Filmler&Diziler',
    class_url: 'filmler&diziler',

    play_parse: true,

    推荐: '',

    一级: `js:
        let d = [];

        let html = request(input);

        /*
         * FilmEkseni film/dizi linkleri:
         * /film-adi/
         *
         * Önce sayfadaki bütün linkleri alıyoruz.
         */
        let links = pdfa(html, 'a');

        links.forEach(function(it) {
            try {
                let url = pd(it, 'a&&href');
                let title = pdfh(it, 'a&&Text');

                if (!url || !title) return;

                /*
                 * Menü ve gereksiz linkleri ele.
                 */
                if (
                    url.indexOf('filmekseni.vip') < 0 &&
                    url.indexOf('/') !== 0
                ) return;

                let bad = [
                    'Anasayfa',
                    'Keşfet',
                    'Filmler',
                    'Diziler',
                    'İletişim',
                    'Tümünü Gör'
                ];

                if (bad.indexOf(title.trim()) >= 0) return;

                /*
                 * Poster bulmaya çalış.
                 */
                let pic = '';

                try {
                    pic = pd(it, 'img&&data-src');
                    if (!pic) pic = pd(it, 'img&&src');
                } catch(e) {}

                /*
                 * Poster varsa bunu içerik kabul et.
                 */
                if (pic) {
                    d.push({
                        title: title.trim(),
                        pic_url: pic,
                        url: url
                    });
                }

            } catch(e) {}
        });

        /*
         * Aynı filmi birden fazla kez bulursa temizle.
         */
        let seen = {};
        let out = [];

        d.forEach(function(it) {
            if (!seen[it.url]) {
                seen[it.url] = true;
                out.push(it);
            }
        });

        setResult(out);
    `,

    二级: `js:
        let html = request(input);

        VOD = {
            vod_id: input,
            vod_name: '',
            vod_pic: '',
            type_name: '',
            vod_year: '',
            vod_area: '',
            vod_remarks: '',
            vod_actor: '',
            vod_director: '',
            vod_content: '',
            vod_play_from: '',
            vod_play_url: ''
        };

        try {
            VOD.vod_name = pdfh(html, 'h1&&Text');
        } catch(e) {}

        try {
            VOD.vod_pic = pd(html, 'img&&src');
        } catch(e) {}

        try {
            VOD.vod_content =
                pdfh(html, '.description&&Text') ||
                pdfh(html, 'article&&Text');
        } catch(e) {}

        /*
         * İlk aşamada detay ekranının
         * düzgün gelip gelmediğini test ediyoruz.
         */

        VOD.vod_play_from = 'FilmEkseni';

        /*
         * Şimdilik gerçek stream çözmüyoruz.
         * Detay ekranı çalışınca bunu ekleyeceğiz.
         */
        VOD.vod_play_url = 'Web Sayfası$' + input;
    `,

    搜索: `js:
        let d = [];

        let html = request(input);

        let links = pdfa(html, 'a');

        links.forEach(function(it) {
            try {
                let url = pd(it, 'a&&href');
                let title = pdfh(it, 'a&&Text');

                if (!url || !title) return;

                let pic = '';

                try {
                    pic = pd(it, 'img&&data-src');
                    if (!pic) pic = pd(it, 'img&&src');
                } catch(e) {}

                if (pic) {
                    d.push({
                        title: title.trim(),
                        pic_url: pic,
                        url: url
                    });
                }

            } catch(e) {}
        });

        let seen = {};
        let out = [];

        d.forEach(function(it) {
            if (!seen[it.url]) {
                seen[it.url] = true;
                out.push(it);
            }
        });

        setResult(out);
    `,

    lazy: ''
};
