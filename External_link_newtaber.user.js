// ==UserScript==
// @name            External link newtaber
// @namespace       almaceleste
// @version         0.1
// @description     this code opens external links in new tab on all sites (at the moment does not support dynamic lists of links such as search results)
// @description:ru  этот код открывает внешние ссылки в новой вкладке на всех сайтах (в данный момент не поддерживает динамические списки ссылок, такие как результаты поимковых запросов)
// @author          (ɔ) Paola Captanovska
// @license         AGPL-3.0; http://www.gnu.org/licenses/agpl.txt
// @icon            https://cdn1.iconfinder.com/data/icons/feather-2/24/external-link-32.png
// @icon            https://cdn1.iconfinder.com/data/icons/feather-2/24/external-link-128.png

// @homepageURL     https://greasyfork.org/en/users/174037-almaceleste
// @homepageURL     https://openuserjs.org/users/almaceleste
// @homepageURL     https://github.com/almaceleste/userscripts
// @supportURL      https://github.com/almaceleste/userscripts/issues
// @updateURL       https://github.com/almaceleste/userscripts/raw/master/External_link_newtaber.meta.js
// @downloadURL     https://github.com/almaceleste/userscripts/raw/master/External_link_newtaber.user.js
// @downloadURL     https://openuserjs.org/install/almaceleste/External_link_newtaber.user.js

// @runat           document.end
// @require         https://openuserjs.org/src/libs/sizzle/GM_config.js
// @grant           GM_getValue
// @grant           GM_setValue
// @grant           GM_registerMenuCommand

// @match           http*://*/*
// ==/UserScript==

// ==OpenUserJS==
// @author almaceleste
// ==/OpenUserJS==

const windowcss = '#allnewtaberCfg {background-color: lightblue;} #allnewtaberCfg .reset_holder {float: left; position: relative; bottom: -1em;} #allnewtaberCfg .saveclose_buttons {margin: .7em;}';
const iframecss = 'height: 21.3em; width: 30em; border: 1px solid; border-radius: 3px; position: fixed; z-index: 999;';

var host = window.location.hostname;
var flat = host.replace(/\..*/, '');
var root = host.replace(/^[^.]*\./, '');
var child = '*.' + host;
var next = '*.' + root;

GM_registerMenuCommand('External link newtaber Settings', opencfg);

function opencfg()
{
	GM_config.open();
	allnewtaberCfg.style = iframecss;
}

GM_config.init(
{
    id: 'allnewtaberCfg',
    title: 'External link newtaber',
    fields:
    {
        level:
        {
            section: ['Exclusions', 'Exclude these domains (do not open in new tab)'],
            label: 'do not exclude parent and neighbor sites if parent site is a root domain like .com',
            labelPos: 'right',
            type: 'checkbox',
            default: true,
        },
        root:
        {
            label: 'parent site links (' + root + ')',
            labelPos: 'right',
            type: 'checkbox',
            default: true,
        },
        next:
        {
            label: 'neighbor site links (' + next + ')',
            labelPos: 'right',
            type: 'checkbox',
            default: true,
        },
        host:
        {
            label: 'this site links (' + host + ')',
            labelPos: 'right',
            type: 'checkbox',
            default: true,
        },
        child:
        {
            label: 'child site links (' + child + ')',
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

    var empty = new RegExp('^$');
    var patternroot = empty;
    var patternhost = empty;
    host = host.replace(/\./g, '\\\.');
    root = root.replace(/\./g, '\\\.');

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
    // console.log(root, patternroot);
    // console.log(host, patternhost);

    window.onload = function(){
        // console.log(host);
        var anchors= document.getElementsByTagName('a');

        for (var i = 0; i < anchors.length; i++) {
            var target = anchors[i].host;
            if (target && target !== ''){
                if (!patternroot.test(target) && !patternhost.test(target)){
                    anchors[i].target = '_blank';
                    console.log(target);
                }
            }
        }
    };
})();
