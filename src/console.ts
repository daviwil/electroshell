'use strict';

import { ipcRenderer } from 'electron';

class ConsoleManager
{
    private lastDiv: HTMLElement;
    private inputSpan: HTMLElement;
    private cursorSpan: HTMLElement;
    private consoleElement: HTMLElement;

    constructor(divId: string)
    {
        this.consoleElement = document.getElementById(divId);

        this.consoleElement.addEventListener(
            "keydown",
            e =>
            {
                if (this.inputSpan)
                {
                    if (e.keyCode === 8) // Backspace
                    {
                        this.inputSpan.innerHTML =
                            this.inputSpan.innerHTML.slice(0, -1);
                    }
                    if (e.keyCode === 13) // Enter
                    {
                        this.executeCommand(this.inputSpan.innerHTML);
                        this.inputSpan = undefined;
                    }
                }
            }
        )
        this.consoleElement.addEventListener(
            "keypress",
            e =>
            {
                if (this.inputSpan)
                {
                    if (e.keyCode === 8)
                    {
                    }
                    if (e.keyCode === 13)
                    {
                    }
                    else
                    {
                        this.inputSpan.innerHTML += String.fromCharCode(e.keyCode);
                    }
                }
            }, true)

        ipcRenderer.on('console:output', (event, output) =>
        {
           this.writeLine(output);
        });

        ipcRenderer.on(
            'console:executeComplete',
            (event) =>
            {
                // Set up the input field
                this.inputSpan = document.createElement("span");
                this.inputSpan.className = "output-span";
                this.inputSpan.innerHTML = "";
                this.inputSpan.setAttribute("tabIndex", "1");
                this.inputSpan.focus();
                this.lastDiv.appendChild(this.inputSpan);

                if (this.cursorSpan)
                {
                    this.cursorSpan.parentElement.removeChild(this.cursorSpan);
                }

                this.cursorSpan = document.createElement("span");
                this.cursorSpan.className = "cursor";
                this.lastDiv.appendChild(this.cursorSpan);

                this.scrollToBottom();
            })

        // Send a newline to cause the prompt to be written out
        // TODO: In the future this should probably happen
        // automatically when the console server starts up
        this.executeCommand("\n");
    }

    writeLine(outputLine: string)
    {
        var outputSpan = document.createElement("span");
        outputSpan.className = "output-span";
        outputSpan.innerHTML = outputLine;

        this.lastDiv = document.createElement("div")
        this.lastDiv.className = "output-line";
        this.lastDiv.appendChild(outputSpan);

        this.consoleElement.appendChild(this.lastDiv);
        this.scrollToBottom();
    }

    private executeCommand(commandString: string)
    {
        ipcRenderer.send("console:execute", commandString);
    }

    private scrollToBottom()
    {
        window.scrollTo(0, document.body.scrollHeight);
    }
}

var consoleManager: ConsoleManager = new ConsoleManager("console");
