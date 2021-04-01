import * as vscode from 'vscode';
import * as doT from 'dot';
import { getRelativePath } from './fs';



interface IQuestionItem {
    id: string,
    q: string,
    buildAnswer: Function
}



export interface IConfig {
    /*
    * id of config
    */
    id: string,
    /*
    * name of config
    */
    name: string,
    /*
    * description
    */
    description: string,
    pathType: string,
    scriptPath: string,
    templateFolder?: string,
    templateFile?: string,
    outputFolder: string
}


/**
 * 
 *
 * @export
 * @param {string} question - the question to ask
 * @param {string} placeholder
 * @return {*}  {Promise<string>}
 */
export async function ask(question: string, placeholder: string): Promise<string> {


    let options: vscode.InputBoxOptions = {
        prompt: question,
        placeHolder: placeholder
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




/**
 *
 *
 * @export
 * @param {IConfig} config
 * @return {*} 
 */
export async function buildAnswersFromScript(config: IConfig) {

    const responses: IResponse = {};


    if (config.scriptPath) {

        if (vscode.workspace.workspaceFolders) {

            if (config.pathType === "relative") {
                const fullScriptPath = getRelativePath(config.scriptPath);
                console.log(fullScriptPath)

                try {
                    const runFunction = require(fullScriptPath);
                    const questionsBuild = runFunction();


                    for (const questionItem of questionsBuild) {
                        if (questionItem.q) {
                            console.log(questionItem)
                            const answer = await ask(questionItem.q, questionItem.placeholder)

                            if (!questionItem.buildAnswer) {
                                responses[questionItem.id] = answer;
                            } else {

                                questionItem.buildAnswer(answer, responses, questionItem)
                            }
                        }
                    }

                    return responses;

                } catch (error) {
                    if (error instanceof SyntaxError) {
                        vscode.window.showErrorMessage("Something is wrong with your script file")

                    }
                    else {
                        vscode.window.showErrorMessage("An error occured")
                    }
                    console.log(error)


                    return {};
                }

                //const b = require(template.script)

                //console.log(b)

            }

        }



    }

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






/**
 * Take the answers and apply to the template
 *
 * @export
 * @param {string} template
 * @param {*} answers
 * @return {*} 
 */
export function compile(template: string, answers: any) {

    console.log(answers,"answers")

    doT.templateSettings.interpolate = /\^\^\!([\s\S]+?)\!\^\^/g;

    try {

        const tempFn = doT.template(template);
        console.log(tempFn)
        const resultText = tempFn(answers);
        console.log("resultText",resultText);
        return resultText;

    } catch (error) {

        console.log(error)
        vscode.window.showErrorMessage("Compilation failed");
        return "";

    }
}

