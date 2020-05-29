// ==UserScript==
// @exclude         *
// @author          (ɔ) Paola Captanovska (https://almaceleste.github.io)
// @icon            https://cdn0.iconfinder.com/data/icons/typicons-2/24/message-32.png
// @icon64          https://cdn0.iconfinder.com/data/icons/typicons-2/24/message-128.png

// @homepageURL     https://github.com/almaceleste/userscripts
// @supportURL      https://github.com/almaceleste/userscripts/issues
// @updateURL       https://github.com/almaceleste/userscripts/raw/master/src/loadreplace.js
// @downloadURL     https://github.com/almaceleste/userscripts/raw/master/src/loadreplace.js

// ==UserLibrary==
// @name            Load_&_Replace
// @namespace       almaceleste
// @version         0.1.0
// @description     loads a remote file, replace regex and return the string
// @description:ru  загружает удалённый файл, делает в нём замену по regex и возвращает строку 
// @license         AGPL-3.0-or-later; http://www.gnu.org/licenses/agpl

// ==/UserLibrary==
// ==/UserScript==

// ==OpenUserJS==
// @author almaceleste
// ==/OpenUserJS==

const loadreplace = {
    regex: null,
    url: null,

    get: async function(u = url, r = regex, local = false){
        // let file = await getfile(u, local);

        // Object.keys(r).forEach((k) => {
        //     file = file.replace(r[k],k);
        // });
        // return file;

        fetch(u, {mode: 'no-cors'}).then((response) => {
            response.text().then((txt) => {
                Object.keys(r).forEach((k) => {
                    txt = txt.replace(r[k], k);
                });
                return txt;
            });
        });
    }
};

// async function getfile(url, local = false){
//     // console.error(`${GM_info.script.name}: ${url} is not css-file`);
//     let result;

//     if (local) {
//         result = await fetchLocal(url);
//         return result;
//     }
//     else {
//         fetch(url, {mode: 'no-cors'}).then((response) => {
//             response.text().then((txt) => {
//                 return txt;
//             });
//         });
//     }
// }

// does not working
// function fetchLocal(url) {
//     return new Promise(function(resolve, reject) {
//         var xhr = new XMLHttpRequest;
//         xhr.onload = function() {
//             resolve(new Response(xhr.responseText, {status: xhr.status}));
//         }
//         xhr.onerror = function() {
//             reject(new TypeError('Local request failed'));
//         }
//         xhr.open('GET', url);
//         xhr.send(null);
//     })
// }
