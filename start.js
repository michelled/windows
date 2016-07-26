"use strict";

var path = require("path");
var app = require("app");  // Module to control application life.
var Tray = require("tray");
var trayIcon = null;


app.on("ready", function() {
    console.log("Going to start the tray");
    trayIcon = new Tray(path.join(__dirname, "gpii/node_modules/WindowsUtilities/icons/gpii.ico"));
});
