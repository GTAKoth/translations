const fs = require("node:fs");
const path = require("path");

const langDir = path.join(__dirname);
let langFiles = {};
let engFile = {};

const fileNames = fs.readdirSync(langDir);
fileNames.forEach((fileName)=>{
    if (fileName.endsWith('.json') && !(fileName.startsWith('package'))){
        let content = fs.readFileSync(path.join(langDir, fileName), "utf-8");
        if (fileName === 'en.json'){
            engFile = JSON.parse(content);
        } else {
            try{
                langFiles[fileName.substring(0,fileName.length-5)] = JSON.parse(content);
            } catch (e) {
                throw new Error(fileName.substring(0,fileName.length-5)+" is a bad file");
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
        if (typeof langFiles[langName][langPrimaryKey] === "undefined") {
            //missingKeys[langPrimaryKey] = engFile[langPrimaryKey];
            //completeKeys[langPrimaryKey] = engFile[langPrimaryKey];
            throw new Error(langName+' is missing primary '+langPrimaryKey);
        } else {
            if (typeof langFiles[langName][langPrimaryKey] !== 'string'){
                for (const langSecondaryKey in engFile[langPrimaryKey]) {
                    if (typeof langFiles[langName][langPrimaryKey][langSecondaryKey] === "undefined") {
                        //if (missingKeys[langPrimaryKey] === undefined)
                        //    missingKeys[langPrimaryKey] = {};
                        //missingKeys[langPrimaryKey][langSecondaryKey] = engFile[langPrimaryKey][langSecondaryKey];
                        throw new Error(langName+" is missing secondary "+langSecondaryKey);
                        //if (completeKeys[langPrimaryKey]===undefined)
                        //    completeKeys[langPrimaryKey] = {};
                        //completeKeys[langPrimaryKey][langSecondaryKey] = engFile[langPrimaryKey][langSecondaryKey];
                    }//else {
                    //    if (completeKeys[langPrimaryKey] === undefined)
                    //        completeKeys[langPrimaryKey] = {};
                    //    completeKeys[langPrimaryKey][langSecondaryKey] = langFiles[langName][langPrimaryKey][langSecondaryKey];
                    //}
                    if (!hasCorrectStringFormat(langFiles[langName][langPrimaryKey][langSecondaryKey],engFile[langPrimaryKey][langSecondaryKey])){
                        throw new Error(langName+ " has an incorrect [%s] "+langPrimaryKey+"/"+langSecondaryKey);
                    }
                }
            } else {
                if (!hasCorrectStringFormat(langFiles[langName][langPrimaryKey],engFile[langPrimaryKey])){
                    //missingKeys[langPrimaryKey] = engFile[langPrimaryKey]
                    throw new Error(langName+" is missing a %s");
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
