// ==UserScript==
// @name            Youtube Player Always On Top
// @namespace       almaceleste
// @version         0.4.1
// @description     this code makes the youtube player visible while scrolling
// @description:ru  этот код делает плеер youtube видимым при прокрутке
// @author          (ɔ) Paola Captanovska
// @license         AGPL-3.0-or-later; http://www.gnu.org/licenses/agpl.txt
// @icon            https://s.ytimg.com/yts/img/favicon-vfl8qSV2F.ico
// @icon64          https://s.ytimg.com/yts/img/favicon_96-vflW9Ec0w.png

// @homepageURL     https://greasyfork.org/en/users/174037-almaceleste
// @homepageURL     https://openuserjs.org/users/almaceleste
// @homepageURL     https://github.com/almaceleste/userscripts
// @supportURL      https://github.com/almaceleste/userscripts/issues
// @updateURL       https://github.com/almaceleste/userscripts/raw/master/src/Youtube_Player_Always_On_Top.user.js
// @downloadURL     https://github.com/almaceleste/userscripts/raw/master/src/Youtube_Player_Always_On_Top.user.js
// @downloadURL     https://openuserjs.org/install/almaceleste/Youtube_Player_Always_On_Top.user.js

// @require         https://code.jquery.com/jquery-3.3.1.js
// @require         https://raw.githubusercontent.com/uzairfarooq/arrive/master/minified/arrive.min.js
// @require         https://openuserjs.org/src/libs/sizzle/GM_config.js
// @grant           GM_getValue
// @grant           GM_setValue
// @grant           GM_registerMenuCommand
// @grant           GM_openInTab

// @match           https://www.youtube.com/*
// @match           https://www.youtube.com/watch*
// ==/UserScript==

// ==OpenUserJS==
// @author almaceleste
// ==/OpenUserJS==

var player = {};
var video = {};
var info = {};
var header = {};
var progressbar = {};
var options = {
    existing: true
};
const chat = '#chat';
const leftside = '#content #columns > #primary > #primary-inner';
const rightside = '#secondary-inner';
header.id = '#masthead-container';
player.id = `${leftside} > #player`;
player.buttons = `${player.id} .ytp-chrome-top-buttons`;
player.cardsbutton = `${player.buttons} > .ytp-cards-button`;
player.outer = `${player.id} > #player-container-outer`;
player.inner = `${player.outer} > #player-container-inner`;
player.container = `${player.inner} > #player-container`;
player.controls = `${player.container} .ytp-chrome-bottom`;
player.minimizebutton = `${player.container} #ytp-minimize-button`;
progressbar.id = `${player.controls} > .ytp-progress-bar-container`;
progressbar.progressbar = `${progressbar.id} > .ytp-progress-bar`;
progressbar.hovercontainer = `${progressbar.progressbar} .ytp-chapter-hover-container`;
progressbar.padding = `${progressbar.hovercontainer} .ytp-progress-bar-padding`;
progressbar.progresslist = `${progressbar.hovercontainer} .ytp-progress-list`;
progressbar.progressplay = `${progressbar.progresslist} .ytp-play-progress`;
progressbar.progresshover = `${progressbar.progresslist} .ytp-hover-progress`;
progressbar.scrubber = `${progressbar.id} .ytp-scrubber-container`;
progressbar.scrubberbutton = `${progressbar.scrubber} > .ytp-scrubber-button`;
player.tooltip = `${player.container} .ytp-tooltip.ytp-bottom.ytp-preview`;
player.tooltippreview = `${player.tooltip} > .ytp-tooltip-bg`;
player.tooltiptext = `${player.tooltip} > .ytp-tooltip-text-wrapper`;
player.ctxmenu = '.ytp-popup.ytp-contextmenu';
player.optmenu = 'iron-dropdown.style-scope.ytd-popup-container';
video.id = `${player.id} #ytd-player > #container video`;
video.content = `${player.container} .ytp-iv-video-content`;
video.inProcess = false;
video.minimized = false;
info.id = `${leftside} > #info`;
info.container = `${info.id} > #info-contents #container`;

const windowcss = `
    #ytpaotCfg {
        background-color: lightblue;
    }
    #ytpaotCfg .reset_holder {
        float: left;
        position: relative;
        bottom: -1em;
    }
    #ytpaotCfg .saveclose_buttons {
        margin: .7em;
    }
    #ytpaotCfg_field_url {
        background: none !important;
        border: none;
        cursor: pointer;      
        padding: 0 !important;
        text-decoration: underline;
    }
    #ytpaotCfg_field_url:hover,
    #ytpaotCfg_resetLink:hover {
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

GM_registerMenuCommand('Youtube Player Always On Top Settings', opencfg);

function opencfg(){
	GM_config.open();
	ytpaotCfg.style = iframecss;
}

GM_config.init({
    id: 'ytpaotCfg',
    title: 'Youtube Player Always On Top',
    fields:
    {
        infoOnTop:
        {
            section: ['', 'Settings'],
            label: 'info panel always visible (require reload)',
            labelPos: 'right',
            type: 'checkbox',
            default: true,
        },
        padding:
        {
            label: 'box border (padding) size in px (require reload)',
            labelPos: 'left',
            type: 'select',
            options: ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10'],
            default: '5',
        },
        minimum:
        {
            label: 'minimized size (in % of maximized size)',
            labelPos: 'left',
            type: 'select',
            options: ['35', '40', '45', '50', '55', '60', '65', '70', '75', '80', '85', '90'],
            default: '55',
        },
        background:
        {
            label: 'box background (apply on size change)',
            labelPos: 'left',
            type: 'select',
            options: [
                'body',
                'white',
                'whitesmoke',
                'lightgray',
                'gray',
                'dimgray',
                'lightblue',
                'deepskyblue',
                'magenta',
                'lime',
                'green',
                'cyan'],
            default: 'dimgray',
        },
        url:
        {
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
    events:
    {
        save: function() {
            GM_config.close();
        }
    },
});

function getStyle(id, prop){
    let style = $(id).attr('style');
    if (style) {
        let start = style.lastIndexOf(`${prop}:`);
        prop = style.substring(start, style.indexOf(';', start));
        prop = prop.substring(prop.lastIndexOf(':') + 1, prop.lastIndexOf('px')).trim();
    }
    return +prop;
}

function setProgress(){
    let bar = $(progressbar.progressbar);
    let progress = bar.attr('aria-valuenow')/bar.attr('aria-valuemax');

    $(progressbar.progresshover).css({
        'left': `${progressbar.width*progress}px`,
    });

    let left = $(progressbar.scrubberbutton).width()/2;
    let scrubber = $(progressbar.scrubber).css('transform');
    if (scrubber) {
        scrubber = scrubber.substring(scrubber.lastIndexOf('(') + 1, scrubber.lastIndexOf(')'))
        scrubber = scrubber.split(',')[4];

        left = player.width*progress - left - scrubber;

        $(progressbar.scrubber).css({
            'left': `${left}px`
        });
    }

    let top = getStyle(player.tooltip, 'top');
    // let height = getStyle(player.tooltippreview, 'height');
    top = player.height - $(player.controls).height() - $(progressbar.padding).height() - $(player.tooltip).height() - $(player.tooltiptext).height() - top;
    $(player.tooltip).css({
        transform: `translateY(${top}px)`,
        willChange: 'transform'
    });
}

function doThings(){
    header.height = $(header.id).height();
    player.top = header.height;
    player.background = GM_config.get('background');
    if (player.background == 'body') {
        player.background = $('body').css('background-color');
    }
    player.padding = +GM_config.get('padding');
    console.log('doThings:', player.width, player.height);
    $(player.id).css({
        backgroundColor: player.background,
        padding: `${player.padding}px`,
        position: 'fixed',
        top: `${player.top}px`,
        willChange: 'transform',
        zIndex: '2000' // '2200'
    });
    $(video.id).css({
        willChange: 'transform'
    });
    $(player.outer).css({
        // willChange: 'transform'
    });
    $(player.inner).css({
        // willChange: 'transform'
    });
    $(player.container).css({
        // willChange: 'transform'
    });
    $(player.controls).css({
        transform: 'scaleX(.982)',
        // willChange: 'transform'
    });
    $(progressbar.progresshover).css({
        willChange: 'transform'
    });
    $(progressbar.scrubber).css({
        willChange: 'transform'
    });
    $(video.content).css({
        willChange: 'transform'
    });
    if (GM_config.get('infoOnTop')){
        info.background = player.background;
        info.padding = player.padding;
        info.height = $(info.id).height();
        $(info.id).css({
            backgroundColor: info.background,
            padding: `0 ${info.padding}px`,
            position: 'fixed',
            willChange: 'transform',
            zIndex: '1001'
        })
    }
    $(leftside).css({
    });
}

function minimize(){
    video.inProcess = true;
    let percent = GM_config.get('minimum');
    header.height = $(header.id).height();
    player.height = video.height*percent/100;
    player.width = video.width*percent/100;
    player.top = header.height;
    console.log('minimize:', player.width, player.height);
    let margin = player.height;
    $(player.id).css({
        height: `${player.height}px`,
        width: `${player.width}px`,
    });
    $(video.id).css({
        height: `${player.height}px`,
        width: `${player.width}px`,
    });
    $(player.outer).css({
        height: `${player.height}px`,
        width: `${player.width}px`,
    });
    $(player.inner).css({
        paddingTop: `${player.height}px`,
        width: `${player.width}px`,
    });
    $(player.container).css({
        height: `${player.height}px`,
        width: `${player.width}px`,
    });
    $(player.controls).css({
        left: '0',
        width: `${player.width}`,
    });
    $(player.minimizebutton).attr('title', 'Maximize');
    $(player.minimizebutton).css({
        transform: 'scale(0.7)'
    });
    progressbar.width = player.width;
    $(progressbar.id).css({
        width: `${progressbar.width}px`,
    });
    $(progressbar.hovercontainer).css({
        width: `${progressbar.width}px`,
    });
    $(progressbar.padding).css({
        width: `${progressbar.width}px`,
    });
    $(progressbar.progresslist).css({
        width: `${progressbar.width}px`,
    });
    $(video.content).css({
        height: `${player.height}px`,
        width: `${player.width}px`,
    });
    if (GM_config.get('infoOnTop')){
        info.width = player.width;
        info.height = $(info.id).height();
        info.top = player.height + player.top;
        $(info.id).css({
            top: `${info.top}px`,
            width: `${info.width}px`,
        })
        margin += info.height;
    }
    $(leftside).css({
        marginTop: `${margin}px`
    });
    video.inProcess = false;
    player.minimized = true;
}

function maximize(){
    video.inProcess = true;
    header.height = $(header.id).height();
    player.height = video.height;
    player.width = video.width;
    player.top = header.height;
    console.log('maximize:', player.width, player.height);
    let margin = player.height;
    $(player.id).css({
        height: `${player.height}px`,
        width: `${player.width}px`,
    });
    $(video.id).css({
        height: `${player.height}px`,
        width: `${player.width}px`,
    });
    $(player.outer).css({
        height: `${player.height}px`,
        width: `${player.width}px`,
    });
    $(player.inner).css({
        paddingTop: `${player.height}px`,
        width: `${player.width}px`,
    });
    $(player.container).css({
        height: `${player.height}px`,
        width: `${player.width}px`,
    });
    $(player.controls).css({
        left: '0',
        width: `${player.width}`,
    });
    $(player.minimizebutton).attr('title', 'Minimize');
    $(player.minimizebutton).css({
        transform: 'scale(1)'
    });
    progressbar.width = player.width;
    $(progressbar.id).css({
        width: `${progressbar.width}px`,
    });
    $(progressbar.hovercontainer).css({
        width: `${progressbar.width}px`,
    });
    $(progressbar.padding).css({
        width: `${progressbar.width}px`,
    });
    $(progressbar.progresslist).css({
        width: `${progressbar.width}px`,
    });
    $(video.content).css({
        height: `${player.height}px`,
        width: `${player.width}px`,
    });
    if (GM_config.get('infoOnTop')){
        info.width = player.width;
        info.height = $(info.id).height();
        info.top = player.height + player.top;
        $(info.id).css({
            top: `${info.top}px`,
            width: `${info.width}px`,
        })
        margin += info.height;
    }
    $(leftside).css({
        marginTop: `${margin}px`
    });
    video.inProcess = false;
    player.minimized = false;
}

function animate(id, start, end){
    $({x: start}).animate({x: end}, {
        duration: 250,
        step: (x) => {
            $(id).css({
                transform: `scale(${x})`
            });
        }
    });
}

function waitForVideo(){
    $(document).arrive(video.id, options, () => {
        video.exists = true;
        video.height = $(video.id).height();
        video.width = $(video.id).width();
        if (player.minimized){
            minimize();
        }
        else {
            maximize();
        }
    });
}

(function() {
    'use strict';
    // onload
    $(document).arrive(player.id, options, () => {
        doThings();

        let padding = $(player.cardsbutton).css('padding-top');
        let size = $(player.cardsbutton).width();
        if (!size) {
            size = 36;
        }
        size = size;

        let svg = `<svg height='100%' version='1.1' viewBox='0 0 ${size} ${size}' width='100%'>
            <rect fill='none' stroke='white' stroke-width='3' stroke-linejoin='round'
                x='${size/8}' y='${size/4}' height='${size/2}' width='${size*6/8}'
            />
        </svg>`;

        // add minimize/maximize button
        $('<div id="ytp-minimize-button" title="Minimize"></div>').insertBefore(player.buttons).css({
            cursor: 'pointer',
            display: 'none',
            height: `${size}px`,
            paddingTop: padding,
            width: `${size}px`,
        }).append(svg).on({
            mouseenter: () => {
                if (player.minimized){
                    animate(player.minimizebutton, 0.7, 1);
                }
                else {
                    animate(player.minimizebutton, 1, 0.7);
                }
            },
            mouseleave: () => {
                if (player.minimized){
                    animate(player.minimizebutton, 1, 0.7);
                }
                else {
                    animate(player.minimizebutton, 0.7, 1);
                }
            },
            click: () => {
            if (player.minimized) {
                maximize();
            }
            else {
                minimize();
            }
        }});
    });

    // $(document).arrive('#scriptTag', options, () => {
    //     let json = JSON.parse(document.getElementById('scriptTag').innerText);
    //     console.log('duration:', json.duration);
    // });

    $(document).arrive(player.controls, options, () => {
        var scrubberInterval;
        $(player.id).on({
            mouseenter: () => {
                scrubberInterval = setInterval(() => {
                    setProgress();
                }, 250);
                $(player.minimizebutton).css({
                    'display': 'block'
                });
            },
            mouseleave: () => {
                clearInterval(scrubberInterval);
                $(player.minimizebutton).css({
                    'display': 'none'
                });
            }
        });
    });

    waitForVideo();

    $(window).on({
        fullscreenchange: () => {
            // console.log('fullscreenchange:', window.fullscreenElement, document.fullscreen);
            if (!document.fullscreenElement){
                waitForVideo();
            }
        },
        resize: () => {
            if (video.exists) {
                let options = {
                    attributes: true,
                    attributeFilter: ['style'],
                    attributeOldValue: true
                }
                let element = document.querySelector(video.id);
                let observer = new MutationObserver((mutations) => {
                    mutations.forEach((m) => {
                        if (!video.inProcess){
                            video.height = $(video.id).height();
                            video.width = $(video.id).width();
                            if (!video.inProcess){
                                doThings();
                    
                                if (video.minimized){
                                    minimize();
                                }
                                else {
                                    maximize();
                                }
                            }
                        }
                        observer.disconnect();
                    })
                });
                observer.observe(element, options);
            }
        },
        scroll: () =>{
            let scrollTop = $(window).scrollTop();
            if (scrollTop > 50) {
                if (!player.minimized){
                    minimize();
                }
            }
            else {
                if (player.minimized) {
                    maximize();
                }
            }
        },
        transitionend: (e) => {
            if (e.target.id = 'progress') {
                if (!video.inProcess){
                    doThings();
        
                    if (video.minimized){
                        minimize();
                    }
                    else {
                        maximize();
                    }
                }
            }
        }
    });
})();
