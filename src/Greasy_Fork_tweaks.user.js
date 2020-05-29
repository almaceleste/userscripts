// ==UserScript==
// @name            Greasy Fork tweaks
// @namespace       almaceleste
// @version         0.3.5
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
const scriptstats = '.inline-script-stats';
const dailyinstalls = '.script-list-daily-installs';
const totalinstalls = '.script-list-total-installs';
const createddate = '.script-list-created-date';
const updateddate = '.script-list-updated-date';
const userprofile = '#user-profile';
const controlpanel = '#control-panel';
const discussions = '#user-discussions-on-scripts-written';
const scriptsets = 'h3:contains("Script Sets")';

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
    height: 435px;
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

function collapse(element){
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

    $(element).css({
        cursor: 'pointer',
    })
    .find('header h3').append(arrow);
    $(element).accordion({
        collapsible: true,
        active: false,
        beforeActivate: () => {
            if ($(arrow).hasClass('expanded')) {
                $(arrow).animate({
                    transform: 'rotate(0deg)',
                });
            }
            else {
                $(arrow).animate({
                    transform: 'rotate(180deg)',
                });
            }
            $(arrow).toggleClass('expanded');
        }
    });
}

(function() {
    'use strict';

    const options = {active: !GM_config.get('background'), insert: GM_config.get('insert'), setParent: GM_config.get('setParent')};

    if (GM_config.get('version')){
        $(listitem).each(function(){
            $(this).find(separator).after(($(this).attr(scriptversion)));
        });
    }
    if (GM_config.get('compact')){
        $(scriptstats).children().css('width','auto');
        $('dt' + totalinstalls).each(function(){
            $(this).css('display','none');
            $(this).siblings('dt' + dailyinstalls).find('span').append(' (' + $(this).find('span').text() + ')');
        });
        $('dd' + totalinstalls).each(function(){
            $(this).css('display','none');
            $(this).siblings('dd' + dailyinstalls).find('span').append(' (' + $(this).find('span').text() + ')');
        });
        $('dt' + updateddate).each(function(){
            $(this).css('display','none');
            $(this).siblings('dt' + createddate).find('span').append(' (' + $(this).find('span').text() + ')');
        });
        $('dd' + updateddate).each(function(){
            $(this).css('display','none');
            $(this).siblings('dd' + createddate).find('span').append(' (' + $(this).find('span').text() + ')');
        });
    }
    if (GM_config.get('userprofile')){
        $(userprofile).parent().children('h2')
            .append('<span>▼</span>')
            .click(function(){
                $(userprofile).slideToggle();
            })
        $(userprofile).slideUp();
    }
    if (GM_config.get('controlpanel')){
        collapse(controlpanel);
    }
    if (GM_config.get('discussions')){
        collapse(discussions);
    }
    if (GM_config.get('scriptsets')){
        collapse($(scriptsets).parents('section'));
    }
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
