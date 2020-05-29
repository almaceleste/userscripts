// ==UserScript==
// @name            Greasy Fork tweaks
// @namespace       almaceleste
// @version         0.3.10
// @description     opens pages of scripts from lists in a new tab and makes the user interface more compact, informative and interactive
// @description:ru  открывает страницы скриптов из списков в новой вкладке и делает пользовательский интерфейс более компактным, информативным и интерактивным
// @author          (ɔ) almaceleste  (https://almaceleste.github.io)
// @license         AGPL-3.0-or-later; http://www.gnu.org/licenses/agpl.txt
// @icon            https://greasyfork.org/assets/blacklogo16-bc64b9f7afdc9be4cbfa58bdd5fc2e5c098ad4bca3ad513a27b15602083fd5bc.png
// @icon64          https://greasyfork.org/assets/blacklogo96-e0c2c76180916332b7516ad47e1e206b42d131d36ff4afe98da3b1ba61fd5d6c.png

// @homepageURL     https://greasyfork.org/en/users/174037-almaceleste
// @homepageURL     https://openuserjs.org/users/almaceleste
// @homepageURL     https://github.com/almaceleste/userscripts
// @supportURL      https://github.com/almaceleste/userscripts/issues
// @updateURL       https://github.com/almaceleste/userscripts/raw/master/src/Greasy_Fork_tweaks.user.js
// @downloadURL     https://github.com/almaceleste/userscripts/raw/master/src/Greasy_Fork_tweaks.user.js
// @downloadURL     https://openuserjs.org/install/almaceleste/Greasy_Fork_tweaks.user.js

// @require         https://code.jquery.com/jquery-3.3.1.js
// @require         https://code.jquery.com/ui/1.12.1/jquery-ui.js
// @require         https://openuserjs.org/src/libs/sizzle/GM_config.js
// @grant           GM_getValue
// @grant           GM_setValue
// @grant           GM_registerMenuCommand
// @grant           GM_openInTab

// @match           https://greasyfork.org/*/users/*
// @match           https://greasyfork.org/*/scripts*
// ==/UserScript==

// ==OpenUserJS==
// @author almaceleste
// ==/OpenUserJS==

const listitem = '.script-list li';
const separator = '.name-description-separator';
const scriptversion = 'data-script-version';
const scriptrating = 'dd.script-list-ratings';
const scriptstats = '.inline-script-stats';
const dailyinstalls = '.script-list-daily-installs';
const totalinstalls = '.script-list-total-installs';
const createddate = '.script-list-created-date';
const updateddate = '.script-list-updated-date';

const userprofile = {};
userprofile.path = '#user-profile';
userprofile.header = 'body > div.width-constraint > section:first-child > h2';

const sections = {};
sections.controlpanel = '#control-panel';
sections.discussions = '#user-discussions-on-scripts-written';
sections.scriptsets = 'section:has(h3:contains("Script Sets"))';

const configId = 'greasyforktweaksCfg';
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
        border: none !important;
        cursor: pointer !important;      
        padding: 0 !important;
        text-decoration: underline !important;
    }
    #${configId}_field_support:hover,
    #${configId}_resetLink:hover {
        filter: drop-shadow(0 0 1px dodgerblue);
    }
`;
const iframecss = `
    height: 455px;
    width: 435px;
    border: 1px solid;
    border-radius: 3px;
    position: fixed;
    z-index: 9999;
`;

GM_registerMenuCommand(`${GM_info.script.name} Settings`, () => {
	GM_config.open();
    GM_config.frame.style = iframecss;
});

GM_config.init({
    id: `${configId}`,
    title: `${GM_info.script.name} ${GM_info.script.version}`,
    fields: {
        version: {
            section: ['', 'Script list options (own and other pages)'],
            label: 'add script version number in the list of scripts',
            labelPos: 'right',
            type: 'checkbox',
            default: true,
        },
        ratingscore: {
            label: 'display script rating score',
            labelPos: 'right',
            type: 'checkbox',
            default: true,
        },
        compact: {
            label: 'compact script information',
            labelPos: 'right',
            type: 'checkbox',
            default: true,
        },
        userprofile: {
            section: ['', 'User page options (own page and other users`)'],
            label: 'collapse user profile info on user page',
            labelPos: 'right',
            type: 'checkbox',
            default: true,
        },
        controlpanel: {
            label: 'collapse control panel on user page',
            labelPos: 'right',
            type: 'checkbox',
            default: true,
        },
        discussions: {
            label: 'collapse discussions on user page',
            labelPos: 'right',
            type: 'checkbox',
            default: true,
        },
        scriptsets: {
            label: 'collapse script sets on user page',
            labelPos: 'right',
            type: 'checkbox',
            default: true,
        },
        newtab: {
            section: ['', 'Other options'],
            label: 'open script page in new tab',
            labelPos: 'right',
            type: 'checkbox',
            default: true,
        },
        background: {
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

function arrow(element){
    const arrow = $(`
        <svg viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
            <style>
                .collapsed {
                    transform: rotate(0deg);
                }
                .expanded {
                    transform: rotate(180deg);
                }
            </style>
            <text x='0' y='18'>▼</text>
        </svg>
    `).css({
        fill: 'whitesmoke',
        height: '20px',
        width: '30px',
    });
    $(element).append(arrow);
}

function collapse(element, header){
    $(element).css({
        cursor: 'pointer',
    });
    arrow($(element).find(header));
    $(element).accordion({
        collapsible: true,
        active: false,
        beforeActivate: () => {
            rotate($(element).find('svg'));
        }
    });
}

function rotate(element){
    if ($(element).hasClass('expanded')) {
        $(element).animate({
            transform: 'rotate(0deg)',
        });
    }
    else {
        $(element).animate({
            transform: 'rotate(180deg)',
        });
    }
    $(element).toggleClass('expanded');
}

function compact(first, second){
    $('dt' + first).each(function(){
        $(this).css('display','none');
        $(this).siblings('dt' + second).find('span').append(' (' + $(this).find('span').text() + ')');
    });
    $('dd' + first).each(function(){
        $(this).css('display','none');
        $(this).siblings('dd' + second).find('span').append(' (' + $(this).find('span').text() + ')');
    });
}

(function() {
    'use strict';

    const options = {active: !GM_config.get('background'), insert: GM_config.get('insert'), setParent: GM_config.get('setParent')};

    if (GM_config.get('version')){
        $(listitem).each(function(){
            $(this).find(separator).before(` ${$(this).attr(scriptversion)}`);
        });
    }
    if (GM_config.get('ratingscore')) {
        $(scriptrating).each(function(){
            $(this).children('span').after(` - ${$(this).attr('data-rating-score')}`);
        });
    }
    if (GM_config.get('compact')){
        $(scriptstats).children().css('width','auto');
        compact(totalinstalls, dailyinstalls);
        compact(updateddate, createddate);
    }
    if (GM_config.get('userprofile')){
        $(userprofile.header).css({
                cursor: 'pointer',
            })
            .click(function(){
                $(userprofile.path).slideToggle();
                rotate($(this).find('svg'));
            });
        arrow($(userprofile.header));
        $(userprofile.path).slideUp();
    }
    
    Object.keys(sections).forEach((section) => {
        if (GM_config.get(section)) {
            collapse(sections[section], 'header h3');
        }
    });

    if (GM_config.get('newtab')){
        $(listitem).each(function(){
            $(this).find(separator).prev('a').click(newtaber);
        });
    }

    function newtaber(e){
        e.preventDefault();
        e.stopPropagation();
        GM_openInTab(this.href, options);
    }
})();
