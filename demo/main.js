require.config({
    baseUrl: '../src/',
    paths: {
        'text': '//cdnjs.cloudflare.com/ajax/libs/require-text/2.0.12/text.min'
    }
});

require(['i18n'], function(i18n) {
    i18n.translateDocTree();
});
