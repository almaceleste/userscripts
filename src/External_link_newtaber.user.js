// ==UserScript==
// @name            External link newtaber
// @namespace       almaceleste
// @version         0.3.0
// @description     opens external links in a new tab on all sites (now can work with dynamic link lists, such as search results)
// @description:ru  открывает внешние ссылки в новой вкладке на всех сайтах (теперь должно работать с динамическими списками ссылок, такими как результаты поисковых запросов)
// @author          (ɔ) Paola Captanovska
// @license         AGPL-3.0-or-later; http://www.gnu.org/licenses/agpl.txt
// @icon            https://cdn1.iconfinder.com/data/icons/feather-2/24/external-link-32.png
// @icon64          https://cdn1.iconfinder.com/data/icons/feather-2/24/external-link-128.png

// @homepageURL     https://greasyfork.org/en/users/174037-almaceleste
// @homepageURL     https://openuserjs.org/users/almaceleste
// @homepageURL     https://github.com/almaceleste/userscripts
// @supportURL      https://github.com/almaceleste/userscripts/issues
// @updateURL       https://github.com/almaceleste/userscripts/raw/master/src/External_link_newtaber.meta.js
// @downloadURL     https://github.com/almaceleste/userscripts/raw/master/src/External_link_newtaber.user.js
// @downloadURL     https://openuserjs.org/install/almaceleste/External_link_newtaber.user.js

// @run-at          document-end
// @require         https://openuserjs.org/src/libs/sizzle/GM_config.js
// @grant           GM_getValue
// @grant           GM_setValue
// @grant           GM_registerMenuCommand
// @grant           GM_openInTab

// @match           http*://*/*
// ==/UserScript==

// ==OpenUserJS==
// @author almaceleste
// ==/OpenUserJS==

const configId = 'allnewtaberCfg';
const windowcss = `
    #${configId} {
        background-color: darkslategray;
        color: whitesmoke;
    }
    #${configId} a,
    #${configId} button,
    #${configId} input,
    #${configId} select,
    #${configId} select option,
    #${configId} .section_desc {
        color: whitesmoke !important;
    }
    #${configId} a,
    #${configId} button,
    #${configId} input,
    #${configId} .section_desc {
        font-size: .8em !important;
    }
    #${configId} button,
    #${configId} select,
    #${configId} select option,
    #${configId} .section_desc {
        background-color: #333;
        border: 1px solid #222;
    }
    #${configId} button{
        height: 1.65em !important;
    }
    #${configId}_header {
        font-size: 1.3em !important;
    }
    #${configId}.section_header {
        background-color: #454545;
        border: 1px solid #222;
        font-size: 1em !important;
    }
    #${configId} .field_label {
        font-size: .7em !important;
    }
    #${configId}_buttons_holder {
        position: fixed;
        width: 97%;
        bottom: 0;
    }
    #${configId} .reset_holder {
        float: left;
        position: relative;
        bottom: -1em;
    }
    #${configId} .saveclose_buttons {
        margin: .7em;
    }
    #${configId}_field_support {
        background: none !important;
        border: none;
        cursor: pointer;      
        padding: 0 !important;
        text-decoration: underline;
    }
    #${configId}_field_support:hover,
    #${configId}_resetLink:hover {
        filter: drop-shadow(0 0 1px dodgerblue);
    }
`;
const iframecss = `
    height: 28em;
    width: 30em;
    border: 1px solid;
    border-radius: 3px;
    position: fixed;
    z-index: 999;
`;

var host = window.location.hostname;
var flat = host.replace(/\..*/, '');
var root = host.replace(/^[^.]*\./, '');
var child = '*.' + host;
var next = '*.' + root;

GM_registerMenuCommand(`${GM_info.script.name} Settings`, () => {
	GM_config.open();
    GM_config.frame.style = iframecss;
});

GM_config.init({
    id: `${configId}`,
    title: `${GM_info.script.name} ${GM_info.script.version}`,
    fields: {
        level: {
            section: ['', 'Exclude these domains (do not open in new tab)'],
            label: 'do not exclude parent and neighbor sites if parent site is a root domain like .com',
            labelPos: 'right',
            type: 'checkbox',
            default: true,
        },
        root: {
            label: 'parent site links (' + root + ')',
            labelPos: 'right',
            type: 'checkbox',
            default: true,
        },
        next: {
            label: 'neighbor site links (' + next + ')',
            labelPos: 'right',
            type: 'checkbox',
            default: true,
        },
        host: {
            label: 'this site links (' + host + ')',
            labelPos: 'right',
            type: 'checkbox',
            default: true,
        },
        child: {
            label: 'child site links (' + child + ')',
            labelPos: 'right',
            type: 'checkbox',
            default: true,
        },
        background: {
            section: ['', 'Other options'],
            label: 'open new tab in background',
            labelPos: 'right',
            type: 'checkbox',
            default: false,
        },
        insert: {
            label: 'insert new tab next to the current instead of the right end',
            labelPos: 'right',
            type: 'checkbox',
            default: true,
        },
        setParent: {
            label: 'return to the current tab after new tab closed',
            labelPos: 'right',
            type: 'checkbox',
            default: true,
        },
        support: {
            section: ['', 'Support'],
            label: 'almaceleste.github.io',
            title: 'more info on almaceleste.github.io',
            type: 'button',
            click: () => {
                GM_openInTab('https://almaceleste.github.io', {
                    active: true,
                    insert: true,
                    setParent: true
                });
            }
        },
    },
    css: windowcss,
    events: {
        save: function() {
            GM_config.close();
        }
    },
});

(function() {
    'use strict';

    const empty = new RegExp('^$');
    var patternroot = empty;
    var patternhost = empty;
    host = host.replace(/\./g, '\\\.');
    root = root.replace(/\./g, '\\\.');
    const background = GM_config.get('background');
    const insert = GM_config.get('insert');
    const setParent = GM_config.get('setParent');
    const options = {active: !background, insert: insert, setParent: setParent};

    if (GM_config.get('root')){patternroot = new RegExp('^' + root + '$');}    // abc.x               => ^abc\.x$
    if (GM_config.get('next')){
        if (GM_config.get('root')){
            patternroot = new RegExp('[^(' + flat + '\.)]?' + root + '$');     // abc.x + *.abc.x     => [^(w\.)]?abc\.x$
        }
        else {patternroot = new RegExp('[^(' + flat + ')]?\.' + root + '$');}  // *.abc.x             => [^(w)]?\.abc\.x$
    }
    if (GM_config.get('level') && root.search(/\..+\./) == -1){patternroot = empty;}
    if (GM_config.get('host')){patternhost = new RegExp('^' + host + '$');}    // w.abc.x             => ^w\.abc\.x$
    if (GM_config.get('child')){
        if (GM_config.get('host')){
            patternhost = new RegExp('(.+\.)?' + host + '$');                  // w.abc.x + *.w.abc.x => (.+\.)?w\.abc\.x$
        }
        else {patternhost = new RegExp('.+\.' + host + '$');}                  // *.w.abc.x           => .+\.w\.abc\.x$
    }

    window.onload = function(){
        var anchors = document.getElementsByTagName('a');
        for (var i = 0; i < anchors.length; i++) {
            var a = anchors[i];
            var target = a.host;
            if (a.hasAttribute('href')){
                if (target && !empty.test(target)){
                    if (!patternroot.test(target) && !patternhost.test(target)){
                        a.addEventListener('click', newtaber);
                    }
                }
            }
        }
    }

    function newtaber(e){
        e.preventDefault();
        e.stopPropagation();
        GM_openInTab(this.href, options);
    }
})();
