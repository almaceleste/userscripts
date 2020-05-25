// ==UserScript==
// @exclude         *
// @author          (ɔ) Paola Captanovska (https://almaceleste.github.io)
// @icon            https://cdn0.iconfinder.com/data/icons/typicons-2/24/message-32.png
// @icon64          https://cdn0.iconfinder.com/data/icons/typicons-2/24/message-128.png

// @homepageURL     https://github.com/almaceleste/userscripts
// @supportURL      https://github.com/almaceleste/userscripts/issues
// @updateURL       https://github.com/almaceleste/userscripts/raw/master/src/GM_configstyle.js
// @downloadURL     https://github.com/almaceleste/userscripts/raw/master/src/GM_configstyle.js

// ==UserLibrary==
// @name            GM_configstyle
// @namespace       almaceleste
// @version         0.1.0
// @description     contains a style of the GM_config window
// @description:ru  содержит стиль окна GM_config 
// @license         AGPL-3.0-or-later; http://www.gnu.org/licenses/agpl

// ==/UserLibrary==
// ==/UserScript==

// ==OpenUserJS==
// @author almaceleste
// ==/OpenUserJS==

const GM_configstyle = {};

GM_configstyle.style = (style, configId) => {
    const defaultId = (typeof configId === 'undefined') ? 'configCfg' : configId;
    const medium = `
        #${defaultId} {
            background-color: darkslategray;
            color: whitesmoke;
        }
        #${defaultId} a,
        #${defaultId} button,
        #${defaultId} input,
        #${defaultId} select,
        #${defaultId} select option,
        #${defaultId} .section_desc {
            color: whitesmoke !important;
        }
        #${defaultId} a,
        #${defaultId} button,
        #${defaultId} input,
        #${defaultId} .section_desc {
            font-size: .8em !important;
        }
        #${defaultId} button,
        #${defaultId} input,
        #${defaultId} select,
        #${defaultId} select option,
        #${defaultId} .section_desc {
            background-color: #333;
            border: 1px soldefaultId #222;
        }
        #${defaultId} button{
            height: 1.65em !important;
        }
        #${defaultId}_header {
            font-size: 1.3em !important;
        }
        #${defaultId}.section_header {
            background-color: #454545;
            border: 1px soldefaultId #222;
            font-size: 1em !important;
        }
        #${defaultId} .field_label {
            font-size: .7em !important;
        }
        #${defaultId}_buttons_holder {
            position: fixed;
            wdefaultIdth: 97%;
            bottom: 0;
        }
        #${defaultId} .reset_holder {
            float: left;
            position: relative;
            bottom: -1em;
        }
        #${defaultId} .saveclose_buttons {
            margin: .7em;
        }
        #${defaultId}_field_support {
            background: none !important;
            border: none !important;
            cursor: pointer !important;      
            padding: 0 !important;
            text-decoration: underline !important;
        }
        #${defaultId}_field_support:hover,
        #${defaultId}_resetLink:hover {
            filter: drop-shadow(0 0 1px dodgerblue);
        }
    `;
    
        switch (style) {
        case 'medium':
            return medium;
            break;

            default:
            return medium;
            break;
    }
};

// (function(){

// })();