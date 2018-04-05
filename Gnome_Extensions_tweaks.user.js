// ==UserScript==
// @name            Gnome Extensions tweaks
// @namespace       almaceleste
// @version         0.3.1
// @description     this code opens extension pages in the new tab and changes sorting of the extensions list
// @description:ru  этот код открывает страницы расширений в новой вкладке и изменяет сортировку списка расширений
// @author          (ɔ) Paola Captanovska
// @license         AGPL-3.0; http://www.gnu.org/licenses/agpl.txt
// @icon            https://cdn1.iconfinder.com/data/icons/system-shade-circles/512/gnome-32.png
// @icon64          https://cdn1.iconfinder.com/data/icons/system-shade-circles/512/gnome-128.png

// @homepageURL     https://greasyfork.org/en/users/174037-almaceleste
// @homepageURL     https://openuserjs.org/users/almaceleste
// @homepageURL     https://github.com/almaceleste/userscripts
// @supportURL      https://github.com/almaceleste/userscripts/issues
// @updateURL       https://github.com/almaceleste/userscripts/raw/master/Gnome_Extensions_tweaks.meta.js
// @downloadURL     https://github.com/almaceleste/userscripts/raw/master/Gnome_Extensions_tweaks.user.js
// @downloadURL     https://openuserjs.org/install/almaceleste/Gnome_Extensions_tweaks.user.js

// @run-at          document.end
// @require         https://openuserjs.org/src/libs/sizzle/GM_config.js
// @grant           GM_getValue
// @grant           GM_setValue
// @grant           GM_registerMenuCommand

// @match           https://extensions.gnome.org/
// @match           https://extensions.gnome.org/#sort*
// ==/UserScript==

// ==OpenUserJS==
// @author almaceleste
// ==/OpenUserJS==

const extensionsdiv = 'extensions-list';
const extensionslist = 'extensions';
const extensionlink = 'a.title-link';
const navbarbtn = '#navbar-wrapper a:contains("Extensions")';

const windowcss = '#getweaksCfg {background-color: lightblue;} #getweaksCfg .reset_holder {float: left; position: relative; bottom: -1em;} #getweaksCfg .saveclose_buttons {margin: .7em;}';
const iframecss = 'height: 17.5em; width: 30em; border: 1px solid; border-radius: 3px; position: fixed; z-index: 999;';

GM_registerMenuCommand('Gnome Extensions tweaks Settings', opencfg);

function opencfg()
{
	GM_config.open();
	getweaksCfg.style = iframecss;
}

GM_config.init(
{
    id: 'getweaksCfg',
    title: 'Gnome Extensions tweaks',
    fields:
    {
        extensionlink:
        {
            section: ['Link types', 'Choose link types to open in new tab'],
            label: 'extension links',
            labelPos: 'right',
            type: 'checkbox',
            default: true,
        },
        sorting:
        {
            section: ['List sorting', 'Choose list sorting'],
            label: 'sorting links',
            labelPos: 'left',
            type: 'select',
            options: ['name', 'recent', 'downloads', 'popularity'],
            default: 'recent',
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

    if(GM_config.get('extensionlink')) {
        $(document).ready(function(){
            var targetNode, callback, observer;
            var config = {childList: true}; //, subtree: true};
            targetNode = document.getElementById(extensionsdiv);
            callback = function(e){
                if(e.nodeName == 'UL' && e.className == extensionslist){
                    observer.disconnect();
                    $(extensionlink).attr('target', '_blank');
                }
            };

            observer = new MutationObserver(function(mutations) {
                for(var m of mutations) {
                    m.addedNodes.forEach(callback);
                }
            });

            observer.observe(targetNode, config);
        });
    }

    var sorting = '#sort=' + GM_config.get('sorting');
    $(navbarbtn).each(function(){
        var href = $(this).attr('href');
        $(this).attr('href', href + sorting);
    });
})();
