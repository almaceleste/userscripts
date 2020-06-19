### about
this is the repo of my userscripts. I use some external libraries ([jQuery](https://jquery.com/), [arrive.js](https://github.com/uzairfarooq/arrive), [GM_config](https://github.com/sizzlemctwizzle/GM_config/wiki)) in my userscripts. 

#### license  
[![license](https://img.shields.io/github/license/almaceleste/userscripts.svg?longCache=true)](https://github.com/almaceleste/userscripts/blob/master/LICENSE)

#### wiki
[How to install userscripts](https://github.com/almaceleste/userscripts/wiki/How-to-install-userscripts)  
[How to setup Tampermonkey dashboard custom style](https://github.com/almaceleste/userscripts/wiki/How-to-setup-Tampermonkey-dashboard-custom-style)

#### platform
[![Chrome](https://img.shields.io/badge/Chrome-Linux,_Windows,_Mac,_Chrome_OS-lightgrey.svg?longCache=true)](https://tampermonkey.net/?browser=chrome)  
[![Firefox](https://img.shields.io/badge/Firefox-Linux,_Windows,_Mac-lightgrey.svg?longCache=true)](https://tampermonkey.net/?browser=firefox)  
[![Opera](https://img.shields.io/badge/Opera-Linux,_Windows,_Mac-lightgrey.svg?longCache=true)](https://tampermonkey.net/?browser=opera)  
[![Edge](https://img.shields.io/badge/Edge-Windows-lightgrey.svg?longCache=true)](https://tampermonkey.net/?browser=edge)  
[![Safari](https://img.shields.io/badge/Safari-Mac-lightgrey.svg?longCache=true)](https://tampermonkey.net/?browser=safari)  
[![Dolphin](https://img.shields.io/badge/Dolphin-Android-lightgrey.svg?longCache=true)](https://tampermonkey.net/?browser=dolphin)  
[![UC](https://img.shields.io/badge/UC-Android-lightgrey.svg?longCache=true)](https://tampermonkey.net/?browser=ucweb)  

#### external repos
[![](https://img.shields.io/badge/OpenUserJS-almaceleste-green.svg?longCache=true&colorA=778899&colorB=00bfff)](https://openuserjs.org/users/almaceleste/scripts "openuserjs | almaceleste")  
[![](https://img.shields.io/badge/Greasy_Fork-almaceleste-green.svg?longCache=true&colorA=778899&colorB=00bfff)](https://greasyfork.org/en/users/174037-almaceleste "greasy fork | almaceleste")  

### list of scripts 
#### [![](https://s.ytimg.com/yts/img/favicon-vfl8qSV2F.ico) Youtube Player Always On Top](https://github.com/almaceleste/userscripts/raw/master/src/Youtube_Player_Always_On_Top.user.js 'install')  
[![maximized](assets/img/ytpaot-maximized-small.png)](assets/img/ytpaot-maximized-big.png 'maximized player box') [![minimized](assets/img/ytpaot-minimized-small.png)](assets/img/ytpaot-minimized-big.png 'minimized player box')  
makes the youtube player visible while scrolling - minimizes the player box from a large box in the center to a small box in the upper left corner and allows you to read comments and watch video at the same time 

**features**
* makes the player smaller/bigger when you scroll page down/up
* you could use the minimize/maximize button in the upper right corner of the player for the same result
* use settings to choose what will be on top, minimized box' size, border and background.  

**known issue**
* ~~does not work when you open video from the youtube channel in the same tab~~
* when minimized, the progress bar displays the correct visible info, but when you hover over it shows the wrong time and a tooltip preview and when you click it moves to the this position rather than the expected one (this is the reason for youtube's deep code, and I don't know how to fix this yet)  

#### [![](https://cdn1.iconfinder.com/data/icons/jumpicon-basic-ui-line-1/32/-_Eye-Show-View-Watch-See-16.png) Watch Transition](https://github.com/almaceleste/userscripts/raw/master/src/Watch_Transition.user.js 'install')  
[![collapsed](assets/img/wt-collapsed-small.png)](assets/img/wt-collapsed-big.png 'collapsed message') [![expanded](assets/img/wt-expanded-small.png)](assets/img/wt-expanded-big.png 'expanded message')  
some modern sites, like Youtube and others, use ajax transitions for inner-site navigation as opposed to regular navigation. it makes difficult to write scripts which are related to the site url.  
this script watches for a transition event and prints it to the console 

**features**
* use settings to choose what kind of events to watch, the method of logging events, font style, color and background.  

#### [![](https://openusercss.org/img/openusercss.icon-x16.png) OpenUserCSS Tweaks](https://github.com/almaceleste/userscripts/raw/master/src/OpenUserCSS_Tweaks.user.js 'install')  
[![search](assets/img/ouct-search-small.png)](assets/img/ouct-search-big.png 'search page') [![theme](assets/img/ouct-theme-small.png)](assets/img/ouct-theme-big.png 'theme page') [![profile](assets/img/ouct-profile-small.png)](assets/img/ouct-profile-big.png 'profile page')  
some useful tweaks, that make working with the OpenUserCSS.org more convenient 

**features**
* displays version information for the themes on the profile page
* restores the images, that have been cropped by site, since they do not fit in the image container, and resizes the container for more accurate placement.  
    another advantage: these images support image zoom extensions
* changes the view to a more compact
* highlights the themes on hover
* on the profile page: displays statistics by default, adds screenshots of themes, adds an edit button to go to the edit page directly from the profile page
* on the edit page: removes variables (cause they is buggy now), makes the header (with save button) always available (sticky position)
* changes the start page to the search page cause the start page often throws an error
* use settings to enable/disable these options.  

#### [![](https://cdn4.iconfinder.com/data/icons/logos-brands-5/24/trello-16.png) Trello card details](https://github.com/almaceleste/userscripts/raw/master/src/Trello_card_details.user.js 'install')  
[![Trello card details](assets/img/tcd-small.png)](assets/img/tcd-big.png 'Trello card details')  
adds the creation date and the creator name and account link to the Trello card (works on the [Trello](https://trello.com) site)  
* use settings to choose which information to show.  

#### [![](https://cdn1.iconfinder.com/data/icons/simple-icons/16/stackexchange-16-black.png) StackExchange link newtaber](https://github.com/almaceleste/userscripts/raw/master/src/StackExchange_link_newtaber.user.js 'install')  
opens links from posts and answers in the new tab instead of annoying in-place opening without `<Ctrl>` button or anything else just in ordinary way (works on the [StackExchange communities](https://stackexchange.org) sites)  
* this script should work in all StackExchange communities sites.  
* use settings to choose which links will be affected.  

#### [![](https://cdn1.iconfinder.com/data/icons/system-shade-circles/512/gnome-16.png) Gnome Extensions tweaks](https://github.com/almaceleste/userscripts/raw/master/src/Gnome_Extensions_tweaks.user.js 'install')  
opens the extension pages in the new tab and and changes default sorting of the extensions list on the `Extensions` nav button (works on the [Gnome Extensions](https://extensions.gnome.org) site)  
* use settings to choose sorting type of extensions list.    

#### [![](https://cdn1.iconfinder.com/data/icons/system-shade-circles/512/opensuse-16.png) OpenSuse Software tweaks](https://github.com/almaceleste/userscripts/raw/master/OpenSuse_Software_tweaks.user.js 'install')  
[![search](assets/img/osst-search-small.webp)](assets/img/osst-search-big.webp 'search page') [![package](assets/img/osst-package-small.webp)](assets/img/osst-package-big.webp 'package page')  
opens package pages in new tab and minifies bulky package list on the [OpenSuse Software Search](https://software.opensuse.org/search) site.
* use settings to choose tweaks

#### [![](https://cdn1.iconfinder.com/data/icons/feather-2/24/external-link-16.png) External link newtaber](https://github.com/almaceleste/userscripts/raw/master/src/External_link_newtaber.user.js 'install')  
[![External link newtaber](assets/img/eln-small.png)](assets/img/eln-big.png)  
opens external links in new tab on all sites (at the moment does not support dynamic lists of links such as search results).  
* use settings to exclude parent, neighbor and child sites  
* added settings to open new tab in background, set position of new tab and return to the parent tab on close

#### [![](https://greasyfork.org/assets/blacklogo16-bc64b9f7afdc9be4cbfa58bdd5fc2e5c098ad4bca3ad513a27b15602083fd5bc.png) Greasy Fork tweaks](https://github.com/almaceleste/userscripts/raw/master/src/Greasy_Fork_tweaks.user.js 'install')  
[![Greasy Fork tweaks](assets/img/gft-small.png)](assets/img/gft-big.png 'Greasy Fork tweaks')  
various tweaks for greasyfork.org site for enhanced usability and additional features
* script version number in the script list
* compact script list view
* rating score next to the rating counts
* collapsed user profile info, control panel, discussions and script sets on the user page
* opening the script page in a new tab with options for background loading, tab position and return to the parent tab after closing
* update checks statistics
* alternative installs statistics
* custom main container width
* a script image in the script list (supports zoom extensions such as Imagus and Hover Zoom)
* use settings to turn on/off this options

#### [![](https://userstyles.org/ui/images/icons/favicon.png) UserStyles.Org Tweaks](https://github.com/almaceleste/userscripts/raw/master/src/UserStylesOrg_Tweaks.user.js 'install')  
[![UserStyles.Org Tweaks](assets/img/usot-before-after-small.webp)](assets/img/usot-before-after-big.webp 'UserStyles.Org Tweaks')  
some fixes for userstyle.org  
on edit or new style pages you could:  
* change the width of the editing frame
* fix frame height when adding new settings and options or resizing text area
* fix textarea width
* use settings to turn on/off this options
* new features may appear soon

#### [![](https://cdn0.iconfinder.com/data/icons/typicons-2/24/message-16.png) Hola Mundo](https://github.com/almaceleste/userscripts/raw/master/src/Hola_Mundo.user.js 'install')  
[![Hola Mundo](assets/img/hm-small.png)](assets/img/hm-big.png 'Hola Mundo')  
does nothing, just writes a welcome message to the console. 
* a very simple userscript that illustrates the use of the GM_config library, remote resources, themes and some common userscript mechanics
* if you need an example of the custom GM_config field see [Greasy Fork tweaks](#-greasy-fork-tweaks) script

### support me
<!-- [![Beerpay](https://beerpay.io/almaceleste/userscripts/badge.svg?style=beer-square)](https://beerpay.io/almaceleste/userscripts) [![Beerpay](https://beerpay.io/almaceleste/userscripts/make-wish.svg?style=flat-square)](https://beerpay.io/almaceleste/userscripts?focus=wish) -->
[![Ko-fi](/assets/img/Ko-fi_logo_transparent.png)](https://ko-fi.com/almaceleste "bye me cofee")
[![](https://img.shields.io/badge/Paypal-donate_me-blue.svg?longCache=true&logo=paypal)](https://www.paypal.me/almaceleste "paypal | donate me") 
