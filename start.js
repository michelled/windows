"use strict";

const {app, Menu, Tray} = require('electron')
var path = require("path");
var request = require("request");
var trayIcon;

var keyIn = function (key) {
    console.log("Key in " + key);
    request("http://localhost:8081/user/" + key + "/login", function (error, response, body) {
        updateMenu();
    });
};

var keyOut = function (key) {
    console.log("Key out " + key);
    request("http://localhost:8081/user/" + key + "/logout", function (error, response, body) {
        updateMenu();
    });
};

var getLoggedInKey = function (callback) {
    request("http://localhost:8081/userToken", function (error, response, body) {
        if (!error && body.indexOf("No user currently logged in to the system") == 0) {
            callback(false);
        }
        else if (!error) {
            var key = JSON.parse(body);
            callback(key[0]);
        }
        else {
            callback(404);
        }
    })
};

var gpiiRunning, keyLoggedIn;
var updateMenu = function () {
    getLoggedInKey(function (key) {  // key is either the key that's logged in, or false or 404
        var newGpiiRunning, newKeyLoggedIn;
        if (key === 404) {
            newGpiiRunning = false;
            newKeyLoggedIn = null;
        } else if (key === false) {
            newGpiiRunning = true;
            newKeyLoggedIn = null;
        } else {
            newGpiiRunning = true;
            newKeyLoggedIn = key;
        }

        if (gpiiRunning !== newGpiiRunning || keyLoggedIn !== newKeyLoggedIn) {
            console.log("Going to update the menu " + newKeyLoggedIn);
            gpiiRunning = newGpiiRunning;
            keyLoggedIn = newKeyLoggedIn;
            trayIcon.setContextMenu(buildMenu());
        }
    });
};

var addKeysToMenuTemplate = function (menuTemplate) {
    menuTemplate.push({ label: "Log in with persona...",
        submenu: [
            { label: "Alice", click: function () { keyIn("alice"); }},
            { label: "Davey", click: function () { keyIn("davey"); }},
            { label: "David", click: function () { keyIn("david"); }},
            { label: "Elaine", click: function () { keyIn("elaine"); }},
            { label: "Elmer", click: function () { keyIn("elmer"); }},
            { label: "Elod" , click: function () { keyIn("elod"); }},
            { label: "Livia", click: function () { keyIn("livia"); }},
        ]
    });
};

var buildMenu = function () {
    var menuTemplate = [];
    if (gpiiRunning && keyLoggedIn) {
        menuTemplate.push({ label: "Keyed in as " + keyLoggedIn, enabled: false });
        menuTemplate.push({ label: "Key out " + keyLoggedIn,
            click: function () {
                keyOut(keyLoggedIn);
            }
        });
    } else if (gpiiRunning) { addKeysToMenuTemplate(menuTemplate); }

    menuTemplate.push({
        label: "Exit",
        click: function () { app.quit(); }
    });

    return Menu.buildFromTemplate(menuTemplate);
};

var startGPII = function () {
    console.log("Going to start the GPII");
    require("./gpii.js");
};

app.on("ready", function () {
    startGPII();
    console.log("Going to start the tray");
    trayIcon = new Tray(path.join(__dirname, "gpii/node_modules/WindowsUtilities/icons/gpii.ico"));
    trayIcon.setToolTip("GPII");
    updateMenu();

});
