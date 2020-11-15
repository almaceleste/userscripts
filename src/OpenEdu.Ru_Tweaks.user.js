// ==UserScript==
// @name            OpenEdu.Ru Tweaks
// @namespace       almaceleste
// @version         0.4.0
// @description     some tweaks for openedu.ru
// @description:ru  некоторые твики для openedu.ru
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
    height: 205px;
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
    <Space>             - play/pause
    <Left>/<Right> - backward/forward (5 sec)
    <Down>/<Up>  - fast backward/forward (10 sec)`,
            type: 'checkbox',
            default: true,
        },
        videokeybindings: {
            title: `
<Space>             - play/pause
<Left>/<Right> - backward/forward (5 sec)
<Down>/<Up>  - fast backward/forward (10 sec)
<1...4>    - video speed control (0.75x, 1.0x, 1.25x, 1.50x)`,
            type: 'multicheckbox',
            options: {
                pause: true,
                rewind: true,
                fastrewind: true,
                speedcontrol: true,
            },
            default: {
                pause: true,
                rewind: true,
                fastrewind: true,
                speedcontrol: true,
            },
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
    types: {
        multicheckbox: {
            default: {},
            toNode: function() {
                let field = this.settings,
                    values = this.value,
                    options = field.options,
                    id = this.id,
                    configId = this.configId,
                    labelPos = field.labelPos,
                    create = this.create;
                console.log('toNode:', field, values, options);

                function addLabel(pos, labelEl, parentNode, beforeEl) {
                    if (!beforeEl) beforeEl = parentNode.firstChild;
                    switch (pos) {
                        case 'right': case 'below':
                            if (pos == 'below')
                                parentNode.appendChild(create('br', {}));
                            parentNode.appendChild(labelEl);
                            break;
                        default:
                            if (pos == 'above')
                                parentNode.insertBefore(create('br', {}), beforeEl);
                            parentNode.insertBefore(labelEl, beforeEl);
                    }
                }

                let retNode = create('div', {
                        className: 'config_var multicheckbox',
                        id: `${configId}_${id}_var`,
                        title: field.title || ''
                    }),
                    firstProp;

                // Retrieve the first prop
                for (let i in field) { firstProp = i; break; }

                let label = field.label ? create('label', {
                        className: 'field_label',
                        id: `${configId}_${id}_field_label`,
                        for: `${configId}_field_${id}`,
                    }, field.label) : null;
                let wrap = create('ul', {
                    id: `${configId}_field_${id}`
                });
                this.node = wrap;

                // for (const key in values) {
                for (const key in options) {
                        // console.log('toNode:', key);
                    const inputId = `${configId}_${id}_${key}_checkbox`;
                    const li = wrap.appendChild(create('li', {
                    }));
                    li.appendChild(create('input', {
                        checked: values.hasOwnProperty(key) ? values[key] : options[key],
                        id: inputId,
                        type: 'checkbox',
                        value: key,
                    }));
                    li.appendChild(create('label', {
                        className: 'option_label',
                        for: inputId,
                    }, key));
                }

                retNode.appendChild(wrap);

                if (label) {
                    // If the label is passed first, insert it before the field
                    // else insert it after
                    if (!labelPos)
                        labelPos = firstProp == "label" ? "left" : "right";
                    addLabel(labelPos, label, retNode);
                }
                return retNode;
            },
            toValue: function() {
                let node = this.node,
                    id = node.id,
                    rval = {};
                // console.log('toValue:', node, this);

                if (!node) return rval;

                let nodelist = node.querySelectorAll(`#${id} input`);
                // console.log('nodelist:', document.querySelectorAll(`#${id} input:checked`), nodelist);
                nodelist.forEach((input) => {
                    // console.log('toValue:', input);
                    const value = input.checked;
                    const key = input.value;
                    rval[key] = value;
                });

                // console.log('toValue:', rval);
                return rval;
            },
            reset: function() {
                let node = this.node,
                    values = this.default;
                // console.log('reset:', node, values, Object.values(values));

                const inputs = node.getElementsByTagName('input');
                for (const index in inputs) {
                    const input = inputs[index];
                    input.checked = values[input.value];
                }
            }
        }
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
    const secondarycontrols = `${controls} .secondary-controls`;
    const qualitybtn = `${secondarycontrols} > button.control.quality-control`;
    const videospeeds = `${secondarycontrols} > .speeds > .video-speeds`;
    const videospeed1 = `${videospeeds} > li:nth-last-child(1) > button.control`;
    const videospeed2 = `${videospeeds} > li:nth-last-child(2) > button.control`;
    const videospeed3 = `${videospeeds} > li:nth-last-child(3) > button.control`;
    const videospeed4 = `${videospeeds} > li:nth-last-child(4) > button.control`;

    $(document).arrive(player, existing, () => {
        if (GM_config.get('videoquality')) {
            const src = $(source).attr('src');
            if (src.search(/sd\.mp4/)) $(qualitybtn).trigger('click');
        }
        if (GM_config.get('videokeybinding')) {
            // const keybindings = GM_config.get('videokeybindings');
            $(progress).attr('id', 'progress-handle');
            const el = document.getElementById('progress-handle');
            const ev = document.createEvent("Events");
            ev.initEvent("keydown", false, true);
            $(window).on({
                keydown: (e) => {
                    const keybindings = GM_config.get('videokeybindings');
                    // console.log('on:', e.type, e.keyCode, e);
                    if (e.target.localName != 'input') {
                        if (e.target.id != 'progress-handle') {
                            let n = 0;
                            switch (e.keyCode) {
                                case 37: // left
                                    if (keybindings.rewind) {
                                        // e.preventDefault();
                                        $(progress).focus();
                                        ev.which = 37;
                                        ev.keyCode = 37;
                                        while (n < 5) {
                                            el.dispatchEvent(ev);
                                            n++;
                                        }
                                    }
                                    break;
                                case 39: // right
                                    if (keybindings.rewind) {
                                        // e.preventDefault();
                                        $(progress).focus();
                                        ev.which = 39;
                                        ev.keyCode = 39;
                                        while (n < 5) {
                                            el.dispatchEvent(ev);
                                            n++;
                                        }
                                    }
                                    break;
                                case 38: // up
                                    if (keybindings.fastrewind) {
                                        // e.preventDefault();
                                        $(progress).focus();
                                        ev.which = 39;
                                        ev.keyCode = 39;
                                        while (n < 10) {
                                            el.dispatchEvent(ev);
                                            n++;
                                        }
                                    }
                                    break;
                                case 40: // down
                                    if (keybindings.fastrewind) {
                                        // e.preventDefault();
                                        $(progress).focus();
                                        ev.which = 37;
                                        ev.keyCode = 37;
                                        while (n < 10) {
                                            el.dispatchEvent(ev);
                                            n++;
                                        }
                                    }
                                    break;
                                default:
                                    break;
                            }
                        }
                    }
                },
                keypress: (e) => {
                    const keybindings = GM_config.get('videokeybindings');
                    // console.log('on:', e.type, e.keyCode, e);
                    if (e.target.localName != 'input') {
                        switch (e.keyCode) {
                            case 32: // space
                                if (keybindings.pause) {
                                    e.preventDefault();
                                    $(pause).trigger('click');
                                }
                                break;
                            case 49: // 1
                                if (keybindings.speedcontrol) {
                                    e.preventDefault();
                                    $(videospeed1).trigger('click');
                                }
                                break;
                            case 50: // 2
                                if (keybindings.speedcontrol) {
                                    e.preventDefault();
                                    $(videospeed2).trigger('click');
                                }
                                break;
                            case 51: // 3
                                if (keybindings.speedcontrol) {
                                    e.preventDefault();
                                    $(videospeed3).trigger('click');
                                }
                                break;
                            case 52: // 4
                                if (keybindings.speedcontrol) {
                                    e.preventDefault();
                                    $(videospeed4).trigger('click');
                                }
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
            window.addEventListener('keydown', (e) => {
                const keybindings = GM_config.get('videokeybindings');
                if (e.target.localName != 'input') {
                    switch (e.keyCode) {
                        case 37: // left
                        case 39: // right
                            if (keybindings.rewind)
                                e.preventDefault();
                            break;
                        case 38: // up
                        case 40: // down
                            if (keybindings.fastrewind)
                                e.preventDefault();
                            break;
                        default:
                            break;
                    }
                }
            }, {
                capture: true,
                // passive: false
            });
        }
    })
})();
