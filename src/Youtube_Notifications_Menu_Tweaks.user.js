// ==UserScript==
// @name            Youtube Notifications Menu Tweaks
// @namespace       almaceleste
// @version         0.0.2
// @description     tweaks for Youtube Notifications Menu
// @description:ru  твики для Youtube Notifications Menu
// @author          (ɔ) almaceleste  (https://almaceleste.github.io)
// @license         AGPL-3.0-or-later; http://www.gnu.org/licenses/agpl
// @icon            https://s.ytimg.com/yts/img/favicon-vfl8qSV2F.ico
// @icon64          https://s.ytimg.com/yts/img/favicon_96-vflW9Ec0w.png

// @homepageURL     https://greasyfork.org/en/users/174037-almaceleste
// @homepageURL     https://openuserjs.org/users/almaceleste
// @homepageURL     https://github.com/almaceleste/userscripts
// @supportURL      https://github.com/almaceleste/userscripts/issues
// @updateURL       file:///home/alma/repo/userscripts/src/Youtube_Notifications_Menu_Tweaks.user.js
// @downloadURL     file:///home/alma/repo/userscripts/src/Youtube_Notifications_Menu_Tweaks.user.js
// @updateURL       https://github.com/almaceleste/userscripts/raw/master/src/Youtube_Notifications_Menu_Tweaks.user.js
// @downloadURL     https://github.com/almaceleste/userscripts/raw/master/src/Youtube_Notifications_Menu_Tweaks.user.js
// @downloadURL     https://openuserjs.org/install/almaceleste/Youtube_Notifications_Menu_Tweaks.user.js

// @require         https://code.jquery.com/jquery-3.3.1.js
// @require         https://raw.githubusercontent.com/uzairfarooq/arrive/master/minified/arrive.min.js
// @require         https://openuserjs.org/src/libs/sizzle/GM_config.js
// @grant           GM_getValue
// @grant           GM_setValue
// @grant           GM_registerMenuCommand
// @grant           GM_openInTab
// @grant           GM_getResourceText

// @resource        css https://github.com/almaceleste/userscripts/raw/master/css/default.css

// @match           https://www.youtube.com/*
// ==/UserScript==

// ==OpenUserJS==
// @author almaceleste
// ==/OpenUserJS==

// set id that will used for an id of the settings window (frame)
const configId = 'ytnmtCfg';
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
        channelName: {
            section: ['', 'Settings'],
            label: 'add channel name',
            labelPos: 'right',
            type: 'checkbox',
            default: true,
        },
        duration: {
            label: 'add video duration',
            labelPos: 'right',
            type: 'checkbox',
            default: true,
        },
        tooltip: {
            label: 'add tooltip with description',
            labelPos: 'right',
            type: 'checkbox',
            default: true,
        },
        deleteRecommended: {
            label: 'delete "Recommended:"',
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
function getProp(container, tag, prop) {
    let key = container.querySelector(`${tag}[itemprop='${prop}']`);
    let value = key.getAttribute('content');
    return value;
}

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

function durationToString(duration) {
    const units = ['second', 'minute', 'hour'];         // the units are reversed because we'll use the reversed time array
    const array = duration.split(':');

    array.reverse().forEach((e, i) => {
        const u = units[i];
        const s = e == 1 ? '' : 's';
        array[i] = `${+e} ${u}${s}`;
    });

    return array.reverse().join(', ');
}

// userscript main function that started when page are loaded
(function() {
    'use strict';

    // set variables
    const notificationItems = 'yt-multi-page-menu-section-renderer > #items';
    const notificationItem = `ytd-notification-renderer > a`;
    const videoAge = 'div.text.style-scope.ytd-notification-renderer > div.metadata.style-scope.ytd-notification-renderer > yt-formatted-string:nth-child(2)';

    // get settings
    const deleteRecommended = GM_config.get('deleteRecommended');
    const addTooltip = GM_config.get('tooltip');
    const addChannelName = GM_config.get('channelName');
    const addDuration = GM_config.get('duration');

    if (deleteRecommended || addTooltip || addChannelName || addDuration) {
        document.arrive(notificationItems, {onceonly: true}, m => {
            $(m).arrive(notificationItem, {existing: true}, n => {
                const url = 'https://www.youtube.com' + $(n).attr('href');
                const id = url.split('=')[1];
                $(n).parent().attr('id', id);
                fetch(url).then(res => res.text())
                    .then(html => {
                        const parser = new DOMParser();
                        const doc = parser.parseFromString(html, "text/html");
                        const watch7Content = doc.getElementById('watch7-content');

                        const notificationNameElement = $(n).find('yt-formatted-string.message.ytd-notification-renderer');
                        if (deleteRecommended) {
                            let notificationName = notificationNameElement.text();
                            notificationName = notificationName.replace(/.*: (.*)/, '$1');
                            notificationNameElement.text(notificationName);
                        }
                        if (addTooltip) {
                            let description = getProp(watch7Content, 'meta', 'description');
                            notificationNameElement.css({
                                'margin-bottom': '5px',
                            });
                            $(n).parent().prop('title', description);
                        }

                        if (addChannelName) {
                            const channelName = getProp(watch7Content, 'link', 'name');
                            const channelNameElement = $(`
                                <span title="" class="style-scope ytd-channel-name">
                                    ${channelName}
                                </span>
                            `);
                            channelNameElement.css({
                                'color': 'var(--yt-endpoint-color, var(--yt-spec-text-primary)) !important',
                                'font-family': '"Roboto","Arial",sans-serif',
                                'font-size':	'14px',
                                'font-weight':	'500',
                                'line-height':	'var(--ytd-channel-name-text_-_line-height)',
                            });
                            $(n).find('.text.ytd-notification-renderer').append(channelNameElement);
                        }

                        if (addDuration) {
                            let duration = getProp(watch7Content, 'meta', 'duration');
                            duration = parseDuration(duration);
                            const durationOverlay = $(`
                                    <ytd-thumbnail-overlay-time class="style-scope ytd-thumbnail" overlay-style="DEFAULT">
                                        <span id="text" class="style-scope ytd-thumbnail-overlay-time-status-renderer" aria-label="${durationToString(duration)}">
                                            ${duration}
                                        </span>
                                    </ytd-thumbnail-overlay-time>
                            `);
                            durationOverlay.css({
                                'position':	'absolute',
                                'bottom':	'0',
                                'right':	'0',
                                'margin':	'0',
                                'color':	'var(--yt-spec-static-brand-white)',
                                'background-color':	'var(--yt-spec-static-overlay-background-heavy)',
                                'padding':	'2px 2px',
                                'height':	'12px',
                                'border-radius':	'2px',
                                'font-size':	'var(--yt-badge-font-size,1.2rem)',
                                'font-weight':	'var(--yt-badge-font-weight,500)',
                                'line-height':	'var(--yt-badge-line-height-size,1.2rem)',
                                'letter-spacing':	'var(--yt-badge-letter-spacing,unset)',
                                'letter-spacing':	'var(--yt-badge-letter-spacing,0.5px)',
                            });
                            $(n).find('.thumbnail-container').append(durationOverlay);
                        }
                    });

                $(n).find(videoAge).each((i, a) => {
                    $(a).css({
                        'position': 'absolute',
                        'right': '56px',
                        'top': '65px',
                    });
                });
            });
        });
    }
})();
