// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const vscode = require('vscode');

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed

/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {
  // Use the console to output diagnostic information (console.log) and errors (console.error)
  // This line of code will only be executed once when your extension is activated
  console.log(
    'Congratulations, your extension "lodash-import-what-you-need" is now active!'
  );

  // The command has been defined in the package.json file
  // Now provide the implementation of the command with  registerCommand
  // The commandId parameter must match the command field in package.json
  let disposable = vscode.commands.registerCommand(
    'lodash-import-what-you-need.lodash-treeshake',
    function () {
      // The code you place here will be executed every time your command is executed
      let lodashFunctions = require('./lodashFunctions.js');
      const editor = vscode.window.activeTextEditor;
      let importLineOne = -1;
      let importLodashLine = -1;
      let lodashText = '';
      let lodashLines = [];
      let usedLodashFunctions = [];

      if (editor) {
        let document = editor.document;
        if (document.isDirty) document.save();

        for (let index = 0; index < document.lineCount; index++) {
          let x = document.lineAt(index).text;
          let lcx = x.toLowerCase();

          if (lcx.includes('import') && importLineOne === -1) {
            importLineOne = index;
          }

          if (
            lcx.includes('import') &&
            lcx.includes('lodash') &&
            !lcx.includes('lodash/')
          ) {
            importLodashLine = index;
            if (lcx.includes('{')) {
              vscode.window.showInformationMessage(
                "[Lodash Treeshake] Cannot run with lodash imported with curly brases. E.g. `import {filter} from 'lodash';`"
              );
              return;
            }
            // if imported as `import lodash from 'lodash';`
            else if (lcx.includes('* as ')) {
              let spaces = x.split(' ');
              lodashText = spaces[3];
              break;
            } else {
              let spaces = x.split(' ');
              lodashText = spaces[1];
              break;
            }
          }
        }

        //If lodash import was not found then alert user
        if (importLodashLine === -1) {
          vscode.window.showInformationMessage(
            `[Lodash Treeshake] Lodash was not found!`
          );
          return;
        }

        //Iterate through document and find where lodash functions are used
        for (let index = 0; index < document.lineCount; index++) {
          let x = document.lineAt(index).text;

          //Check if line includes the name of lodash from the import
          if (x.includes(`${lodashText}.`)) {
            //If the name was not found strip out and only get the function name
            let func_line = x.trim().split(lodashText);
            let func = func_line[1].split('(')[0].replaceAll('.', '');

            //Check filter out matching function names
            let foundFunction = lodashFunctions.filter((y) => y.includes(func));

            //If the name was found
            if (foundFunction.length >= 1) {
              lodashLines.push(index);
              usedLodashFunctions.push(func);
            } else {
              //Show message saying that the lodash function is unknown
              vscode.window.showInformationMessage(
                `[Lodash Treeshake] Unknown lodash function ${lodashText}${func}() at line ${
                  index + 1
                }`
              );
            }
          }
        }

        //Filter out duplicates and replace .
        usedLodashFunctions = usedLodashFunctions.filter(
          (item, i, ar) => ar.indexOf(item) === i
        );
        usedLodashFunctions = usedLodashFunctions.map((x) =>
          x.replaceAll('.', '')
        );
        usedLodashFunctions = usedLodashFunctions.sort(
          (x, y) => x.length - y.length
        );

        let newImports = [];
        for (let index = 0; index < usedLodashFunctions.length; index++) {
          const element = usedLodashFunctions[index];
          newImports.push(`import ${element} from "lodash/${element}";`);
        }

        //Replace lodash imports
        editor
          .edit((selectedText) => {
            //Delete existing import
            selectedText.delete(
              new vscode.Range(
                new vscode.Position(importLodashLine, 0),
                new vscode.Position(
                  importLodashLine,
                  document.lineAt(importLodashLine).text.length
                )
              )
            );

            //Insert new lodash import text for all of the imports needed
            for (let index = 0; index < newImports.length; index++) {
              const element = newImports[index];
              selectedText.insert(
                new vscode.Position(importLodashLine + index, 0),
                element
              );
            }

            //Add new line after imports
            selectedText.insert(
              new vscode.Position(importLodashLine + newImports.length - 1, 0),
              '\r\n'
            );

            //Update function calls
            for (let index = 0; index < lodashLines.length; index++) {
              const lineNumber = lodashLines[index];
              let currentText = document.lineAt(lineNumber).text;
              let newText = currentText.replace(lodashText + '.', '');
              console.log(lineNumber + 1, newText);

              selectedText.replace(
                new vscode.Range(
                  new vscode.Position(lineNumber, 0),
                  new vscode.Position(
                    lineNumber,
                    document.lineAt(lineNumber).text.length
                  )
                ),
                newText
              );
            }
          })
          .then((res) => {
            vscode.window.showInformationMessage(
              `[Lodash Treeshake] Edits have ${
                res ? 'sucessfully been' : 'failed to be'
              } applied`
            );
          });
      } else {
        // Display a message box to the user
        vscode.window.showInformationMessage(
          '[Lodash Treeshake] There is no file currently open!'
        );
      }
    }
  );

  context.subscriptions.push(disposable);
}

// this method is called when your extension is deactivated
function deactivate() {}

module.exports = {
  activate,
  deactivate,
};
