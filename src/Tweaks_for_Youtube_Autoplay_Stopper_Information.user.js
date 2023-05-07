// ==UserScript==
// @name            Tweaks for Youtube Autoplay Stopper Information
// @namespace       almaceleste
// @version         0.0.1*
// @description     video information modal for Tweaks for Youtube Extension's Autoplay Stopper feature
// @description:ru  информационный модал для Автоплей Стоппера расширения Tweaks for Youtube
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
const configId = 'tyasimCfg';
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
function parseDuration(duration) {
    const pattern = /(\d+)/g;
    const array = duration.match(pattern);
    // console.log('array:', array);
    if (array[0] >= 60) {
        let minutes = array[0];
        const hours = Math.floor(minutes/60);
        minutes %= 60;          // minutes = minutes % 60 (get the remaining minutes)
        array[0] = minutes;
        array.splice(0, 0, hours);
    }
    for (let i = 1; i < array.length; i++) {
        let e = array[i];
        e = e < 10 ? `0${e}` : e;
        array[i] = e;
    }
    const time = array.join(':');

    return time;
}

// userscript main function that started when page are loaded
(function() {
    'use strict';

    // set variables
    const thumbnailDiv = '#movie_player > div.ytp-cued-thumbnail-overlay';
    const durationMeta = '#watch7-content > meta[itemprop="duration"]';

    // get settings
    // const syncName = GM_config.get('syncName');

    // get video duration
    const duration = parseDuration($(durationMeta).attr('content'));

    const durationDiv = $('<ytd-thumbnail-overlay-time class="style-scope ytd-thumbnail" overlay-style="DEFAULT">');
    const durationSpan = $(`<span>${duration}</span>`);
    durationDiv.css({
        'background-color': 'var(--yt-spec-static-overlay-background-heavy)',
        'border-radius': '3px',
        'bottom': '25px',
        'color': 'var(--yt-spec-static-brand-white)',
        'font-size': '1.4rem',
        'left': '25px',
        'padding': '5px 7px',
        'position': 'absolute',
    });
    durationDiv.append(durationSpan);

    document.arrive(thumbnailDiv, {onceonly: true, existing: true}, t => {
        $(t).append(durationDiv);
    });

})();
