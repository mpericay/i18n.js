require.config({
    baseUrl: '../src/',
    paths: {
        'text': '//cdnjs.cloudflare.com/ajax/libs/require-text/2.0.12/text.min'
    }
});

require(['i18n'], function(i18n) {
	document.getElementById("select").onchange = function(evt) {
        var lang = evt.target.options[evt.target.selectedIndex].innerHTML;
        i18n.setLang(lang);
        i18n.translateDocTree();
    }
});
