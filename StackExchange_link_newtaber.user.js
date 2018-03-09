// ==UserScript==
// @name            StackExchange link newtaber
// @namespace       almaceleste
// @version         0.3.7
// @description     this code opens links from posts, answers, comments and user signatures in the new tab instead of the annoying in-place opening
// @description:ru  этот код открывает ссылки из постов, ответов, комментариев и подписей пользователей в новой вкладке вместо надоедливого открытия в текущей
// @author          (ɔ) Paola Captanovska
// @license         GPL-3.0+; http://www.gnu.org/licenses/gpl-3.0.txt
// @icon            https://cdn1.iconfinder.com/data/icons/feather-2/24/external-link-128.png

// @homepageURL     https://greasyfork.org/en/users/174037-almaceleste
// @homepageURL     https://openuserjs.org/users/almaceleste
// @homepageURL     https://github.com/almaceleste/userscripts
// @supportURL      https://github.com/almaceleste/userscripts/issues
// @updateURL       https://github.com/almaceleste/userscripts/raw/master/StackExchange_link_newtaber.meta.js
// @downloadURL     https://github.com/almaceleste/userscripts/raw/master/StackExchange_link_newtaber.user.js
// @downloadURL     https://openuserjs.org/install/almaceleste/StackExchange_link_newtaber.user.js

// @require         https://openuserjs.org/src/libs/sizzle/GM_config.js
// @grant           GM_getValue
// @grant           GM_setValue
// @grant           GM_registerMenuCommand

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

const postlink = '.post-text a';
const commentlink = '.comment-copy a';
const userdetailslink = '.user-details a';

const windowcss = '#newtaberCfg {background-color: lightblue;} #newtaberCfg .reset_holder {float: left; position: relative; bottom: -1em;} #newtaberCfg .saveclose_buttons {margin: .7em;}';
const iframecss = 'height: 19.2em; width: 30em; border: 1px solid; border-radius: 3px; position: fixed; z-index: 999;';

GM_registerMenuCommand('StackExchange link newtaber Settings', opencfg);

function opencfg()
{
	GM_config.open();
	newtaberCfg.style = iframecss;
}

GM_config.init(
{
    id: 'newtaberCfg',
    title: 'StackExchange link newtaber Settings',
    fields:
    {
        postlink:
        {
            section: ['Link types', 'Choose link types to open in new tab'],
            label: 'post links',
            labelPos: 'right',
            type: 'checkbox',
            default: true,
        },
        commentlink:
        {
            label: 'comment links',
            labelPos: 'right',
            type: 'checkbox',
            default: true,
        },
        userdetailslink:
        {
            label: 'userdetails links',
            labelPos: 'right',
            type: 'checkbox',
            default: true,
        },
    },
    css: windowcss,
    events:
    {
        save: function() {
            GM_config.close();
        }
    },
});

(function() {
    'use strict';

    var links = [];

    if(GM_config.get('postlink')) links.push(postlink);
    if(GM_config.get('commentlink')) links.push(commentlink);
    if(GM_config.get('userdetailslink')) links.push(userdetailslink);

    var pattern = links.join(', ');

    $(pattern).each(function() {
        $(this).click(function(event) {
            event.preventDefault();
            event.stopPropagation();
            window.open(this.href, '_blank');
        });
    });
})();
