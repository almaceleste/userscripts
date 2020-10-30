// ==UserScript==
// @name            OpenEdu.Ru Tweaks
// @namespace       almaceleste
// @version         0.2.0
// @description     some tweaks for openedu.ru
// @description:ru  твики для openedu.ru
// @author          (ɔ) almaceleste  (https://almaceleste.github.io)
// @license         AGPL-3.0-or-later; http://www.gnu.org/licenses/agpl
// @icon            https://cdn.openedu.ru/EMQUAJW/default/default/images/favicon.bd3d272022e9.ico
// @icon64          https://cdn.openedu.ru/EMQUAJW/default/default/images/favicon.bd3d272022e9.ico

// @homepageURL     https://greasyfork.org/en/users/174037-almaceleste
// @homepageURL     https://openuserjs.org/users/almaceleste
// @homepageURL     https://github.com/almaceleste/userscripts
// @supportURL      https://github.com/almaceleste/userscripts/issues
// @updateURL       https://github.com/almaceleste/userscripts/raw/master/src/OpenEdu.Ru_Tweaks.user.js
// @downloadURL     https://github.com/almaceleste/userscripts/raw/master/src/OpenEdu.Ru_Tweaks.user.js
// @downloadURL     https://openuserjs.org/install/almaceleste/OpenEdu.Ru_Tweaks.user.js

// @require         https://code.jquery.com/jquery-3.3.1.js
// @require         https://raw.githubusercontent.com/uzairfarooq/arrive/master/minified/arrive.min.js
// @require         https://openuserjs.org/src/libs/sizzle/GM_config.js
// @grant           GM_getValue
// @grant           GM_setValue
// @grant           GM_registerMenuCommand
// @grant           GM_openInTab
// @grant           GM_getResourceText

// @resource        css https://github.com/almaceleste/userscripts/raw/master/css/default.css

// @match           http*://courses.openedu.ru/courses/course*
// ==/UserScript==

// ==OpenUserJS==
// @author almaceleste
// ==/OpenUserJS==

// script global variables

// arrive.js options
const existing = {
    existing: true
};

// set id that will used for an id of the settings window (frame)
const configId = 'openeduRuTweaksCfg';
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
    height: 185px;
    width: 435px;
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
        videoquality: {
            section: ['', 'Course tweaks'],
            label: 'hd video quality',
            labelPos: 'right',
            title: 'always use HD video quality (if available)',
            type: 'checkbox',
            default: true,
        },
        videokeybinding: {
            label: 'video keybinding',
            labelPos: 'right',
            title: `always use keyboard shortcuts to control video:
    <Space> - play/pause
    <Left>     - backward
    <Right>  - forward`,
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

// userscipt main function that started when page are loaded
(function() {
    'use strict';

    // set variables
    const video = '.tc-wrapper > .video-wrapper';
    const player = `${video} > .video-player`;
    const source = `${player} video > source`;
    const controls = `${video} > .video-controls`;
    const progress = `${controls} > .slider > .progress-handle`;
    const pause = `${controls} .vcr > .control.video_control`;
    const qualitybtn = `${controls} .secondary-controls > button.control.quality-control`;

    $(document).arrive(player, existing, () => {
        if (GM_config.get('videoquality')) {
            const src = $(source).attr('src');
            if (src.search(/sd\.mp4/)) $(qualitybtn).trigger('click');
        }
        if (GM_config.get('videokeybinding')) {
            // $(progress).focus();
            $(progress).attr('id', 'progress-handle');
            const el = document.getElementById('progress-handle');
            const ev = document.createEvent("Events");
            ev.initEvent("keydown", false, true);
            $(document).on({
                keydown: (e) => {
                    // console.log('on:', e.type, e.keyCode, e);
                    if (e.target.localName != 'input') {
                        if (e.target.id != 'progress-handle') {
                            let n = 0;
                            switch (e.keyCode) {
                                case 37: // left or
                                    e.preventDefault();
                                    $(progress).focus();
                                    ev.which = 37;
                                    ev.keyCode = 37;
                                    while (n < 5) {
                                        el.dispatchEvent(ev);
                                        n++;
                                    }
                                    break;
                                case 39: // right
                                    e.preventDefault();
                                    $(progress).focus();
                                    ev.which = 39;
                                    ev.keyCode = 39;
                                    while (n < 5) {
                                        el.dispatchEvent(ev);
                                        n++;
                                    }
                                    break;
                                case 38: // up
                                    break;
                                case 40: // down
                                    break;
                                default:
                                    break;
                            }
                        }
                    }
                },
                keypress: (e) => {
                    // console.log('on:', e.type, e.keyCode, e);
                    if (e.target.localName != 'input') {
                        switch (e.keyCode) {
                            case 32: // space
                                e.preventDefault();
                                $(pause).trigger('click');
                                break;
                            default:
                                break;
                        }
                    }
                },
                keyup: (e) => {
                    if (e.target.id == 'progress-handle') $(progress).blur();
                }
            });
        }
    })
})();
