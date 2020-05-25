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

const id = (typeof configId === 'undefined' ) ? 'configCfg' : configId;
const windowcss = `
    #${id} {
        background-color: darkslategray;
        color: whitesmoke;
    }
    #${id} a,
    #${id} button,
    #${id} input,
    #${id} select,
    #${id} select option,
    #${id} .section_desc {
        color: whitesmoke !important;
    }
    #${id} a,
    #${id} button,
    #${id} input,
    #${id} .section_desc {
        font-size: .8em !important;
    }
    #${id} button,
    #${id} input,
    #${id} select,
    #${id} select option,
    #${id} .section_desc {
        background-color: #333;
        border: 1px solid #222;
    }
    #${id} button{
        height: 1.65em !important;
    }
    #${id}_header {
        font-size: 1.3em !important;
    }
    #${id}.section_header {
        background-color: #454545;
        border: 1px solid #222;
        font-size: 1em !important;
    }
    #${id} .field_label {
        font-size: .7em !important;
    }
    #${id}_buttons_holder {
        position: fixed;
        width: 97%;
        bottom: 0;
    }
    #${id} .reset_holder {
        float: left;
        position: relative;
        bottom: -1em;
    }
    #${id} .saveclose_buttons {
        margin: .7em;
    }
    #${id}_field_support {
        background: none !important;
        border: none !important;
        cursor: pointer !important;      
        padding: 0 !important;
        text-decoration: underline !important;
    }
    #${id}_field_support:hover,
    #${id}_resetLink:hover {
        filter: drop-shadow(0 0 1px dodgerblue);
    }
`;
