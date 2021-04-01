import * as vscode from 'vscode';
import { IConfig } from './templator';

const fs = require('fs').promises;
const path = require('path');


/**
 * Loads template file from disk
 *
 * @export
 * @param {IConfig} config
 * @return {*} 
 */
export async function loadTemplate(filePath: string) {

    let readFilePath = "";
    if (filePath) {
        readFilePath = getRelativePath(filePath);
    } else {
        vscode.window.showErrorMessage("Could not load template");
        throw "Could not load template";
    }

    return await fs.readFile(readFilePath, "UTF-8");

}


export async function listFiles(directory: string) {

    return await fs.readdir(getRelativePath(directory));
}



/**
 * Get Path relative to open project
 *
 * @export
 * @param {string} filePath
 * @return {*} 
 */
export function getRelativePath(filePath: string) {

    if (vscode.workspace.workspaceFolders) {

        return path.format({

            dir: vscode.workspace.workspaceFolders[0].uri.fsPath,
            base: filePath
        });

    }

    vscode.window.showErrorMessage("path not found");
    throw "error";

}

/**
 *
 *
 * @export
 * @param {string} writePath
 * @param {string} content
 * @return {*} 
 */
export function writeTemplate(writePath: string, content: string) {

    return fs.writeFile(writePath, content);
}


export async function prepareFolder(path: string) {

    try {
        const info = await fs.stat(path);
        console.log("info", info)
        if (!info.isDirectory()) {
            fs.mkdir()
        }

    } catch (ex) {
        vscode.window.showInformationMessage("Creating folder " + path);
        fs.mkdir(path);
    }

}