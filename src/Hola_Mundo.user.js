// ==UserScript==
// @name            Hola Mundo
// @namespace       almaceleste
// @version         0.4.0
// @description     this code does nothing, just writes a welcome message to the console (contains an example of using GM_config)
// @description:ru  этот код не делает ничего, только пишет приветственное сообщение в консоль (содержит пример использования GM_config)
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

const configId = 'holamundoCfg';
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
    #${configId} input,
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
    height: 19em;
    width: 30em;
    border: 1px solid;
    border-radius: 3px;
    position: fixed;
    z-index: 999;
`;

GM_registerMenuCommand(`${GM_info.script.name} Settings`, () => {
	GM_config.open();
    GM_config.frame.style = iframecss;
});

GM_config.init({
    id: `${configId}`,
    title: `${GM_info.script.name} ${GM_info.script.version}`,
    fields: {
        greeting: {
            section: ['Words', 'welcome words for writing to the console'],
            label: 'greeting word',
            labelPos: 'left',
            type: 'text',
            default: 'hola',
        },
        appeal: {
            label: 'appeal word',
            labelPos: 'left',
            type: 'text',
            default: 'mundo',
        },
        exclamation: {
            label: 'upside-down exclamation',
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

    console.log(`${GM_config.get('exclamation') ? '¡' : ''}${GM_config.get('greeting')}, ${GM_config.get('appeal')}!`);
})();
