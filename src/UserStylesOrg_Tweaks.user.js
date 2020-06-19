// ==UserScript==
// @name            UserStyles.Org Tweaks
// @namespace       almaceleste
// @version         0.1.0
// @description     some fixes for userstyle.org
// @description:ru  несколько исправлений для userstyle.org
// @author          GNU Affero GPL 3.0 🄯 2020 almaceleste  (https://almaceleste.github.io)
// @license         AGPL-3.0-or-later; http://www.gnu.org/licenses/agpl.txt
// @icon            https://userstyles.org/ui/images/icons/favicon.png
// @icon64          https://userstyles.org/ui/images/icons/app_icon.png

// @homepageURL     https://greasyfork.org/en/users/174037-almaceleste
// @homepageURL     https://openuserjs.org/users/almaceleste
// @homepageURL     https://github.com/almaceleste/userscripts
// @supportURL      https://github.com/almaceleste/userscripts/issues
// @updateURL       https://github.com/almaceleste/userscripts/raw/master/src/UserStylesOrg_Tweaks.user.js
// @downloadURL     https://github.com/almaceleste/userscripts/raw/master/src/UserStylesOrg_Tweaks.user.js
// @downloadURL     https://openuserjs.org/install/almaceleste/UserStylesOrg_Tweaks.user.js

// @require         https://code.jquery.com/jquery-3.3.1.js
// @require         https://raw.githubusercontent.com/uzairfarooq/arrive/master/minified/arrive.min.js
// @require         https://openuserjs.org/src/libs/sizzle/GM_config.js
// @grant           GM_getValue
// @grant           GM_setValue
// @grant           GM_registerMenuCommand
// @grant           GM_openInTab
// @grant           GM_getResourceText

// @resource        css https://github.com/almaceleste/userscripts/raw/master/css/default.css

// @match           http*://*.userstyles.org/styles/new
// @match           http*://*.userstyles.org/d/styles/new
// @match           http*://*.userstyles.org/styles/*/edit
// @match           http*://*.userstyles.org/d/styles/*/edit
// ==/UserScript==

// ==OpenUserJS==
// @author almaceleste
// ==/OpenUserJS==

// script global variables
const offset = 50;
const frame = '#iframe';

const form = `body > .PageContent > form[action='/styles/create']`;
const newoption = `${form} .new-option > input[type='button']`;
const newsetting = `${form} #new-setting > input[type='button']`;
const textarea = `${form} textarea`;
const img = `${form} img`;
// arrive.js options
const options = {
    existing: true
};

// config settings
const configId = 'usotweaksCfg';
const iconUrl = GM_info.script.icon64;
const pattern = {};
pattern[`#${configId}`] = /#configId/g;
pattern[`${iconUrl}`] = /iconUrl/g;

let css = GM_getResourceText('css');
Object.keys(pattern).forEach((key) => {
    css = css.replace(pattern[key], key);
});
const windowcss = css;
const iframecss = `
    height: 230px;
    width: 435px;
    border: 1px solid;
    border-radius: 3px;
    position: fixed;
    z-index: 99999;
`;

GM_registerMenuCommand(`${GM_info.script.name} Settings`, () => {
	GM_config.open();
    GM_config.frame.style = iframecss;
});

GM_config.init({
    id: `${configId}`,
    title: `${GM_info.script.name} ${GM_info.script.version}`,
    fields: {
        frameWidth: {
            section: ['', 'New style and Edit pages'],
            label: 'frame width in px',
            labelPos: 'left',
            title: `editing frame width in pixels
    0 - default width`,
            type: 'int',
            default: 0,
        },
        fixframeHeight: {
            label: 'fix frame height on changing content',
            labelPos: 'right',
            title: `fix frame height when adding new settings and options or resizing text area`,
            type: 'checkbox',
            default: true,
        },
        fixtextareaWidth: {
            label: 'fix textarea width',
            labelPos: 'right',
            title: ``,
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

// script code
function clicklistener(selector){
    $(document).arrive(selector, options, (element) => {
        $(element).on({
            click: () => {
                fixframeHeight();
            }
        });
    });
}

function addinglistener(selector){
    $(document).arrive(selector, options, () => {
        fixframeHeight();
    });
}

function resizelistener(selector){
    $(document).arrive(selector, options, (element) => {
        const options = {once: true};
        $(element).on({
            mousedown: () => {
                window.addEventListener('mouseup', fixframeHeight, options);
            },
            mouseup: () => {
                fixframeHeight();
                window.removeEventListener('mouseup', fixframeHeight, options);
            }
        });
    });
}

function fixWidth(selector){
    $(document).arrive(selector, options, (element) => {
        $(element).css({
            resize: 'vertical',
        })
    });
}

function fixframeHeight(){
    const height = $('body').height() + offset;
    const frame = window.parent.document.getElementById('iframe');
    $(frame).height(height);
}

function fixframeWidth(width){
    const frame = window.parent.document.getElementById('iframe');
    $(frame).css({
        left: '50%',
        position: 'relative',
        transform: 'translateX(-50%)',
    }).width(width);
}

(function() {
    'use strict';

    $(document).ready(() => {
        if (!(window.self === window.top)) {
            const frameWidth = GM_config.get('frameWidth');
            if (frameWidth != '0') {
                fixframeWidth(frameWidth);
            }
            if (GM_config.get('fixframeHeight')) {
                clicklistener(newsetting);
                clicklistener(newoption);
                resizelistener(textarea);
                addinglistener(img);
            }
            if (GM_config.get('fixtextareaWidth')) {
                fixWidth(textarea);
            }
        }
    });
})();