// ==UserScript==
// @name            Greasy Fork tweaks
// @namespace       almaceleste
// @version         0.2.1
// @description     this code opens scripts pages in new tab from lists and compacts user interface
// @description:ru  этот код открывает страницы скриптов в новой вкладке из списков и делает интерфейс более компактным
// @author          (ɔ) Paola Captanovska
// @license         AGPL-3.0-or-later; http://www.gnu.org/licenses/agpl.txt
// @icon            https://greasyfork.org/assets/blacklogo16-bc64b9f7afdc9be4cbfa58bdd5fc2e5c098ad4bca3ad513a27b15602083fd5bc.png
// @icon64          https://greasyfork.org/assets/blacklogo96-e0c2c76180916332b7516ad47e1e206b42d131d36ff4afe98da3b1ba61fd5d6c.png

// @homepageURL     https://greasyfork.org/en/users/174037-almaceleste
// @homepageURL     https://openuserjs.org/users/almaceleste
// @homepageURL     https://github.com/almaceleste/userscripts
// @supportURL      https://github.com/almaceleste/userscripts/issues
// @updateURL       https://github.com/almaceleste/userscripts/raw/master/src/Greasy_Fork_tweaks.meta.js
// @downloadURL     https://github.com/almaceleste/userscripts/raw/master/src/Greasy_Fork_tweaks.user.js
// @downloadURL     https://openuserjs.org/install/almaceleste/Greasy_Fork_tweaks.user.js

// @run-at          document-end
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

const windowcss = '#greasyforktweaksCfg {background-color: lightblue;} #greasyforktweaksCfg .reset_holder {float: left; position: relative; bottom: -1em;} #greasyforktweaksCfg .saveclose_buttons {margin: .7em;}';
const iframecss = 'height: 30.1em; width: 30em; border: 1px solid; border-radius: 3px; position: fixed; z-index: 999;';

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


GM_registerMenuCommand('Greasy Fork tweaks Settings', opencfg);

function opencfg()
{
	GM_config.open();
	greasyforktweaksCfg.style = iframecss;
}

GM_config.init(
{
    id: 'greasyforktweaksCfg',
    title: 'Greasy Fork tweaks',
    fields:
    {
        version:
        {
            section: ['Script list', 'Script list options (common and user lists)'],
            label: 'add script version number in the list of scripts',
            labelPos: 'right',
            type: 'checkbox',
            default: true,
        },
        compact:
        {
            label: 'compact script information',
            labelPos: 'right',
            type: 'checkbox',
            default: true,
        },
        userprofile:
        {
            section: ['User page', 'User page options (my page and other users`)'],
            label: 'collapse user profile info on user page',
            labelPos: 'right',
            type: 'checkbox',
            default: true,
        },
        controlpanel:
        {
            label: 'collapse control panel on user page',
            labelPos: 'right',
            type: 'checkbox',
            default: true,
        },
        discussions:
        {
            label: 'collapse discussions on user page',
            labelPos: 'right',
            type: 'checkbox',
            default: true,
        },
        scriptsets:
        {
            label: 'collapse script sets on user page',
            labelPos: 'right',
            type: 'checkbox',
            default: true,
        },
        newtab:
        {
            section: ['New tab', 'Open script page in new tab'],
            label: 'open script page in new tab',
            labelPos: 'right',
            type: 'checkbox',
            default: true,
        },
        background:
        {
            label: 'open new tab in background',
            labelPos: 'right',
            type: 'checkbox',
            default: false,
        },
        insert:
        {
            label: 'insert new tab next to the current instead of the right end',
            labelPos: 'right',
            type: 'checkbox',
            default: true,
        },
        setParent:
        {
            label: 'return to the current tab after new tab closed',
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

    var options = {active: !GM_config.get('background'), insert: GM_config.get('insert'), setParent: GM_config.get('setParent')};

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
            .append('<span>&#9660</span>')
            .click(function(){
                $(userprofile).slideToggle();
            })
        $(userprofile).slideUp();
    }
    if (GM_config.get('controlpanel')){
        $(controlpanel)
            .accordion({
                collapsible: true,
                active: false
            })
            .find('header h3').append('<span>&#9660</span>')
    }
    if (GM_config.get('discussions')){
        $(discussions)
            .accordion({
                collapsible: true,
                active: false
            })
            .find('header h3').append('<span>&#9660</span>')
    }
    if (GM_config.get('scriptsets')){
        $(scriptsets).parents('section')
            .accordion({
                collapsible: true,
                active: false
            })
            .find('header h3').append('<span>&#9660</span>')
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
