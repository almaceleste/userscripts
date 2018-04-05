// ==UserScript==
// @name            OpenSuse Software tweaks
// @namespace       almaceleste
// @version         0.1.1
// @description     this code opens package pages in new tab and minify hurge pacckage list
// @description:ru  этот код открывает страницы пакетов в новой вкладке и уменьшает список найденных пакетов
// @author          (ɔ) Paola Captanovska
// @license         AGPL-3.0; http://www.gnu.org/licenses/agpl.txt
// @icon            https://cdn1.iconfinder.com/data/icons/system-shade-circles/512/opensuse-32.png
// @icon64          https://cdn1.iconfinder.com/data/icons/system-shade-circles/512/opensuse-128.png

// @homepageURL     https://greasyfork.org/en/users/174037-almaceleste
// @homepageURL     https://openuserjs.org/users/almaceleste
// @homepageURL     https://github.com/almaceleste/userscripts
// @supportURL      https://github.com/almaceleste/userscripts/issues
// @updateURL       https://github.com/almaceleste/userscripts/raw/master/OpenSuse_Software_tweaks.meta.js
// @downloadURL     https://github.com/almaceleste/userscripts/raw/master/OpenSuse_Software_tweaks.user.js
// @downloadURL     https://openuserjs.org/install/almaceleste/OpenSuse_Software_tweaks.user.js

// @require         https://openuserjs.org/src/libs/sizzle/GM_config.js
// @grant           GM_getValue
// @grant           GM_setValue
// @grant           GM_registerMenuCommand

// @match           https://software.opensuse.org/search*
// @match           https://software.opensuse.org/package/*
// ==/UserScript==

// ==OpenUserJS==
// @author almaceleste
// ==/OpenUserJS==

const searchbox = '.search-box';
const searchresultlist = '.search-result-list';
const packagelink = '.package-card a';
const container = '.container';
const cardimg = '.package-card .card-img-top';
const cardblock = '.card-block';
const card = '.col-md-4';

const windowcss = '#osstweaksCfg {background-color: lightblue;} #osstweaksCfg .reset_holder {float: left; position: relative; bottom: -1em;} #osstweaksCfg .saveclose_buttons {margin: .7em;}';
const iframecss = 'height: 16.7em; width: 30em; border: 1px solid; border-radius: 3px; position: fixed; z-index: 999;';

GM_registerMenuCommand('OpenSuse Software tweaks Settings', opencfg);

function opencfg()
{
	GM_config.open();
	osstweaksCfg.style = iframecss;
}

GM_config.init(
{
    id: 'osstweaksCfg',
    title: 'OpenSuse Software tweaks',
    fields:
    {
        packagelink:
        {
            section: ['Package list', 'tweaks for package list'],
            label: 'open packages on new tab',
            labelPos: 'right',
            type: 'checkbox',
            default: true,
        },
        searchlist:
        {
            label: 'minify search list',
            labelPos: 'right',
            type: 'checkbox',
            default: 'true',
        },
        iconmini:{
            section: ['Package page', 'tweaks for package page'],
            label: 'minify package image',
            labelPos: 'right',
            type: 'checkbox',
            default: 'true',
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

    $(document).ready(function(){
        if(GM_config.get('packagelink')) {
            $(packagelink).each(function() {
                // $(this).click(function(event) {
                //     event.preventDefault();
                //     event.stopPropagation();
                //     window.open(this.href, '_blank');
                // });
                $(this).attr('target', '_blank');
            });
        }

        if(GM_config.get('searchlist')) {
            $(searchbox).css({
                'cssText': 'padding-top: 1rem !important;\
                            padding-bottom: 0 !important;'
            });
            $(container).css({
                'width': '90%',
                'padding': '0'
            });
            $(searchresultlist).css({
                'margin': '0 auto'
            });
            $(card).css({
                'cssText': 'flex: 0 0 auto !important;\
                            max-width: none !important;\
                            width: 23.5rem !important;'
            });
            $(cardimg).css({
                'height': '8rem'
            });
            $(cardblock).css({
                'padding': '.95rem'
            });
        }

        if(GM_config.get('iconmini')) {
            $('img.img-fluid').width('10em');
            $('#search_result_container .row .col-md-6:first-child').css({
                'flex-basis': 'auto',
                'width': '11em'
            });
            $('#search_result_container .row .col-md-6:last-child').css({
                'flex-basis': 'auto',
                'max-width': '75%'
            });
        }
    });
})();
