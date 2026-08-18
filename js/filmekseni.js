var rule = {
    title: 'FilmEkseni',
    host: 'https://filmekseni.vip',

    homeUrl: '/',
    searchUrl: '/?s=**',

    searchable: 2,
    quickSearch: 0,
    filterable: 0,

    headers: {
        'User-Agent': 'Mozilla/5.0 (Linux; Android 10; TV) AppleWebKit/537.36 Chrome/120 Safari/537.36'
    },

    class_name: 'Filmler&Diziler&Aksiyon&Bilim Kurgu&Gerilim&Komedi&Korku&Suç',
    class_url: 'filmler&diziler&aksiyon&bilim-kurgu&gerilim&komedi&korku&suc',

    /*
     * Ana sayfadaki film kartları
     */
    推荐: '.movie-item;a&&title;img&&data-src;a&&href',

    /*
     * Kategori sayfalarındaki kartlar
     */
    一级: '.movie-item;a&&title;img&&data-src;a&&href',

    /*
     * Film detay sayfası
     */
    二级: {
        title: 'h1&&Text',
        img: '.poster img&&src',
        desc: '.description&&Text',
        content: '.description&&Text'
    },

    /*
     * Arama sonuçları
     */
    搜索: '.movie-item;a&&title;img&&data-src;a&&href',

    lazy: ''
};
