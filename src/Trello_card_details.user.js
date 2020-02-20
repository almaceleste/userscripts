// ==UserScript==
// @name            Trello card details
// @namespace       almaceleste
// @version         0.1.0
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

    function get(url, callback) {
        var xhr = new XMLHttpRequest();
        xhr.open('GET', url, true);
        xhr.onreadystatechange = function() {
            if (xhr.readyState === 4) {
                callback(xhr.responseText);
            }
        };
        xhr.send(null);
    }

    $(cardwindow).arrive(cardheader, function(){
        const jsonUrl = window.location.href + '.json';
        get(jsonUrl, function(json) {
            const card = JSON.parse(json);
            card.actions.forEach(action => {
                if (action.type == 'createCard'){
                    if ($('#card-creator').length == 0){
                        var details = $('<div></div>').attr('id', 'card-creator').attr('style', 'float: right');
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
                        $(cardwindow + ' ' + cardheader).append(details);
                    }
                }
            });
        });
    });

})();
