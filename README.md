# Templator

A tool that allows you to create files from dynamic template files and js scripts


## Example setting

```javascript
"templator.templates": [

        {
            "id":"bcomp",
            "name": "Build Component",
            "description": "Builds a component for hp-ui-elements",
            "pathType":"relative",
            "scriptPath": "templates\\test.js",
            "templateFolder":"\\^^!it.foo!^^",
            "templateFile":"templates\\mynewfile1.txt",
            "outputFolder":"\\"
        },
        {
            "id":"bapi",
            "name": "Build API",
            "pathType":"absolute",
            "scriptPath": "\\templates\\ekj.js",
            "defaultFolder":"./templates"
        }
    ]

```

## Example runner - test.js

```javascript

function run() {

    return [
        {
            id: "123",
            q: "What is the ma",
            placeholder:"Dont say ma",
            buildAnswer: (answer, responses) => {

                responses["foo"] = answer;
                responses["upper"] = answer.toUpperCase();

            }
        },
        {
            id: "cha",
            q: "Where do you want it to be?",
            buildAnswer: (answer, responses) => {

                responses["somwhere"] = answer;


            }
        },
        {
            id: "hoko",
            q: "Is it hoko?"
        }
    ]

}

module.exports = run;

```