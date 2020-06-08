// ==UserScript==
// @name            Youtube Channel Page Tweaks
// @namespace       almaceleste
// @version         0.1.0
// @description     when you open any Youtube channel, it changes the start page of this channel
// @description:ru  когда вы открываете какой-нибудь канал Youtube, меняет стартовую страницу этого канала
// @author          (ɔ) almaceleste  (https://almaceleste.github.io)
// @license         AGPL-3.0; http://www.gnu.org/licenses/agpl
// @icon            https://s.ytimg.com/yts/img/favicon-vfl8qSV2F.ico
// @icon64          https://s.ytimg.com/yts/img/favicon_96-vflW9Ec0w.png

// @homepageURL     https://greasyfork.org/en/users/174037-almaceleste
// @homepageURL     https://openuserjs.org/users/almaceleste
// @homepageURL     https://github.com/almaceleste/userscripts
// @supportURL      https://github.com/almaceleste/userscripts/issues
// @updateURL       https://github.com/almaceleste/userscripts/raw/master/src/Youtube_Channel_Page_Tweaks.user.js
// @downloadURL     https://github.com/almaceleste/userscripts/raw/master/src/Youtube_Channel_Page_Tweaks.user.js
// @downloadURL     https://openuserjs.org/install/almaceleste/Youtube_Channel_Page_Tweaks.user.js

// @require         https://code.jquery.com/jquery-3.3.1.js
// @require         https://raw.githubusercontent.com/uzairfarooq/arrive/master/minified/arrive.min.js
// @require         https://openuserjs.org/src/libs/sizzle/GM_config.js
// @grant           GM_getValue
// @grant           GM_setValue
// @grant           GM_registerMenuCommand
// @grant           GM_openInTab

// @match           http*://www.youtube.com/*
// @match           http*://www.youtube.com/user/*
// @match           http*://www.youtube.com/channel/*
// ==/UserScript==

// ==OpenUserJS==
// @author almaceleste
// ==/OpenUserJS==

const pattern = /^\/(channel|user)/;
const guidecontainer = '#content #guide[opened]';
const guidebutton = '#content #container #guide-button';
const options = {
    existing: true
};

const windowcss = `
    #ycptCfg {
        background-color: lightblue;
    }
    #ycptCfg .reset_holder {
        float: left;
        position: relative;
        bottom: -1em;
    }
    #ycptCfg .saveclose_buttons {
        margin: .7em;
    }
    #ycptCfg_field_url {
        background: none !important;
        border: none;
        cursor: pointer;
        padding: 0 !important;
        text-decoration: underline;
    }
    #ycptCfg_field_url:hover,
    #ycptCfg_resetLink:hover {
        filter: drop-shadow(0 0 1px dodgerblue);
    }
`;
const iframecss = `
    height: 26.5em;
    width: 43em;
    border: 1px solid;
    border-radius: 3px;
    position: fixed;
    z-index: 9999;
`;

GM_registerMenuCommand('Youtube Channel Page Tweaks Settings', opencfg);

function opencfg(){
	GM_config.open();
	ycptCfg.style = iframecss;
}

GM_config.init({
    id: 'ycptCfg',
    title: 'Youtube Channel Page Tweaks',
    fields: {
        start: {
            section: ['', 'Settings'],
            label: 'start page',
            labelPos: 'left',
            type: 'select',
            options: {
                featured: 1,
                videos: 2,
                playlists: 3,
                community: 4,
                channels: 5,
                about: 6
            },
            default: 2,
        },
        guide: {
            label: 'collapse left menu (require refresh)',
            labelPos: 'right',
            type: 'checkbox',
            default: 'true'
        },
        url: {
            section: ['', 'Support'],
            label: 'almaceleste.github.io',
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
        select: {
            toNode: function() {
                let field = this.settings,
                    value = this.value,
                    options = field.options,
                    id = this.id,
                    configId = this.configId,
                    labelPos = field.labelPos,
                    create = this.create;

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

                let retNode = create('div', { className: 'config_var',
                        id: `${configId}_${id}_var`,
                        title: field.title || '' }),
                    firstProp;

                // Retrieve the first prop
                for (let i in field) { firstProp = i; break; }

                let label = field.label ? create('label', {
                        id: `${configId}_${id}_field_label`,
                        for: `${configId}_field_${id}`,
                        className: 'field_label'
                    }, field.label) : null;

                let wrap = create('select', {
                    id: `${configId}_field_${id}`
                });
                this.node = wrap;

                for (let option in options) {
                    wrap.appendChild(create('option', {
                        value: options[option],
                        selected: options[option] == value
                    }, option));
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
                    rval = null;

                if (!node) return rval;

                rval = node[node.selectedIndex].value;

                return rval;
            },
            reset: function() {
                let node = this.node,
                    options = node.options;

                for (index in options) {
                    if (options[index].value == this['default']) {
                        node.selectedIndex = index;
                        break;
                    }
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

function startPage() {
    // create a pattern of the channel path without subpath
    const pattern = /^\/(channel|user)\/[^\/]*$/;
    if (matchPath(pattern)) {
        const tab = GM_config.get('start');
        const id = `#tabsContainer paper-tab:nth-of-type(${tab})`;
        console.log($(id));
        $(id).click();
    }
}

function guide() {
    console.log('guide:', $(guidecontainer).prop('opened'));
    console.log('guide:', $(guidecontainer));
    if (GM_config.get('guide')) {
        if ($(guidecontainer)){
            $(guidebutton).click();
        }
    }
}

function matchPath(pattern){
    const pathname = window.location.pathname;
    if (pathname.match(pattern)) {
        return true;
    }
    else {
        return false;
    }

}

(function() {
    'use strict';

    $(document).ready(() => {
        if (matchPath(pattern)){
            doThings();
        }
        else {
            $(window).on({
                transitionend: (e) => {
                    const c = 'yt-page-navigation-progress';
                    if (e.target.id = 'progress' && e.target.classList.contains(c)) {
                        if (matchPath(pattern)) {
                            doThings();
                        }
                        else {
                        }
                    }
                }
            });
        }
    });

    function doThings(){
        startPage();
        $(document).arrive(guidecontainer, options, () => {
            guide();
        });
    }
})();
