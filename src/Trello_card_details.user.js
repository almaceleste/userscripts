// ==UserScript==
// @name            Trello card details
// @namespace       almaceleste
// @version         0.3.0
// @description     this code adds the creation date and the creator name and account link to the Trello card
// @description:ru  этот код добавляет дату создания и имя создателя и ссылку на его профиль на карту Trello
// @author          (ɔ) Paola Captanovska
// @license         AGPL-3.0-or-later; http://www.gnu.org/licenses/agpl.txt
// @icon            https://a.trellocdn.com/prgb/dist/images/pinned-tab-icon.225c8d1cf8bbf74add43.svg
// @icon64          https://a.trellocdn.com/prgb/dist/images/pinned-tab-icon.225c8d1cf8bbf74add43.svg

// @homepageURL     https://greasyfork.org/en/users/174037-almaceleste
// @homepageURL     https://openuserjs.org/users/almaceleste
// @homepageURL     https://github.com/almaceleste/userscripts
// @supportURL      https://github.com/almaceleste/userscripts/issues
// @updateURL       https://github.com/almaceleste/userscripts/raw/master/src/Trello_card_details.meta.js
// @downloadURL     https://github.com/almaceleste/userscripts/raw/master/src/Trello_card_details.user.js
// @downloadURL     https://openuserjs.org/install/almaceleste/Trello_card_details.user.js

// @require         https://code.jquery.com/jquery-3.3.1.js
// @require         https://raw.githubusercontent.com/uzairfarooq/arrive/master/minified/arrive.min.js
// @require         https://openuserjs.org/src/libs/sizzle/GM_config.js
// @grant           GM_getValue
// @grant           GM_setValue
// @grant           GM_registerMenuCommand

// @match           https://trello.com/b/*
// @match           https://trello.com/c/*
// ==/UserScript==

// ==OpenUserJS==
// @author almaceleste
// ==/OpenUserJS==

const cardwindow = 'div.window-wrapper';
const cardheader = 'div.window-header';
const attachments = 'div.js-attachment-list';
const attachmentlink = 'a.attachment-thumbnail-preview';
const attachmentdetails = 'p.attachment-thumbnail-details';
const options = { day: 'numeric', month: 'numeric', year: 'numeric', hour: 'numeric', minute: 'numeric' };

const windowcss = '#trellocardDetailsCfg {background-color: lightblue;} #trellocardDetailsCfg .reset_holder {float: left; position: relative; bottom: -1em;} #trellocardDetailsCfg .saveclose_buttons {margin: .7em;}';
const iframecss = 'height: 18.5em; width: 30em; border: 1px solid; border-radius: 3px; position: fixed; z-index: 999;';

GM_registerMenuCommand('Trello card details Settings', opencfg);

function opencfg()
{
	GM_config.open();
	trellocardDetailsCfg.style = iframecss;
}

GM_config.init(
{
    id: 'trellocardDetailsCfg',
    title: 'Trello card details',
    fields:
    {
        creationDate:
        {
            section: ['Card creation details', 'Choose details to show on Trello card'],
            label: 'creation date',
            labelPos: 'right',
            type: 'checkbox',
            default: true,
        },
        locale:
        {
            label: 'creation date locale',
            labelPos: 'left',
            type: 'select',
            options: ['de', 'en', 'es', 'fr', 'ja', 'ru', 'sv'],
            default: 'en',
        },
        creatorName:
        {
            label: 'creator name',
            labelPos: 'right',
            type: 'checkbox',
            default: true,
        },
        creatorAccount:
        {
            label: 'creator account',
            labelPos: 'right',
            type: 'checkbox',
            default: true,
        },
        attachment:
        {
            label: 'add these details to the attachments',
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

function get(url, callback, header) {
    var xhr = new XMLHttpRequest();
    xhr.open('GET', url, true);
    xhr.onreadystatechange = function() {
        if (xhr.readyState === 4) {
            callback(xhr.responseText, header);
        }
    };
    xhr.send(null);
}

function doThings(json, header){
    const card = JSON.parse(json);
    card.actions.forEach(action => {
        if (action.type == 'createCard'){
            if ($('#card-creator').length == 0){
                const details = $('<div></div>').attr('id', 'card-creator').attr('style', 'float: right');
                var content = '<span>created ';
                if (GM_config.get('creationDate')){
                    const date = new Date(action.date);
                    const locale = GM_config.get('locale');
                    const creationDate = date.toLocaleDateString(locale, options);
                    content = content + creationDate + ', ';
                }
                content = content + '</span>';
                if (GM_config.get('creatorName')){
                    content = content + '<span>by ' + action.memberCreator.fullName + ' </span>';
                }
                if (GM_config.get('creatorAccount')){
                    const username = action.memberCreator.username;
                    content = content + '(<a href="/' + username + '">@' + username + '</a>)';
                }
                details.append(content);
                header.append(details);
            }
        }

    });

    function addAttachmentDetails(item){
        const attachment = $(item);
        const href = attachment.attr('href');
        card.actions.forEach(action => {
            if (action.type == 'addAttachmentToCard'){
                if (href == action.data.attachment.url){
                    const details = $('<div></div>').addClass('attachment-creator').attr('style', 'float: right');
                    var content = '<span>by ';
                    if (GM_config.get('creatorName')){
                        content = content + action.memberCreator.fullName + ' </span>';
                    }
                    if (GM_config.get('creatorAccount')){
                        const username = action.memberCreator.username;
                        content = content + '(<a href="/' + username + '">@' + username + '</a>)';
                    }
                    details.append(content);
                    attachment.parent().children(attachmentdetails).append(details);
                }
            }
        })
    }

    if (GM_config.get('attachment')){
        addAttachmentDetails($(attachments).find(attachmentlink));
        $(attachments).arrive(attachmentlink, addAttachmentDetails);
    }
}

function addCardDetails(item){
    const header = $(item);
    const jsonUrl = window.location.href + '.json';

    get(jsonUrl, doThings, header);
    fetch(jsonUrl)
        .then(response => console.log(response.json));
}

(function() {
    'use strict';

    $(cardwindow).arrive(cardheader, addCardDetails);

})();
