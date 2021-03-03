import * as vscode from 'vscode';
import * as doT from 'dot';

const fs = require('fs').promises;

interface IQuestionItem {
    id: string,
    q: string,
    buildAnswer: Function
}



export interface IConfig {
    id: string,
    name: string,
    description: string,
    pathType: string,
    scriptPath: string,
    templateFolder?: string,
    templateFile?: string,
    outputFolder: string
}

export async function ask(q: string): Promise<string> {


    let options: vscode.InputBoxOptions = {
        prompt: q,
        placeHolder: "(placeholder)"
    }

    const answer = await vscode.window.showInputBox(options)

    if (!answer) {
        return "";
    }


    return answer;

}

interface IResponse {
    [name: string]: string
}


export async function buildAnswersFromScript(config: IConfig) {

    const responses: IResponse = {};


    if (config.scriptPath) {

        if (vscode.workspace.workspaceFolders) {

            if (config.pathType === "relative") {
                const fullScriptPath = getRelativePath(config.scriptPath);
                console.log(fullScriptPath)

                try {
                    const runFunction = require(fullScriptPath)
                    const questionsBuild = runFunction();


                    for (const questionItem of questionsBuild) {
                        if (questionItem.q) {
                            const answer = await ask(questionItem.q)

                            if (!questionItem.buildAnswer) {
                                responses[questionItem.id] = answer;
                            } else {

                                questionItem.buildAnswer(answer, responses, questionItem)
                            }
                        }
                    }

                    return responses;

                } catch (error) {
                    vscode.window.showErrorMessage(error)

                    return {};
                }

                //const b = require(template.script)

                //console.log(b)

            }

        }



    }

}

export function getRelativePath(path: string) {

    console.log(path)

    if (vscode.workspace.workspaceFolders) {
        return vscode.workspace.workspaceFolders[0].uri.fsPath + path;
    }

    vscode.window.showErrorMessage("path not found");
    throw "error";   

}

export function writeTemplate(path:string,content:string){

    return fs.writeFile(path,content);
}


/*


    const config = vscode.workspace.getConfiguration("templator")
    console.log(config.get("templates"))

    
    fs.writeFile(path, 'Hello content!', function (err: any) {
        if (err) console.log(err);
        console.log('Saved!');
    });

    fs.writeFile('mynewfile1.txt', 'Hello content!', function (err: any) {
        if (err) console.log(err);
        console.log('Saved!');
    });
    config.get("templates")
    /*
[{
      "label": "aaa",
      "description": "Wggii"
  }]
    */



export async function loadTemplate(config: IConfig) {

    let path = "";
    if (config.templateFile) {
        path = getRelativePath(config.templateFile);
    } else {
        vscode.window.showErrorMessage("Could not load template");
        throw "Could not load template";
    }

    return await fs.readFile(path, "UTF-8");

}


export function compile(template: string, answers: any) {

    doT.templateSettings.interpolate = /\<\<\!([\s\S]+?)\!\>\>/g;

    try {

        const tempFn = doT.template(template);
        const resultText = tempFn(answers);
        return resultText;

    } catch (error) {
        
        vscode.window.showErrorMessage(error);
        return "";

    }
}


export async function buildFileFromTemplate(templatePath: string, answers: any) {


    //const compiledContent =









    vscode.window.showInformationMessage('Hello World babt from Templator!');


}