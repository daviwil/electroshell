'use strict';

import { app, globalShortcut, ipcMain, BrowserWindow } from 'electron';
import { EditorServicesClient } from './editorServices';

var mainWindow: GitHubElectron.BrowserWindow;
var editorServicesClient: EditorServicesClient;

function createWindow()
{
    mainWindow =
        new BrowserWindow(
        {
            width: 650,
            height: 500,
            autoHideMenuBar: true,
            title: 'electroshell'

            // Enable these to have transparent window background
            //transparent: true,
            //frame: false,
        });

    var ret = globalShortcut.register('super+`', function()
    {
        if (mainWindow.isMinimized())
        {
            mainWindow.restore();
        }
        mainWindow.focus();
    });

    // Load the index.html of the app
    //mainWindow.loadURL('file://' + __dirname + '/index.html');
    mainWindow.loadURL('http://localhost:8080/index.html');

    mainWindow.on('closed', function() {
        // Dereference the window object
        mainWindow = null;
    });

    // Start PowerShell Editor Services
    editorServicesClient = new EditorServicesClient();
    editorServicesClient.start(mainWindow.webContents);
}

var shouldQuit = app.makeSingleInstance(function(commandLine, workingDirectory)
{
    // Someone tried to run a second instance, we should focus our window
    if (mainWindow)
    {
        if (mainWindow.isMinimized())
        {
            mainWindow.restore();
        }
        mainWindow.focus();
    }
    return true;
});

if (shouldQuit)
{
    app.quit();
    process.exit(0);
}

app.on('ready', createWindow);
app.on('window-all-closed', function()
{
    app.quit();
});

app.on('activate', function()
{
    if (mainWindow === null)
    {
        createWindow();
    }
});
