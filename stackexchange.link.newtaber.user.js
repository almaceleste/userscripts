// ==UserScript==
// @name            StackExchange link newtaber
// @namespace       https://github.com/almaceleste/userscripts
// @version         0.3.3
// @description     this code opens links from posts, answers, comments and user signatures in the new tab instead of the annoying in-place opening
// @description:ru  этот код открывает ссылки из постов, ответов, комментариев и подписей пользователей в новой вкладке вместо надоедливого открытия в текущей
// @author          (ɔ) Paola Captanovska
// @license         GPL-3.0+; http://www.gnu.org/licenses/gpl-3.0.txt
// @icon            https://cdn1.iconfinder.com/data/icons/feather-2/24/external-link-128.png

// @homepageURL     https://github.com/almaceleste/userscripts
// @supportURL      https://github.com/almaceleste/userscripts/issues
// @updateURL       https://github.com/almaceleste/userscripts/raw/master/stackexchange.link.newtaber.meta.js
// @downloadURL     https://github.com/almaceleste/userscripts/raw/master/stackexchange.link.newtaber.user.js
// @downloadURL     https://openuserjs.org/install/almaceleste/StackExchange_link_newtaber.user.js

// @grant           none

// @match           https://*.stackexchange.com/questions/*
// @match           https://*.stackoverflow.com/questions/*
// @match           https://askubuntu.com/questions/*
// @match           https://mathoverflow.net/questions/*
// @match           https://serverfault.com/questions/*
// @match           https://stackapps.com/questions/*
// @match           https://superuser.com/questions/*
// ==/UserScript==

// ==OpenUserJS==
// @author almaceleste
// ==/OpenUserJS==

(function() {
    'use strict';

    $('.post-text a, .comment-copy a, .user-details a').each(function() {
        $(this).click(function(event) {
            event.preventDefault();
            event.stopPropagation();
            window.open(this.href, '_blank');
        });
    });
})();
