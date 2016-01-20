'use strict';

import * as cp from 'child_process';
import ChildProcess = cp.ChildProcess;
import { createClientMessageConnection, ClientMessageConnection, RequestType, NotificationType, ILogger } from 'vscode-jsonrpc';
import { ipcMain } from 'electron';

export class EditorServicesClient
{
    private childProcess: ChildProcess;
    private webContents: GitHubElectron.WebContents;
    private clientMessageConnection: ClientMessageConnection;

    start(webContents: GitHubElectron.WebContents)
    {
        this.webContents = webContents;
        this.childProcess = cp.spawn("c:/dev/PowerShellEditorServices/src/PowerShellEditorServices.Host/bin/Debug/Microsoft.PowerShell.EditorServices.Host.exe");

        this.clientMessageConnection =
            createClientMessageConnection(
                this.childProcess.stdout,
                this.childProcess.stdin,
                new ConsoleLogger());

        this.clientMessageConnection.onNotification(
            OutputNotification.type,
            (outputBody) => {
                this.webContents.send("console:output", outputBody.output);
            });

        ipcMain.on(
            'console:execute',
            (event, commandString) => {
                this.clientMessageConnection
                    .sendRequest(
                        EvaluateRequest.type,
                        { expression: commandString })
                    .then(() => {
                       this.webContents.send("console:executeComplete");
                    });
            });

        // Start the message listener
        this.clientMessageConnection.listen();
    }

    stop()
    {
        if (this.childProcess)
        {
            this.childProcess.kill();
            this.childProcess = undefined;
        }
    }
}

export namespace EvaluateRequest {
	export const type: RequestType<EvaluateRequestArguments, void, void> =
		{ get method() { return 'evaluate'; } };
}

export interface EvaluateRequestArguments {
	expression: string;
}

export namespace OutputNotification {
	export const type: NotificationType<OutputNotificationBody> =
		{ get method() { return 'output'; } };
}

export interface OutputNotificationBody {
	category: string;
	output: string;
}

class ConsoleLogger implements ILogger
{
    error(message: string)
    {
        console.log("ERROR: " + message);
    }

	warn(message: string)
    {
        console.log("WARNING: " + message);
    }

	info(message: string)
    {
        console.log("INFO: " + message);
    }

	log(message: string)
    {
        console.log("LOG: " + message);
    }
}