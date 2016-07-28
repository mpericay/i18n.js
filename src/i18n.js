/**
 * @author Oscar Fonts <oscar.fonts@geomati.co>
 */
define(['text!translations.json'], function(bundle) {
    "use strict";

    var defaultLang = "en";

    var translations = JSON.parse(bundle);

    var params = {};
    location.search.substr(1).split("&").forEach(function(item) {
        var kv = item.split("=");
        params[kv[0]] = kv[1];
    });

    var activeLang;
    setLang(params.hasOwnProperty('lang') ? params.lang : defaultLang);

    function setLang(lang) {
        activeLang = lang;
        console.debug('Language set to ' + activeLang);
    }

    function template(string, values){
        for (var key in values)
            string = string.replace(new RegExp('{'+key+'}','g'), values[key]);
        return string;
    }

    function t(string, values) {
        if (translations.hasOwnProperty(string) && translations[string].hasOwnProperty(activeLang)) {
            string = translations[string][activeLang];
        }
        return template(string, values);
    }
    
    function untrim(string, leftSpace = 0, rightSpace = 0) {
        return Array(leftSpace+1).join(" ") + string + Array(rightSpace+1).join(" ");
    }
    
    function reverseString(s) {
        return s.split('').reverse().join('');
    }

    function translateFrom(lang, string, values) {
        var leftSpace = string.search(/\S/);
        var rightSpace = reverseString(string).search(/\S/);
        string = string.trim();
        if (!lang || lang == defaultLang) {
            return untrim(t(string, values), leftSpace, rightSpace);
        }
        for(var i in translations) {
            var token = translations[i];
            if(token[lang] && token[lang] == string) {
                var string = activeLang == defaultLang ? i : token[activeLang]
                return untrim(template(string, values), leftSpace, rightSpace);
            }
        }
        return untrim(template(string, values), leftSpace, rightSpace);
    }

    return {
        langs: function() {
            return translations.langs;
        },
        getLang: function() {
            return activeLang;
        },
        setLang: setLang,
        t: t,
        addTranslations: function(bundle) {
            Object.keys(bundle).forEach(function(key) {
                if (!translations.hasOwnProperty(key)) {
                    translations[key] = bundle[key];
                } else {
                    console.warn("Skipping duplicate entry '" + key + "' in translation bundle.");
                }
            });
        },
        translateDocTree: function(el) {
            if (!el) el = document;
            var srcLang = el.lang;
            var treeWalker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT, null, false);
            while (treeWalker.nextNode()) {
                var node = treeWalker.currentNode;
                if(/\S/.test(node.nodeValue)) { // Not a whitespace-only text node
                    node.nodeValue = translateFrom(srcLang, node.nodeValue);
                }
            }
            el.lang = activeLang;
        }
    };
});
