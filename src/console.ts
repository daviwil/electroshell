'use strict';

import { ipcRenderer } from 'electron';

class ConsoleManager
{
    consoleElement: HTMLElement;

    constructor(divId: string)
    {
        this.consoleElement = document.getElementById(divId);
        ipcRenderer.on('output', (event, output) =>
        {
           this.writeLine(output);
        });
    }

    writeLine(outputLine: string)
    {
        this.consoleElement.innerHTML += "<div class=\"output-line\"><span class=\"output-span\">" + outputLine + "</span></div>\n";
        window.scrollTo(0, document.body.scrollHeight);
    }
}

var consoleManager: ConsoleManager = new ConsoleManager("console");
