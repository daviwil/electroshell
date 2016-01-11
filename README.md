# electroshell

This is an experimental PowerShell console written in TypeScript on the [Electron](http://electron.atom.io/)
application platform.

## Goals

Here are some goals for the project.  Some may not be achieved but I'm motivated to try.

- Provide a rich enough console experience to replace powershell.exe for most uses
- Enable custom output formatters written with HTML and JavaScript
- PowerShell scriptable console interface, possibly even to add new UI to it
- Tabbed interface for multiple simultaneous consoles
- Session support so that it's easy to return to what you were doing after you restart

In the future this project may morph into something more than an advanced console if
things go well...

## Compiling and Running the Code

First of all, make sure you have [Node.js](https://nodejs.org/en/) 5.0.0 or later installed.

Install prerequisites by running the following command:

`npm install`

Now you should be able to run the console:

`npm start`

## License

electroshell is licensed under the [MIT License](LICENSE).