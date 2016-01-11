import { app, globalShortcut, BrowserWindow } from 'electron';
var mainWindow: GitHubElectron.BrowserWindow;

function createWindow()
{
    mainWindow =
        new BrowserWindow(
        {
            width: 650,
            height: 500,
            autoHideMenuBar: true,
            title: 'electroshell',
            webPreferences: {
                overlayScrollbars: true
            }

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
    mainWindow.loadURL('file://' + __dirname + '/../index.html');

    mainWindow.on('closed', function() {
        // Dereference the window object
        mainWindow = null;
    });
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
