
import * as vscode from 'vscode';
import { getRelativePath, listFiles, loadTemplate, prepareFolder, writeTemplate } from './fs';
import { ask, buildAnswersFromScript, compile, IConfig, } from './templator';

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


		const config = vscode.workspace.getConfiguration("templator");

		const templateConfigs = config.templates;


		const items: IQuickPickOption[] = templateConfigs.map((config: IConfig): IQuickPickOption => {

			return {
				"id": config.id,
				"label": config.name,
				"description": config.description
			}

		});

		vscode.window.showQuickPick(items).then(async (selectedOption) => {

			if (!selectedOption) {
				vscode.window.showInformationMessage('No Option Selected');
			} else {

				if (typeof selectedOption !== "object") {
					vscode.window.showErrorMessage('Weird response');
				} else {
					const config = templateConfigs.find((config: IConfig) => config.id === selectedOption.id);
					const responses = await buildAnswersFromScript(config);


					if (config.templateFolder) {


						try {
							const files = await listFiles(config.templateFolder);


							files.forEach((file: string) => {

								const finalPath = path.format({
									dir: config.templateFolder,
									base: file
								});

								finalizeBuild(finalPath, responses, cib);

							});


						} catch (ex) {
							vscode.window.showErrorMessage(`${config.templateFolder} from config was not found`);
						}


					} else if (config.templateFile) {
						finalizeBuild(config.templateFile, responses, cib);
					}


					vscode.window.showInformationMessage("Success");

				}

			}

		})


	});

	context.subscriptions.push(disposable);
}

async function finalizeBuild(filePath: string, responses: any, cib: any) {
	const template = await loadTemplate(filePath);

	const result = compile(template, responses);

	const relativePath = getRelativePath(filePath);



	const compiledFileName = compile(filePath, responses);

	const dirName = path.dirname(compiledFileName);

	const savePath = cib ? cib.fsPath : relativePath;

	const dirPath = path.format({
		dir: savePath,
		base: dirName
	});

	await prepareFolder(dirPath);


	const finalPath = path.format({
		dir: savePath,
		base: compiledFileName
	});

	try {


		await writeTemplate(finalPath, result);

	} catch (ex) {
		vscode.window.showErrorMessage(`Failed to write file`);
		console.log(ex)

	}


}

// this method is called when your extension is deactivated
export function deactivate() { }
