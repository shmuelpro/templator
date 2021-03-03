import * as vscode from 'vscode';
import { ask, buildAnswersFromScript, compile, getRelativePath, IConfig, loadTemplate, writeTemplate } from './templator';

const path = require('path');


interface IQuickPickOption {
	"id": string,
	"label": string,
	"description": string
}


export function activate(context: vscode.ExtensionContext) {



	// The command has been defined in the package.json file
	// Now provide the implementation of the command with registerCommand
	// The commandId parameter must match the command field in package.json
	let disposable = vscode.commands.registerCommand('templator.build', (cib) => {
		// The code you place here will be executed every time your command is executed


		console.log("cib", cib)
		// Display a message box to the user


		//Load config
		//const x = require("c:/Users/Groknak/projects/testghost/templates/test.js")
		const config = vscode.workspace.getConfiguration("templator")
		const templateConfigs = config.templates;


		const items: IQuickPickOption[] = templateConfigs.map((config: IConfig): IQuickPickOption => {

			return {
				"id": config.id,
				"label": config.name,
				"description": config.description
			}

		})
		vscode.window.showQuickPick(items).then(async (result) => {

			if (!result) {
				vscode.window.showInformationMessage('No Option Selected');
			} else {

				if (typeof result !== "object") {
					vscode.window.showErrorMessage('Weird response');
				} else {
					const config = templateConfigs.find((config: IConfig) => config.id === result.id)

					console.log(config)
					const responses = await buildAnswersFromScript(config);
					console.log(responses)

					try {

						const template = await loadTemplate(config);
						const result = compile(template, responses);

						const relativePath = getRelativePath(config.outputFolder);
						const fileName = path.basename(relativePath)

						const savePath = cib ? cib.path : relativePath;



						await writeTemplate(savePath+fileName, result)
						vscode.window.showInformationMessage("Success")






					} catch (ex) {
						vscode.window.showErrorMessage(ex);
					}


				}

			}


		})





		/*console.log(cib.path)
	
		const path = cib.path + '/test.js';
		const aPath = path.substring(1);
		const a = require(aPath)*/


	});

	context.subscriptions.push(disposable);
}

// this method is called when your extension is deactivated
export function deactivate() { }
