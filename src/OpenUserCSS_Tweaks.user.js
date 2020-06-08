// ==UserScript==
// @name            OpenUserCSS Tweaks
// @namespace       almaceleste
// @version         0.2.2
// @description     some useful tweaks, that make working with the OpenUserCSS.org more convenient
// @description:ru  некоторые полезные настройки, которые делают работу с OpenUserCSS.org более удобной
// @author          (ɔ) almaceleste  (https://almaceleste.github.io)
// @license         AGPL-3.0-or-later; http://www.gnu.org/licenses/agpl
// @icon            https://openusercss.org/img/openusercss.icon-x16.png
// @icon64          https://openusercss.org/img/openusercss.icon-x640.png

// @homepageURL     https://greasyfork.org/en/users/174037-almaceleste
// @homepageURL     https://openuserjs.org/users/almaceleste
// @homepageURL     https://github.com/almaceleste/userscripts
// @supportURL      https://github.com/almaceleste/userscripts/issues
// @updateURL       https://github.com/almaceleste/userscripts/raw/master/src/OpenUserCSS_Tweaks.user.js
// @downloadURL     https://github.com/almaceleste/userscripts/raw/master/dist/OpenUserCSS_Tweaks.user.js
// @downloadURL     https://openuserjs.org/install/almaceleste/OpenUserCSS_Tweaks.user.js

// @require         https://code.jquery.com/jquery-3.3.1.js
// @require         https://raw.githubusercontent.com/uzairfarooq/arrive/master/minified/arrive.min.js
// @require         https://openuserjs.org/src/libs/sizzle/GM_config.js
// @grant           GM_getValue
// @grant           GM_setValue
// @grant           GM_registerMenuCommand
// @grant           GM_openInTab
// @grant           GM_getResourceText

// @resource        css https://github.com/almaceleste/userscripts/raw/master/css/default.css

// @match           http*://openusercss.org/*
// ==/UserScript==

// ==OpenUserJS==
// @author almaceleste
// ==/OpenUserJS==

const state = {};

// create objects for the site pages
const profile = {};
const theme = {};
const site = {};
const search = {};
const edit = {};
// create regex patterns for the site pages
profile.path = /^\/profile/;
theme.path = /^\/theme\/(?!edit)/;
site.path = /^\/$/;
search.path = /^\/search/;
edit.path = /^\/theme\/edit/;
// create paths for the elements
site.layout = '#__layout > .ouc-ancestor';
site.navbar = `${site.layout} > .ouc-navbar-wrapper > .ouc-navbar`;
site.routeroot = `${site.layout} > .ouc-app-root > .ouc-route-root`;
site.section = `${site.routeroot} .container .section`;
site.level = `${site.section} > .level`;
site.levelright = `${site.level} > .level-right`;
site.main = `${site.section} > .columns`;
site.columnleft = `${site.main} > .column:nth-of-type(1)`;
site.columnright = `${site.main} > .column:nth-of-type(2)`;
profile.account = `${site.navbar} > .container > .navbar-menu > .navbar-end > a:first-of-type`;
profile.statsbutton = '#showStatsToggle';
profile.donatebutton = `${site.columnright} > .ouc-user-donation-wrapper a`;
profile.theme = `${site.columnright} > .columns > .column`;
profile.image = `${profile.theme} .card .card-image .ouc-responsive-image-wrapper > .ouc-responsive-image`;
site.image = profile.image;
search.image = profile.image;
search.theme = profile.theme;
search.author = `${site.columnleft} > .columns > .column`;
theme.card = `${site.columnleft} .box`;
theme.image = `${theme.card} .ouc-responsive-image-wrapper .ouc-responsive-image`;
theme.installbutton = `${site.levelright} > .tile:nth-of-type(1) > .tile:nth-of-type(3) a`;
edit.savebutton = `${site.levelright} > button[type='submit']`;
edit.form = `${site.section} > .ouc-new-theme-form`;
edit.theme = `${edit.form} > .card:nth-of-type(1)`;
edit.variables = `${edit.form} > .card:nth-of-type(2) > .card-content`;
edit.variable = `${edit.variables} > div.field.box`;
edit.editor = `${edit.form} > .card:nth-of-type(5) .ouc-editor-wrapper > .ouc-editor`;
edit.scrollbar = `${edit.editor} > .ace_scrollbar`;
edit.code = `${edit.editor} > .ace_scroller > .ace_content > .ace_text-layer`;
edit.codeline = `${edit.code} > .ace_line > span`;
edit.metadatastart = `${edit.codeline}:contains('/* ==UserStyle==')`;
edit.metadataend = `${edit.codeline}:contains('==/UserStyle== */')`;
edit.header = `${edit.theme} > .card-header`;
edit.content = `${edit.theme} > .card-content`;
edit.screenshots = `${edit.content} > .field:nth-of-type(4)`;
edit.image = `${edit.screenshots} > .columns > .column:nth-of-type(2) .ouc-responsive-image-wrapper > .ouc-responsive-image`;
const card = '.card';
const cardheader = '.card-header';
const box = '.box';
const boxheader = '.level';
const data = `[itemtype=SoftwareApplication]`;
// options for arrivejs
const options = {
    existing: true
};

// config settings
const configId = 'ouctCfg';
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
    height: 485px;
    width: 435px;
    border: 1px solid;
    border-radius: 3px;
    position: fixed;
    z-index: 9999;
`;

GM_registerMenuCommand(`${GM_info.script.name} Settings`, () => {
	GM_config.open();
    GM_config.frame.style = iframecss;
});

GM_config.init({
    id: `${configId}`,
    title: `${GM_info.script.name} ${GM_info.script.version}`,
    fields: {
        version: {
            section: ['', 'Any Profile Settings'],
            label: 'display version',
            labelPos: 'right',
            title: 'display the version information for the themes',
            type: 'checkbox',
            default: true,
        },
        compact: {
            label: 'compact view',
            labelPos: 'right',
            title: '',
            type: 'checkbox',
            default: true,
        },
        highlight: {
            label: 'highlight theme on hover',
            labelPos: 'right',
            title: '',
            type: 'checkbox',
            default: true,
        },
        color: {
            label: 'highlight color',
            labelPos: 'left',
            type: 'select',
            options: [
                'black',
                'blue',
                'green',
                'aqua',
                'red',
                'purple',
                'yellow',
                'white',
                'gray',
                'lightskyblue',
                'lightgreen',
                'orangered',
                'pink',
                'gold',
                'whitesmoke',
                'lightgray',
                'dimgray',
                'deepskyblue',
                'dodgerblue',
            ],
            default: 'dodgerblue',
        },
        stats: {
            section: ['', 'Own Profile Settings'],
            label: 'display statistics',
            labelPos: 'right',
            title: 'display the statistics information for the themes',
            type: 'checkbox',
            default: true,
        },
        screenshot: {
            label: 'display screenshot',
            labelPos: 'right',
            title: 'display the screenshots for the themes',
            type: 'checkbox',
            default: true,
        },
        editbutton: {
            label: 'edit button',
            labelPos: 'right',
            title: 'add the edit buttons to edit theme directly from the profile page',
            type: 'checkbox',
            default: true,
        },
        deletevariables: {
            section: ['', 'Edit Page Settings'],
            label: 'do not create variables (experimental)',
            labelPos: 'right',
            title: '',
            type: 'checkbox',
            default: false,
        },
        // deletemetadata: {
        //     label: 'automatically delete metadata (experimental)',
        //     labelPos: 'right',
        //     title: '',
        //     type: 'checkbox',
        //     default: false,
        // },
        editsticky: {
            label: 'sticky header',
            labelPos: 'right',
            title: '',
            type: 'checkbox',
            default: true,
        },
        // fixinstall: {
        //     section: ['', 'Theme Page Settings'],
        //     label: 'fix Install as usercss (experimental)',
        //     labelPos: 'right',
        //     title: '',
        //     type: 'checkbox',
        //     default: false,
        // },
        fiximages: {
            section: ['', 'Miscellaneous Settings'],
            label: 'fix image size',
            labelPos: 'right',
            title: 'some images do not fit in the image container, and the site crops them. this option restores these images and resizes the container for more accurate placement. \nanother advantage: these images support image zoom extensions',
            type: 'checkbox',
            default: true,
        },
        searchhome: {
            label: 'start from the search page',
            labelPos: 'right',
            title: 'if you do not like the openusercss.org start page or if you have problems with a server error on it you can change it to a search page',
            type: 'checkbox',
            default: true,
        },
        support: {
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
    css: windowcss,
    events: {
        save: function() {
            GM_config.close();
        }
    },
});

// script code
function getData(obj, data){
    return $(obj).children(`[itemprop=${data}]`).attr('value');
}

function doHighlight(theme){
    const color = GM_config.get('color');

    $(theme).hover(
        () => {
            $(theme).css({
                boxShadow: `0 0 5px 1px ${color}`,
            });
        },
        () => {
            $(theme).css({
                boxShadow: 'none',
            });
        }
    );
}

function isOwnProfile(pathname){
    if ($(profile.account).attr('href') == pathname) {
        return true;
    }
    else {
        return false;
    }
}

function doProfile(){
    if (GM_config.get('compact')) {
        $(profile.donatebutton).insertAfter($(site.level).children().first());
        $(site.columnright).css({
            paddingTop: '0',
        });
    }
    $(document).arrive(profile.theme, options, (t) => {
        const cl = t.classList;
        const d = $(t).children(data);
        const c = $(t).children(`${card}, ${box}`);
        const h = $(c).children().first().children().first();

        const height = $(t).height();
        const width = $(t).width();

        let w = $('<div/>', {
            class: cl,
        }).css({
            margin: '5px',
            padding: '0',
            position: 'relative',
            width: `${width}px`,
        });
        $(t).wrap(w);
        $(t).removeAttr('class');
        $(c).css({
            margin: '0',
            position: 'relative',
        });

        if (GM_config.get('version')) {
            $(`<span>${getData(d, 'version')}</span>`).insertAfter(h);
        }
        if (GM_config.get('compact')) {
            $(c).css({
                padding: '.7rem',
            }).children('.level:nth-child(2)').css({
                display: 'inline-block',
                marginBottom: '0',
            });
        }
        if (GM_config.get('highlight')) {
            doHighlight($(t).parent());
        }
        if (isOwnProfile(state.pathname)){
        if (GM_config.get('screenshot')) {
                const img = $('<img/>', {
                    src: `https://imageproxy.openusercss.org/${getData(d, 'screenshot')}`,
                    on: {
                        load: (e) => {
                            let height = $(e.target).height();
                            if (height > width){
                                height = width;
                            }
                            $(e.target).parent().css({
                                height: `${height}px`,
                            });
                        }
                    }
                });
                $('<div/>', {
                    class: 'image-wrapper',
                }).append(img).appendTo(t)
                .css({
                    display: 'inline-block',
                    height: `100%`,
                    right: `0px`,
                    position: 'absolute',
                    top: `0px`,
                    width: `${width/3}px`,
                });
                $(c).css({
                    display: 'inline-block',
                    width: `${width*2/3}px`,
                })
            }
            if (GM_config.get('editbutton')) {
                let width = $(c).width();
                let u = getData(d, 'url');
                u = u.replace(/^(\/theme)\/(.*)$/, '$1/edit/$2');
                const padding = 10;
                const size = 35;
                const a = $('<a/>',{
                    href: u,
                    text: '🖉',
                });
                a.insertAfter(t).css({
                    bottom: `${padding}px`,
                    height: `${size}px`,
                    left: `${width - size}px`,
                    padding: `${padding}px`,
                    position: 'absolute',
                    width: `${size}px`,
                });
                if (GM_config.get('highlight')){
                    const color = GM_config.get('color');

                    a.hover(
                        () => {
                            a.css({
                                textShadow: `0 0 5px ${color}`,
                                filter: `drop-shadow(0 0 5px ${color})`,
                            });
                        },
                        () => {
                            a.css({
                                textShadow: 'none',
                                filter: 'none',
                            });
                        }
                    );
                }
            }

            $(c).children('.level').first().children().first().css({
                width: '57%',
            });
            $(c).children('.level').first().children().last().css({
                width: '27%',
            });
        }

        $(document).unbindArrive(profile.theme);
    });
}

function doEdit(){
    if (GM_config.get('deletevariables')){
        $(document).arrive(edit.variable, options, (v) => {
            $(v).remove();
        });
    }
    // if (GM_config.get('deletemetadata')){
    //     $(edit.savebutton).on({
    //         click: (e) => {
    //             e.preventDefault();
    //             $(edit.scrollbar).scrollTop(0);
    //             $(edit.metadatastart).nextUntil(edit.metadataend).remove();

    //         },
    //         submit: (e) => {
    //             e.preventDefault();
    //             $(edit.scrollbar).scrollTop(0);
    //             $(edit.metadatastart).nextUntil(edit.metadataend).remove();

    //         }
    //     });
    //     $(edit.code).arrive(edit.variable, options, (v) => {
    //     });
    // }
    if (GM_config.get('editsticky')){
        const top = $(site.navbar).height();
        $(edit.header).css({
            position: 'sticky',
            top: `${top}px`,
            zIndex: '100',
        });
    }
}

// function fixinstall(){
//     // console.log('fixinstall:', theme.installbutton);
//     $(theme.installbutton).on({
//         click: (e) => {
//             e.preventDefault();
//             const url = $(e.target).attr('href');
//             const name = url.split('/').pop().split('#').shift().split('?').shift();
//             fetch(url).then((response) => {
//                 response.text().then((usercss) => {
//                     const pattern = /\/\* ==UserStyle==[\s\S]*==\/UserStyle== \*\/[\s\S]*(\/\* ==UserStyle==[\s\S]*)/;
//                     if (pattern.test(usercss)) {
//                         usercss = usercss.replace(pattern, '$1');
//                     }

//                     // const install = window.open(`chrome-extension://apmmpaebfobifelkijhaljbmpcgbjbdo/install-usercss.html?${encodeURIComponent(usercss)}`, '_self');
//                     // const install = window.open(`data:text/css;charset=utf-8,${encodeURIComponent(usercss)}`, '_blank');
//                     // install.document.write(usercss);
//                     // var install = window.open(url, '_self');
//                     // install.document.onload = function() {
//                     //     install.document.write('¡hola, mundo!');
//                     //     console.log('¡hola, mundo!');
//                     //     $('body > pre').text(usercss);
//                     // }

//                     // test
//                     // var newWin = window.open(url, 'example', 'width=600,height=400');
//                     // newWin.onload = function() {
//                     //     // создать div в документе нового окна
//                     //     var div = newWin.document.createElement('div'),
//                     //     body = newWin.document.body;
//                     //     div.innerHTML = 'Добро пожаловать!'
//                     //     div.style.fontSize = '30px'
//                     //     // вставить первым элементом в body нового окна
//                     //     body.insertBefore(div, body.firstChild);
//                     // }

//                     // install.onload = function() {
//                         // install.document.write(usercss);
//                         // install.focus();
//                     // }
//                     // console.log('fixinstall:', install);

//                     // var newWin = window.open("about:blank", "hello", "width=200,height=200");
//                     // newWin.document.write("Привет, мир!");

//                     // const a = $('<a/>', {
//                     //     href: `data:text/css;charset=utf-8,${encodeURIComponent(usercss)}`,
//                     //     download: name,
//                     //     // style: 'display:none',
//                     //     target: '_blank',
//                     //     text: 'click me',
//                     //     type: 'text/css;charset=utf-8',
//                     // });
//                     // a.appendTo(site.level).click();

//                     // GM_openInTab(`data:text/js;charset=utf-8,${encodeURIComponent(usercss)}`, {
//                     //     active: true,
//                     //     insert: true,
//                     //     setParent: true
//                     // });
//                 });
//             });
//             // const install = window.open(`${url}`, '_self');
//             // install.onload = function(){
//             //     console.log('fixinstall:', install);
//             //     $('body > pre').text(usercss);
//             // }
//         },
//         load: () => {}
//     });

// }

function fiximages(path){
    if (GM_config.get('fiximages')) {
        $(document).arrive(path, options, (image) => {
            if ($(image).next('img').length == 0){
                let url = $(image).css('background-image');
                url = url.replace('url("', '').replace('")', '');
                if (url.startsWith('https://imageproxy.openusercss.org/50x')){
                    url = url.replace('https://imageproxy.openusercss.org/50x', 'https://imageproxy.openusercss.org/540x');
                }
                if (url != ''){
                    const img = $('<img/>', {
                        src: url,
                        on: {
                            load: (e) => {
                                const width = $(e.target).width();
                                let height = $(e.target).height();

                                if (height == 0 || height > width) {
                                    height = width;
                                }
                                $(image).css({
                                    display: 'none',
                                    backgroundImage: 'none',
                                }).parent().addClass('image-wrapper').css({
                                    height: `${height}px`,
                                    overflow: 'hidden',
                                }).parent().parent().css({
                                    height: `${height}px`,
                                }).next('.card-content').css({
                                    paddingBottom: '0',
                                    paddingTop: '0',
                                });
                            },
                        }
                    });
                    img.insertAfter(image);
                }
            }

            $(document).unbindArrive(path);
        });
    }
}

function doThings(){
    if (!state.changed) {
        const pathname = window.location.pathname;

        switch (true) {
            case profile.path.test(pathname):
                console.log('doThings:', profile.path, pathname);
                if (isOwnProfile(state.pathname)) {
                    if (GM_config.get('stats')) {
                        $(document).arrive(profile.statsbutton, options, () => {
                            $(profile.statsbutton).click();
                            $(document).unbindArrive(profile.statsbutton);
                        });
                    }
                }
                else {
                    fiximages(profile.image);
                }

                doProfile();
                break;
            case theme.path.test(pathname):
                console.log('doThings:', theme.path, pathname);
                fiximages(theme.image);
                // fixinstall();
                break;
            case site.path.test(pathname):
                console.log('doThings:', site.path, pathname);
                fiximages(site.image);
                break;
            case search.path.test(pathname):
                console.log('doThings:', search.path, pathname);
                fiximages(search.image);
                $(document).arrive(search.theme, options, (t) => {
                    doHighlight($(t));
                    $(document).unbindArrive(search.theme);
                });
                $(document).arrive(search.author, options, (a) => {
                    doHighlight($(a));
                    $(document).unbindArrive(search.author);
                });
                break;
            case edit.path.test(pathname):
                console.log('doThings:', edit.path, pathname);
                doEdit();
                fiximages(edit.image);
                break;
            default:
                console.log('doThings:', 'default', pathname);
                break;
        }

        state.changed = true;
    }
}

(function() {
    'use strict';

    $(document).ready(() => {
        state.pathname = window.location.pathname;
        state.changed = false;

        doThings();

        if (state.pathname == '/') {
            if (GM_config.get('searchhome')) {
                window.location.replace(`${window.location.origin}/search`);
            }
        }

        $(window).on({
            transitionend: (e) => {
                const pathname = window.location.pathname;
                switch (true){
                    case e.target.classList.contains('ouc-route-root'):
                        if (state.pathname != pathname) {
                            state.pathname = pathname;
                            state.changed = false;
                            doThings();
                        }
                        break;
                    case e.target.classList.contains('ouc-responsive-image-wrapper'):
                        if (search.path.test(pathname)) {
                            state.pathname = pathname;
                            state.changed = false;
                            doThings();
                        }
                        break;
                    default:
                        break;
                }
            }
        });
    });
})();
