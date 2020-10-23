// ==UserScript==
// @name            PWA Detector
// @namespace       almaceleste
// @version         0.1.0
// @description     detects and removes Progressive Web App (PWA) manifests on the web sites
// @description:ru  обнаруживает и удаляет манифесты Прогрессивных Веб Приложений (PWA) на веб-сайтах
// @author          GNU Affero GPL 3.0 🄯 2020 almaceleste  (https://almaceleste.github.io)
// @license         AGPL-3.0-or-later; http://www.gnu.org/licenses/agpl.txt
// @icon            https://cdn0.iconfinder.com/data/icons/feather/96/circle-cross-16.png
// @icon64          https://cdn0.iconfinder.com/data/icons/feather/96/circle-cross-64.png

// @homepageURL     https://greasyfork.org/en/users/174037-almaceleste
// @homepageURL     https://openuserjs.org/users/almaceleste
// @homepageURL     https://github.com/almaceleste/userscripts
// @supportURL      https://github.com/almaceleste/userscripts/issues
// @updateURL       https://github.com/almaceleste/userscripts/raw/master/src/PWA_Detector.user.js
// @downloadURL     https://github.com/almaceleste/userscripts/raw/master/src/PWA_Detector.user.js
// @downloadURL     https://openuserjs.org/install/almaceleste/PWA_Detector.user.js

// @require         https://code.jquery.com/jquery-3.3.1.js
// @require         https://openuserjs.org/src/libs/sizzle/GM_config.js
// @grant           GM_getValue
// @grant           GM_setValue
// @grant           GM_registerMenuCommand
// @grant           GM_openInTab
// @grant           GM_getResourceText

// @resource        css https://github.com/almaceleste/userscripts/raw/master/css/default.css

// @match           http*://*/*
// ==/UserScript==

// ==OpenUserJS==
// @author almaceleste
// ==/OpenUserJS==

// script global variables
const hostname = window.location.hostname;
const manifest = "link[rel='manifest']";

GM_registerMenuCommand(`${GM_info.script.name} Add site`, () => {
	doBox();
});

// config settings
const configId = 'pwadetectorCfg';
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
    height: 390px;
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
        mode: {
            section: ['', 'Settings'],
            label: 'prevention mode',
            labelPos: 'left',
            title: `
prevention modes:
    ask - if a manifest was detected on the site, ask what to do
    remove - remove manifests on all sites
    manual - do not ask, remove manifests only on sites, that are already blacklisted
            `,
            type: 'select',
            options: [
                'ask',
                'remove',
                'manual'
            ],
            default: 'ask',
        },
        delay: {
            label: 'ask box delay (ms)',
            labelPos: 'left',
            type: 'int',
            default: 500,
        },
        timeout: {
            label: 'ask box timeout (ms)',
            labelPos: 'left',
            type: 'int',
            default: 7000,
        },
        top: {
            section: ['', 'ask box position'],
            label: 'top',
            labelPos: 'left',
            type: 'text',
            default: '0',
        },
        right: {
            label: 'right',
            labelPos: 'left',
            type: 'text',
            default: '5%',
        },
        btncolored: {
            section: ['', 'colored buttons'],
            label: 'use colored buttons',
            labelPos: 'right',
            type: 'checkbox',
            default: true,
        },
        whitebtncolor: {
            label: 'whitelist button color',
            labelPos: 'left',
            type: 'text',
            default: 'darkcyan',
        },
        blackbtncolor: {
            label: 'blacklist button color',
            labelPos: 'left',
            type: 'text',
            default: 'firebrick',
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
function removeManifest(){
    if ($(manifest).length) $(manifest).remove();
}

function doManual(){
    // if manifest element exists
    if ($(manifest).length) {
        const blacklist = GM_getValue('blacklist', []);
        // if site is already in the blacklist
        if (blacklist.includes(hostname)) {
            removeManifest();
        }
    }
}

function doAsk(){
    // if manifest element exists
    if ($(manifest).length) {
        const blacklist = GM_getValue('blacklist', []);
        const whitelist = GM_getValue('whitelist', []);
        // if site is not in the whitelist
        if (!whitelist.includes(hostname)) {
            // if site is already in the blacklist
            if (blacklist.includes(hostname)) {
                removeManifest();
            }
            else {
                doBox();
            }
        }
    }
}

function doBox(message = ''){
    const delay = GM_config.get('delay');
    const timeout = GM_config.get('timeout');
    const boxId = `${configId}_box`;
    // if manifest exists
    if ($(manifest).length) {
        const url = $(manifest).attr('href');
        message = `<a href='${url}' target='_blank' class='pwa' title='open manifest in a new tab'>PWA manifest</a> was detected.`;
    }
    else {
        message = 'No manifest detected.';
    }

    // if ask box already exists, show it
    if ($(`#${boxId}`).length) {
        console.log('doBox:', delay, timeout);
        $(`#${boxId}_message`).html(message);
        $(`#${boxId}`).stop(true, true).slideDown(500).animate({height: 'auto'}, timeout).slideUp(500);
    }
    // else create ask box
    else {
        const top = GM_config.get('top');
        const right = GM_config.get('right');
        const box = $('<div></div>', {
            id: `${boxId}`,
            on: {
                click: () => {
                    // box.stop(true, true);
                },
                mouseenter: () => {
                    box.stop(true, true);
                },
                mouseleave: () => {
                    box.animate({height: '+=0'}, timeout).slideUp(500);
                }
            }
        }).appendTo('body');
        const style = $('<style></style>', {
            text: `
                #${boxId} {
                    background-color: darkslategray !important;
                    background-image: none !important;
                    border: 1px solid #222 !important;
                    border-bottom-left-radius: 3px !important;
                    border-bottom-right-radius: 3px !important;
                    display: none;
                    font-size: 14px !important;
                    right: ${right} !important;
                    padding: 10px !important;
                    position: fixed !important;
                    top: ${top} !important;
                    width: 300px !important;
                    z-Index: 99999 !important;
                }
                #${boxId} a,
                #${boxId} button,
                #${boxId} input,
                #${boxId} p,
                #${boxId} span,
                #${boxId} .title {
                    background-image: none !important;
                    color: whitesmoke !important;
                    font-size: 14px !important;
                    font-family: Roboto,sans-serif !important;
                    line-height: normal !important;
                }
                #${boxId} .pwa {
                    color: dodgerblue !important;
                    text-decoration: underline !important;
                }
                #${boxId} button,
                #${boxId} input,
                #${boxId} .title {
                    background-color: #333 !important;
                    border: 1px solid #222 !important;
                    height: 20px !important;
                    margin-top: 5px !important;
                }
                #${boxId} button {
                    float: right !important;
                    margin-left: 5px !important;
                    padding: 1px 6px !important;
                }
                #${boxId} input {
                    padding: 1px 2px !important;
                    width: 98% !important;
                }
                #${boxId} p,
                #${boxId} span {
                    cursor: default !important;
                    margin: 0 0 5px !important;
                }
                #${boxId} .btn-settings {
                    cursor: pointer !important;
                    display: inline-block !important;
                    font-size: 22px !important;
                    margin-top: 3px !important;
                    text-decoration: none !important;
                }
                #${boxId} .title {
                    font-weight: bold !important;
                    line-height: 20px !important;
                    text-align: center !important;
                }
            `,
        }).appendTo(box);
        if (GM_config.get('btncolored')) {
            const btnstyle = $('<style></style>', {
                text: `
                    #${boxId} .btn-black-list {
                        background-color: ${GM_config.get('blackbtncolor')} !important;
                    }
                    #${boxId} .btn-white-list {
                        background-color: ${GM_config.get('whitebtncolor')} !important;
                    }
                `,
            }).appendTo(box);
        }
        const title = $('<p></p>', {
            class: 'title',
            text: GM_info.script.name,
        }).appendTo(box);
        const p = $('<p></p>', {
            id: `${boxId}_message`,
            html: message,
        }).appendTo(box);
        const span = $('<span></span>', {
            text: `Do you want to add this site to the list?`,
        }).appendTo(box);
        const input = $('<input/>', {
            value: hostname,
            type: 'text',
            on: {
                focus: () => {
                    box.stop(true, true);
                }
            }
        }).appendTo(box);
        const settings = $('<a></a>', {
            class: 'btn-settings',
            text: '⚙️',
            title: 'Settings',
            on: {
                click: () => {
                    GM_config.open();
                    GM_config.frame.style = iframecss;
                    box.stop(true, true).slideUp(500);
                }
            }
        }).appendTo(box);
        const cancelbtn = $('<button></button>', {
            text: 'Cancel',
            title: 'Cancel',
            type: 'button',
            on: {
                click: () => {
                    box.stop(true, true).slideUp(500);
                }
            }
        }).appendTo(box);
        const blackbtn = $('<button></button>', {
            class: 'btn-black-list',
            text: 'Blacklist',
            title: 'Add this site to the blacklist',
            type: 'button',
            on: {
                click: () => {
                    removeManifest();
                    box.stop(true, true).slideUp(500);
                    addBlacklist(input.val());
                }
            }
        }).appendTo(box);
        const whitebtn = $('<button></button>', {
            class: 'btn-white-list',
            text: 'Whitelist',
            title: 'Add this site to the whitelist',
            type: 'button',
            on: {
                click: () => {
                    box.stop(true, true).slideUp(500);
                    addWhitelist(input.val());
                }
            }
        }).appendTo(box);
        box.delay(delay).slideDown(500).animate({height: '+=0'}, timeout).slideUp(500).css('height','auto');
    }
}

function addBlacklist(url) {
    let blacklist = GM_getValue('blacklist', []);
    let whitelist = GM_getValue('whitelist', []);
    if (whitelist.includes(url)) {
        const index = whitelist.indexOf(url);
        whitelist.splice(index, 1);
        GM_setValue('whitelist', whitelist);
    }
    if (!blacklist.includes(url)) {
        blacklist.push(url);
        GM_setValue('blacklist', blacklist);
    }
}

function addWhitelist(url) {
    let blacklist = GM_getValue('blacklist', []);
    let whitelist = GM_getValue('whitelist', []);
    if (blacklist.includes(url)) {
        const index = blacklist.indexOf(url);
        blacklist.splice(index, 1);
        GM_setValue('blacklist', blacklist);
    }
    if (!whitelist.includes(url)) {
        whitelist.push(url);
        GM_setValue('whitelist', whitelist);
    }
}

(function() {
    'use strict';

    const mode = GM_config.get('mode');
    switch (mode) {
        case 'remove':
            removeManifest();
            break;
        case 'ask':
            doAsk();
            break;
        case 'manual':
            doManual();
            break;
        default:
            break;
    }
})();