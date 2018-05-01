// ==UserScript==
// @name            Hola Mundo
// @namespace       almaceleste
// @version         0.3.1
// @description     this code does nothing only writes hola message to console
// @description:ru  этот код не делает ничего, только пишет приветственное сообщение в консоль
// @author          (ɔ) Paola Captanovska
// @license         AGPL-3.0; http://www.gnu.org/licenses/agpl
// @icon            https://cdn0.iconfinder.com/data/icons/typicons-2/24/message-32.png
// @icon64          https://cdn0.iconfinder.com/data/icons/typicons-2/24/message-128.png

// @homepageURL     https://greasyfork.org/en/users/174037-almaceleste
// @homepageURL     https://openuserjs.org/users/almaceleste
// @homepageURL     https://github.com/almaceleste/userscripts
// @supportURL      https://github.com/almaceleste/userscripts/issues
// @updateURL       https://github.com/almaceleste/userscripts/raw/master/src/Hola_Mundo.meta.js
// @downloadURL     https://github.com/almaceleste/userscripts/raw/master/src/Hola_Mundo.user.js
// @downloadURL     https://openuserjs.org/install/almaceleste/Hola_Mundo.user.js

// @require         https://openuserjs.org/src/libs/sizzle/GM_config.js
// @grant           GM_getValue
// @grant           GM_setValue
// @grant           GM_registerMenuCommand

// @match           http*://*/*
// ==/UserScript==

// ==OpenUserJS==
// @author almaceleste
// ==/OpenUserJS==

const windowcss = '#holamundoCfg {background-color: lightblue;} #holamundoCfg .reset_holder {float: left; position: relative; bottom: -1em;} #holamundoCfg .saveclose_buttons {margin: .7em;}';
const iframecss = 'height: 18.3em; width: 30em; border: 1px solid; border-radius: 3px; position: fixed; z-index: 999;';

GM_registerMenuCommand('Hola Mundo Settings', opencfg);

function opencfg()
{
	GM_config.open();
	holamundoCfg.style = iframecss;
}

GM_config.init(
{
    id: 'holamundoCfg',
    title: 'Hola Mundo',
    fields:
    {
        hola:
        {
            section: ['Words', 'Words of greating to write in console'],
            label: 'first word',
            labelPos: 'right',
            type: 'text',
            default: 'hola',
        },
        mundo:
        {
            label: 'second word',
            labelPos: 'right',
            type: 'text',
            default: 'mundo',
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

    console.log('¡' + GM_config.get('hola'), GM_config.get('mundo') +'!');
})();
