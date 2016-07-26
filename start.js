"use strict";

var path = require("path");
var app = require("app");  // Module to control application life.
var Menu = require("menu");
var Tray = require("tray");
var trayIcon = null;

var keyIn = function(key) {
    console.log("Key in " + key);
};

var addKeysToMenuTemplate = function(menuTemplate) {
    menuTemplate.push({ label: "Log in with persona...",
        submenu: [
            { label: "Alice", click: function() { keyIn("alice"); }},
            { label: "Davey", click: function() { keyIn("davey"); }},
            { label: "David", click: function() { keyIn("david"); }},
            { label: "Elaine", click: function() { keyIn("elaine"); }},
            { label: "Elmer", click: function() { keyIn("elmer"); }},
            { label: "Elod" , click: function() { keyIn("elod"); }},
            { label: "Livia", click: function() { keyIn("livia"); }},
        ]
    });
};

var buildMenu = function() {
    var menuTemplate = [];
    addKeysToMenuTemplate(menuTemplate);
    menuTemplate.push({
        label: "Exit",
        click: function() { app.quit(); }
    });

    return Menu.buildFromTemplate(menuTemplate);
};

app.on("ready", function() {
    console.log("Going to start the tray");
    trayIcon = new Tray(path.join(__dirname, "gpii/node_modules/WindowsUtilities/icons/gpii.ico"));
    trayIcon.setToolTip("GPII");
    var menu = buildMenu();
    trayIcon.setContextMenu(menu);

});
