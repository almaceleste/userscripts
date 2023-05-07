// ==UserScript==
// @name            Youtube Save to playlist Filter
// @namespace       almaceleste
// @version         0.0.1*
// @description     filter for playlists in the "Save to" menu on Youtube
// @description:ru  фильтр для прейлистов в меню сохранения Youtube
// @author          (ɔ) almaceleste  (https://almaceleste.github.io)
// @license         AGPL-3.0-or-later; http://www.gnu.org/licenses/agpl
// @icon            https://s.ytimg.com/yts/img/favicon-vfl8qSV2F.ico
// @icon64          https://s.ytimg.com/yts/img/favicon_96-vflW9Ec0w.png

// @require         https://code.jquery.com/jquery-3.3.1.js
// @require         https://raw.githubusercontent.com/uzairfarooq/arrive/master/minified/arrive.min.js
// @require         https://openuserjs.org/src/libs/sizzle/GM_config.js
// @grant           GM_getValue
// @grant           GM_setValue
// @grant           GM_registerMenuCommand
// @grant           GM_openInTab
// @grant           GM_getResourceText

// @resource        css https://github.com/almaceleste/userscripts/raw/master/css/default.css

// @match           https://www.youtube.com/watch?*
// ==/UserScript==

// ==OpenUserJS==
// @author almaceleste
// ==/OpenUserJS==

// set id that will used for an id of the settings window (frame)
const configId = 'ystfCfg';
// set url to a usercript icon in the settings window
const iconUrl = GM_info.script.icon64;

// set patterns for replacing specific selectors in a default, centralized css (for settings window)
const pattern = {};
pattern[`#${configId}`] = /#configId/g;
pattern[`${iconUrl}`] = /iconUrl/g;

// get remote default css
let css = GM_getResourceText('css');
// iterate patterns and replace found substrings with them
Object.keys(pattern).forEach((key) => {
    css = css.replace(pattern[key], key);
});
const windowcss = css;
// main parameters of the settings window (frame). specific to each script due to the different amount of the parameters in each script
const iframecss = `
    height: 235px;
    width: 455px;
    border: 1px solid;
    border-radius: 3px;
    position: fixed;
    z-index: 9999;
`;

// register settings menu in a userscript manager (Tampermonkey, Greasemonkey or other)
GM_registerMenuCommand(`${GM_info.script.name} Settings`, () => {
	GM_config.open();
    GM_config.frame.style = iframecss;
});

// definition of the settings parameters for the script
GM_config.init({
    id: `${configId}`,
    title: `${GM_info.script.name} ${GM_info.script.version}`,
    fields: {
        realtime: {
            section: ['', 'Settings'],
            label: 'realtime mode',
            labelPos: 'right',
            type: 'checkbox',
            default: true,
        },
        focused: {
            label: 'focus input on open',
            labelPos: 'right',
            type: 'checkbox',
            default: true,
        },
        syncName: {
            label: 'synchronize filter with "New playlist" field',
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

// functions that are used in the main function
function getFocus(target) {
    setTimeout(() => {target.trigger('focus');}, 1000);
}

// userscript main function that started when page are loaded
(function() {
    'use strict';

    // set global function variables
    const saveDialog = 'body > ytd-app > ytd-popup-container > tp-yt-paper-dialog > ytd-add-to-playlist-renderer';
    const header = `${saveDialog} > #header`;

    // get settings
    const filterEvent = GM_config.get('realtime') ? 'keyup' : 'change';
    const focused = GM_config.get('focused');

    const filterDiv = $('<div>');
    const filterInput = $('<input id="save-filter" type="text" placeholder="filter">');
    const clearButton = $('<button id="clear-filter">🞨</button>');
    filterDiv.css({
        'border': '1px solid #333',
        'flex': 'auto',
        'font-size': '1.6rem',
        'margin-right': '10px',
        'position': 'relative',
    });
    filterInput.css({
        'border': 'none',
        'outline': 'none',
        'width': '90%',
    });
    clearButton.css({
        'border': 'none',
        'cursor': 'pointer',
        'line-height': '1rem',
        'padding': '0',
        'position': 'absolute',
        'right': '.3rem',
        'top': '.5rem',
    });
    filterInput.on(filterEvent, e => {
        const pattern = e.target.value;
        const playlistPath = `${saveDialog} > #playlists > ytd-playlist-add-to-option-renderer`;

        if (pattern) {
            const playlistName = `${playlistPath} > #checkbox > #checkboxLabel > #checkbox-container > #checkbox-label > #label`;

            $(playlistPath).hide();
            $(`${playlistName}[title*="${pattern}"]`).closest(playlistPath).show();
        }
        else $(playlistPath).show();
    });
    clearButton.on('click', () => {
        filterInput.val('');
        filterInput.trigger('focus');
        filterInput.trigger(filterEvent);
    });
    filterDiv.append(filterInput, clearButton);

    if (focused) {
        const saveButton = '#flexible-item-buttons > ytd-button-renderer > yt-button-shape > button[aria-label="Save to playlist"]';
        const saveMenuButton = 'tp-yt-paper-listbox > ytd-menu-service-item-renderer';

        document.arrive(saveButton, {existing: true}, b => {
            $(b).on('click', () => {
                getFocus(filterInput);
            });
        });

        document.arrive(saveMenuButton, {existing: true}, b => {
            const saveMenuLabel = `tp-yt-paper-item > yt-formatted-string:contains('Save')`;
            $(b).has(saveMenuLabel).on('click', () => {
                getFocus(filterInput);
            });
        });
    }

    document.arrive(header, {onceonly: true}, h => {
        const syncName = GM_config.get('syncName');
        const headerTitle = `${header} > #title`;

        const title = $(h).children(headerTitle);
        const parent = $(h).parent();

        title.css({
            'flex': 'unset',
            'flex-basis': 'auto',
        });
        title.after(filterDiv);
        if (focused) {
            getFocus(filterInput);
        }
        if (syncName) {
            const newPlaylistName = '#labelAndInputContainer > iron-input > input';

            parent.arrive(newPlaylistName, {onceonly: true, existing: true}, n => {
                n = $(n);
                n.on('keyup', () => {
                    filterInput.val(n.val());
                    filterInput.trigger(filterEvent);
                });
                filterInput.on(filterEvent, () => {
                    n.val(filterInput.val());
                });
            });
        }
    });

})();
