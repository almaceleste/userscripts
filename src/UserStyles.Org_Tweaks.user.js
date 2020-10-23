// ==UserScript==
// @name            UserStyles.Org Tweaks
// @namespace       almaceleste
// @version         0.2.0
// @description     some fixes for userstyle.org
// @description:ru  несколько исправлений для userstyle.org
// @author          GNU Affero GPL 3.0 🄯 2020 almaceleste  (https://almaceleste.github.io)
// @license         AGPL-3.0-or-later; http://www.gnu.org/licenses/agpl.txt
// @icon            https://userstyles.org/ui/images/icons/favicon.png
// @icon64          https://userstyles.org/ui/images/icons/app_icon.png

// @homepageURL     https://greasyfork.org/en/users/174037-almaceleste
// @homepageURL     https://openuserjs.org/users/almaceleste
// @homepageURL     https://github.com/almaceleste/userscripts
// @supportURL      https://github.com/almaceleste/userscripts/issues
// @updateURL       https://github.com/almaceleste/userscripts/raw/master/src/UserStyles.Org_Tweaks.user.js
// @downloadURL     https://github.com/almaceleste/userscripts/raw/master/src/UserStyles.Org_Tweaks.user.js
// @downloadURL     https://openuserjs.org/install/almaceleste/UserStyles.Org_Tweaks.user.js

// @require         https://code.jquery.com/jquery-3.3.1.js
// @require         https://raw.githubusercontent.com/uzairfarooq/arrive/master/minified/arrive.min.js
// @require         https://openuserjs.org/src/libs/sizzle/GM_config.js
// @grant           GM_getValue
// @grant           GM_setValue
// @grant           GM_registerMenuCommand
// @grant           GM_openInTab
// @grant           GM_getResourceText

// @resource        css https://github.com/almaceleste/userscripts/raw/master/css/default.css

// @match           http*://*.userstyles.org/styles/new
// @match           http*://*.userstyles.org/d/styles/new
// @match           http*://*.userstyles.org/styles/*/edit
// @match           http*://*.userstyles.org/d/styles/*/edit
// ==/UserScript==

// ==OpenUserJS==
// @author almaceleste
// ==/OpenUserJS==

// script global variables
const offset = 50;
const frame = '#iframe';

const form = `body > .PageContent > form[action='/styles/create']`;
const newoptionbutton = `.new-option > input[type='button']`;
const newsettingbutton = `#new-setting > input[type='button']`;
const newdropdownbutton = `${newsettingbutton}:nth-of-type(1)`;
const newcolorbutton = `${newsettingbutton}:nth-of-type(2)`;
const newtextbutton = `${newsettingbutton}:nth-of-type(3)`;
const textarea = `${form} textarea`;
const img = `${form} img`;
const codeeditor = `${form} #enable-source-editor-code`;
const codetext = `${form} #css`;
const settingsection = `${form} #edit-style-settings`;
const dropdownsetting = `${settingsection} > .edit-dropdown-setting`;
const colorsetting = `${settingsection} > .edit-color-setting`;
const textsetting = `${settingsection} > .edit-text-setting`;
const settinglabel = `input:nth-of-type(1)`;
const settingkey = `input:nth-of-type(2)`;
const settingvalue = `input:nth-of-type(6)`;
const optionlabel = `input:nth-of-type(1)`;
const optionkey = `input:nth-of-type(2)`;
const optiondefault = `input:nth-of-type(3)`;
const optionvalue = `textarea`;
const quotes = "'" + '"' + '`';
// arrive.js options
const existing = {
    existing: true
};
const onceonly = {
    onceOnly: true,
    existing: false
}

// config settings
const configId = 'usotweaksCfg';
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
    height: 255px;
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
        frameWidth: {
            section: ['', 'New style and Edit pages'],
            label: 'frame width in px',
            labelPos: 'left',
            title: `editing frame width in pixels
    0 - default width`,
            type: 'int',
            default: 0,
        },
        fixframeHeight: {
            label: 'fix frame height on changing content',
            labelPos: 'right',
            title: `fix frame height when adding new settings and options or resizing text area`,
            type: 'checkbox',
            default: true,
        },
        fixtextareaWidth: {
            label: 'fix textarea width',
            labelPos: 'right',
            title: ``,
            type: 'checkbox',
            default: true,
        },
        parsecode: {
            label: 'add parse button to the new/edit page',
            labelPos: 'right',
            title: ``,
            type: 'checkbox',
            default: true,
        },
        parsetargets: {
            title: 'only variables for the uso preprocessor yet',
            type: 'multiselect',
            options: {
                // name: true,
                // description: true,
                variables: true,
            },
            default: {variables: true},
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
        multiselect: {
            default: {},
            toNode: function() {
                let field = this.settings,
                    value = this.value,
                    options = field.options,
                    id = this.id,
                    configId = this.configId,
                    labelPos = field.labelPos,
                    create = this.create;

                // console.log('toNode:', field, value, options);
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
                        className: 'config_var multiselect',
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

                for (const key in options) {
                    // console.log('toNode:', key);
                    const inputId = `${configId}_${id}_${key}_checkbox`;
                    const li = wrap.appendChild(create('li', {
                    }));
                    li.appendChild(create('input', {
                        checked: value.hasOwnProperty(key),
                        id: inputId,
                        type: 'checkbox',
                        value: options[key],
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
                    options = this.settings.options,
                    rval = {};

                // console.log('toValue:', node, options, this);

                if (!node) return rval;

                let nodelist = node.querySelectorAll(`#${id} input:checked`);
                // console.log('nodelist:', document.querySelectorAll(`#${id} input:checked`), nodelist);
                nodelist.forEach((input) => {
                    // console.log('toValue:', input);
                    const value = input.value;
                    const key = Object.keys(options).find((key) => options[key] == value);
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
                    // console.log('reset:', input.value, Object.values(values).includes(input.value) || Object.values(values).includes(+input.value));
                    if (Object.values(values).includes(input.value) || Object.values(values).includes(+input.value)) {
                        if (!input.checked) input.click();
                    }
                    else {
                        if (input.checked) input.click();
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

// script code
function clicklistener(selector){
    $(form).arrive(selector, existing, (element) => {
        $(element).on({
            click: () => {
                fixframeHeight();
            }
        });
    });
}

function addinglistener(selector){
    $(form).arrive(selector, existing, () => {
        fixframeHeight();
    });
}

function resizelistener(selector){
    $(form).arrive(selector, existing, (element) => {
        const options = {once: true};
        $(element).on({
            mousedown: () => {
                window.addEventListener('mouseup', fixframeHeight, options);
            },
            mouseup: () => {
                fixframeHeight();
                window.removeEventListener('mouseup', fixframeHeight, options);
            }
        });
    });
}

function fixWidth(selector){
    $(document).arrive(selector, existing, (element) => {
        $(element).css({
            resize: 'vertical',
        })
    });
}

function fixframeHeight(){
    const height = $('body').height() + offset;
    const frame = window.parent.document.getElementById('iframe');
    $(frame).height(height);
}

function fixframeWidth(width){
    const frame = window.parent.document.getElementById('iframe');
    $(frame).css({
        left: '50%',
        position: 'relative',
        transform: 'translateX(-50%)',
    }).width(width);
}

function addparseButton() {
    const parseButton = $('<button></button>', {
        id: 'parseButton',
        text: 'Parse Code',
        type: 'button',
        on: {
            click: () => {
                parseCode();
            }
        }
    });
    $(codetext).after(parseButton);
}

function parseCode() {
    const parsetargets = GM_config.get('parsetargets');
    if (Object.keys(parsetargets).length > 0) {
        if ($(codeeditor).prop('checked')) {
            $(codeeditor).trigger('click');
        }
        // get css code from css textarea
        const code = $(codetext).val();
        // get metadata block from css code
        const meta = code.match(/\/\* ==UserStyle==[\s\S]*==\/UserStyle== \*\//)[0];
        if (parsetargets.variables) {
            // get preprocessor type from metadata
            const preprocessor = meta.match(/@preprocessor *(.*)(?![\s\S]*@preprocessor)/)[1];
            if (preprocessor == 'uso') {
                // get array of variables from metadata
                const variables = getVariables(meta);
                // console.log('parseCode:', preprocessor, variables);
                variables.forEach((variable) => {
                    parseVariable(variable);
                });
                // for (let index in variables) {
                //     parseVariable(variables[index]);
                // }
            }
        }
    }
}

function parseVariable(variable) {
    const varprops = variable.match(/@var[\s]+([^\s]+)[\s]+([^\s]+)[\s]+([^\s'"`]*|'.*'|".*"|`.*`)[\s]+([\s\S]+)/);
    // console.log('variable:', props);
    const type = varprops[1];
    const props = {
        key: varprops[2],
        label: trimChars(varprops[3], quotes),
        value: trimChars(varprops[4], quotes)
    };

    switch (type) {
        case 'text':
            fillSetting(newtextbutton, textsetting, props);
            break;
        case 'color':
            fillSetting(newcolorbutton, colorsetting, props);
            break;
        case 'checkbox':
            // not supported in uso
            break;
        case 'select':
            fillSetting(newdropdownbutton, dropdownsetting, props);
            break;
        case 'range':
            // not supported in uso
            break;
        case 'number':
            // not supported in uso
            break;
        default:
            break;
    }
}

function fillSetting(button, path, props) {
    // console.log('fillSetting:', props.value);
    $(button).one({
        click: () => {
            // console.log('click:', props);
            $(form).arrive(path, onceonly, (element) => {
                // console.log('arrive:', props);
                let setting = $(element);
                // console.log('fillSetting:', props.value.substr(0, 1), props.value.startsWith('{'), props);
                if (/^(\[|\{)/.test(props.value)) {
                // if (props.value.startsWith('{')) {
                    // console.log('fillSetting:', props.value.substr(0, 1), props.value.startsWith('{'), props);
                    setting = $(element).children('.edit-setting');
                    fillOptions($(element).find(newoptionbutton), $(element).children('.edit-style-options'), props.value);
                }
                else {
                    $(setting).children(settingvalue).val(props.value);
                }
                $(setting).children(settingkey).val(props.key);
                $(setting).children(settinglabel).val(props.label);
            });
        }
    }).click();
}

function fillOptions(button, path, options) {
    let isArray;
    switch (true) {
        case options.startsWith('['):
            options = trimChars(options, '\\[\\]\\s');
            isArray = true;
            break;
        case options.startsWith('{'):
            options = trimChars(options, '\\{\\}\\s');
            isArray = false;
            break;
        default:
            break;
    }
    const opts = options.split(/,[\s\n]*/);
    console.log('fillOptions:', options, opts);
    opts.forEach((opt, index) => {
        const props = {};
        if (isArray) {
            props.key = trimChars(opt, quotes);
            props.value = trimChars(props.key, '\\*');
        }
        else {
            // split option to key and value
            const keyvalue = opt.match(/(['"`])(.*)\1:[\s\n]*(['"`])([\s\S]*)\3/m);
            props.key = trimChars(keyvalue[2], quotes + '\\n');
            // console.log('fillOptions (split):', keyvalue, props.key);
            // props.key = props.key.match(/(\s)*([^\s][\S\s]*)/);
            props.value = trimChars(keyvalue.length > 1 ? keyvalue[4] : props.key, quotes + '\\n\\*');
            props.value = shiftTabs(props.value);
        }
        props.default = props.key.endsWith('*');    // check if this option is default
        props.key = trimChars(props.key, '\\*');
        // split key to key and label
        const keylabel = props.key.split(':', 2);
        props.key = keylabel[0];
        props.label = keylabel[keylabel.length > 1 ? 1 : 0];
        // console.log('fillOptions (forEach):', opt, props);

        const elementpath = `li:nth-of-type(${index + 1})`;
        if (index < 2) {
            const element = $(path).children(elementpath);
            fillOption(element, props);
        }
        else {
            // console.log('fillOptions (2+):', props);
            $(button).one({
                click: () => {
                    // console.log('click:', props);
                    $(path).arrive(elementpath, onceonly, (element) => {
                        // console.log('arrive:', props);
                        fillOption(element, props);
                        // $(path).unbindArrive(elementpath);
                    });
                }
            }).click();
        }
    });
}

function fillOption(element, props) {
    const option = $(element).children('.edit-option');
    // console.log('fillOption:', option, props);
    $(option).children(optionkey).val(props.key);
    $(option).children(optionlabel).val(props.label);
    $(option).children(optiondefault).prop('checked', props.default);
    $(element).children(optionvalue).val(props.value);
    fixframeHeight();
}

function getVariables(meta) {
    let variables = [];
    let result;
    const pattern = /(@var *[\s\S]*?)(?:\n\s*@|==\/UserStyle== \*\/)/g;
    while ((result = pattern.exec(meta)) !== null) {
        // console.log('while:', result);
        variables.push(result[1]);
        pattern.lastIndex--;
    }
    return variables;
}

function trimChars(string, chars) {
    const pattern = RegExp(`^[${chars}]*(.*?)[${chars}]*$`, 'm');
    string = string.replace(pattern, '$1');
    // console.log('trimChars:', pattern, string);
    return string;
}

function shiftTabs(string) {
    const tabs = string.match(/^(\s)*/)[1];
    const pattern = RegExp(`(\n)${tabs}`, 'g');
    string = string.replace(pattern, '$1');
    return string; //.trimLeft();
}

(function() {
    'use strict';

    $(document).ready(() => {
        if (!(window.self === window.top)) {
            const frameWidth = GM_config.get('frameWidth');
            if (frameWidth != '0') {
                fixframeWidth(frameWidth);
            }
            if (GM_config.get('fixframeHeight')) {
                clicklistener(newsettingbutton);
                clicklistener(newoptionbutton);
                resizelistener(textarea);
                addinglistener(img);
            }
            if (GM_config.get('fixtextareaWidth')) {
                fixWidth(textarea);
            }
            if (GM_config.get('parsecode')) {
                addparseButton();
            }
        }
    });
})();