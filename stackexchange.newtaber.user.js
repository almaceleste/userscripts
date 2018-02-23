// ==UserScript==
// @name         StackExchange userlink newtaber
// @namespace    https://github.com/almaceleste/userscripts
// @downloadURL  https://github.com/almaceleste/userscripts/stackexchange.newtaber.user.js
// @downloadURL  https://github.com/almaceleste/userscripts/stackexchange.newtaber.meta.js
// @version      0.1
// @description  this code opens user links from posts, answers and (maybe) comments in the new tab instead of the annoying in-place opening
// @author       Paola Captanovska
// @match        https://*.stackexchange.com/questions/*
// @match        https://*.stackoverflow.com/questions/*
// @match        https://askubuntu.com/questions/*
// @match        https://mathoverflow.net/questions/*
// @match        https://serverfault.com/questions/*
// @match        https://stackapps.com/questions/*
// @match        https://superuser.com/questions/*
// @require       http://ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    $('.postcell a, .answercell a, .comment-text a').each(function() {
        var a = new RegExp('/' + window.location.host + '/');
        if(!a.test(this.href)) {
            $(this).click(function(event) {
                event.preventDefault();
                event.stopPropagation();
                window.open(this.href, '_blank');
            });
        }
    });
})();