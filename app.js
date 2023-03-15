const fs = require("node:fs");
const path = require("path");

const langDir = path.join(__dirname, 'lang');
let langFiles = {};
let engFile = {};

const fileNames = fs.readdirSync(langDir);
fileNames.forEach((fileName)=>{
    if (fileName.endsWith('.json')){
        let content = fs.readFileSync(path.join(langDir, fileName), "utf-8");
        if (fileName === 'en.json'){
            engFile = JSON.parse(content);
        } else {
            try{
                langFiles[fileName.substring(0,fileName.length-5)] = JSON.parse(content);
            } catch (e) {
                console.log(fileName.substring(0,fileName.length-5), "Is a bad file");
                reportError(fileName.substring(0,fileName.length-5)+" is a bad file");
            }

        }
    }
});

function hasCorrectStringFormat(engString, targetString){
    let lookFor = /%s/g;
    let targetMatch, targetMatches = [];
    let engMatch, engMatches = [];
    while ( (targetMatch = lookFor.exec(targetString)) !== null ) {
        targetMatches.push(targetMatch.index);
    }
    while ( (engMatch = lookFor.exec(engString)) !== null ) {
        engMatches.push(engMatch.index);
    }
    return engMatches.length === targetMatches.length;
}

for (const langName in langFiles) {
    //let missingKeys = {};
    //let completeKeys = {};
    for (const langPrimaryKey in engFile) {
        if (langFiles[langName][langPrimaryKey] === undefined) {
            //missingKeys[langPrimaryKey] = engFile[langPrimaryKey];
            //completeKeys[langPrimaryKey] = engFile[langPrimaryKey];
            console.error(langName+' is missing primary '+langPrimaryKey)
        } else {
            if (typeof langFiles[langName][langPrimaryKey] !== 'string'){
                for (const langSecondaryKey in engFile[langPrimaryKey]) {
                    if (langFiles[langName][langPrimaryKey][langSecondaryKey] === undefined || !hasCorrectStringFormat(langFiles[langName][langPrimaryKey][langSecondaryKey],engFile[langPrimaryKey][langSecondaryKey])) {
                        //if (missingKeys[langPrimaryKey] === undefined)
                        //    missingKeys[langPrimaryKey] = {};
                        //missingKeys[langPrimaryKey][langSecondaryKey] = engFile[langPrimaryKey][langSecondaryKey];
                        console.error(langName+"is missing secondary "+langSecondaryKey);
                        //if (completeKeys[langPrimaryKey]===undefined)
                        //    completeKeys[langPrimaryKey] = {};
                        //completeKeys[langPrimaryKey][langSecondaryKey] = engFile[langPrimaryKey][langSecondaryKey];
                    } //else {
                    //    if (completeKeys[langPrimaryKey] === undefined)
                    //        completeKeys[langPrimaryKey] = {};
                    //    completeKeys[langPrimaryKey][langSecondaryKey] = langFiles[langName][langPrimaryKey][langSecondaryKey];
                    //}
                }
            } else {
                if (!hasCorrectStringFormat(langFiles[langName][langPrimaryKey],engFile[langPrimaryKey])){
                    //missingKeys[langPrimaryKey] = engFile[langPrimaryKey]
                    console.error(langName+" is missing a %s");
                } //else {
                 //   completeKeys[langPrimaryKey] = langFiles[langName][langPrimaryKey];
                //}
            }
        }
    }
    //if (Object.keys(missingKeys).length>0){
    //    fs.writeFileSync(path.join(__dirname, 'missingkeys', 'missing_'+langName+'.json'), JSON.stringify(missingKeys, null, 4), 'utf-8');
    //    console.log(`${langName} is missing some keys or doesn't have the correct number of [%s]!`);
    //}
    //else
    //    console.log(`${langName} is complete.`);
    //if (Object.keys(completeKeys).length>0) {
    //    fs.writeFileSync(path.join(__dirname, 'completefiles', langName+'.json'), JSON.stringify(completeKeys, null, 4), 'utf-8');
    //    console.log(`${langName} complete file generated.`);
    //}
}
