var rule = {
    title: 'FilmEkseni',
    host: 'https://filmekseni.vip',

    searchUrl: '/search/?q=**',

    searchable: 2,
    quickSearch: 1,
    filterable: 0,

    headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:150.0) Gecko/20100101 Firefox/150.0',
        'Referer': 'https://filmekseni.vip/',
        'Accept': 'application/json, */*'
    },

    class_name: 'Filmler&Diziler',
    class_url: 'film&dizi',

    推荐: '',

    一级: '',

    搜索: `js:
        let d = [];

        let html = request(input);

        let json = {};

        try {
            json = JSON.parse(html);
        } catch(e) {
            setResult([]);
            return;
        }

        let items = json.result || json.results || json || [];

        if (!Array.isArray(items)) {
            items = [];
        }

        items.forEach(function(it) {
            try {
                let title =
                    it.title ||
                    it.akatitle ||
                    it.original_title ||
                    '';

                let pic =
                    it.posterUrl ||
                    it.poster ||
                    it.image ||
                    '';

                let url =
                    it.href ||
                    it.link ||
                    '';

                if (!url && it.slug) {
                    let prefix =
                        it.slug_prefix ||
                        (it.type && String(it.type).toLowerCase().includes('dizi')
                            ? 'dizi'
                            : 'film');

                    url =
                        'https://filmekseni.vip/' +
                        prefix +
                        '/' +
                        it.slug;
                }

                if (url && !url.startsWith('http')) {
                    url = 'https://filmekseni.vip' + url;
                }

                if (pic && pic.startsWith('//')) {
                    pic = 'https:' + pic;
                }

                if (pic && pic.startsWith('/')) {
                    pic = 'https://filmekseni.vip' + pic;
                }

                if (title && url) {
                    d.push({
                        title: title,
                        pic_url: pic,
                        desc: it.year || '',
                        url: url
                    });
                }

            } catch(e) {}
        });

        setResult(d);
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
            vod_play_from: 'FilmEkseni',
            vod_play_url: ''
        };

        try {
            VOD.vod_name =
                pdfh(html, 'h1&&Text') ||
                pdfh(html, 'title&&Text');
        } catch(e) {}

        try {
            VOD.vod_pic =
                pd(html, '.poster img&&src') ||
                pd(html, '.poster img&&data-src') ||
                pd(html, 'meta[property="og:image"]&&content') ||
                pd(html, 'img&&src');
        } catch(e) {}

        try {
            VOD.vod_content =
                pdfh(html, '.description&&Text') ||
                pdfh(html, '.content&&Text') ||
                pdfh(html, 'article&&Text');
        } catch(e) {}

        let iframe = '';

        try {
            iframe =
                pd(html, 'div.card-video iframe&&src') ||
                pd(html, '.player-container iframe&&src') ||
                pd(html, 'iframe&&src');
        } catch(e) {}

        if (iframe) {
            if (iframe.startsWith('//')) {
                iframe = 'https:' + iframe;
            }

            if (iframe.startsWith('/')) {
                iframe = 'https://filmekseni.vip' + iframe;
            }

            VOD.vod_play_url =
                'FilmEkseni$' + iframe;
        }
    `,

    lazy: `js:
        let playerUrl = input;

        let html = request(playerUrl, {
            headers: {
                'Referer': 'https://filmekseni.vip/',
                'User-Agent': 'Mozilla/5.0'
            }
        });

        let m =
            html.match(/file\\s*:\\s*["']([^"']+\\.m3u8[^"']*)["']/i) ||
            html.match(/file\\s*:\\s*["']([^"']+\\.mp4[^"']*)["']/i);

        if (m && m[1]) {

            input = {
                parse: 0,
                jx: 0,
                url: m[1],
                header: {
                    'Referer': playerUrl,
                    'User-Agent': 'Mozilla/5.0'
                }
            };

        } else {

            let m2 =
                html.match(/https?:\\/\\/[^"'\\s<>]+\\.m3u8[^"'\\s<>]*/i) ||
                html.match(/https?:\\/\\/[^"'\\s<>]+\\.mp4[^"'\\s<>]*/i);

            if (m2 && m2[0]) {

                input = {
                    parse: 0,
                    jx: 0,
                    url: m2[0],
                    header: {
                        'Referer': playerUrl,
                        'User-Agent': 'Mozilla/5.0'
                    }
                };

            } else {

                input = {
                    parse: 1,
                    jx: 1,
                    url: playerUrl
                };
            }
        }
    `
};
