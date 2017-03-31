'use strict';

// Node modules
const fs = require('fs'),
    recursive = require('recursive-readdir'),
    fse = require('fs-extra'),
    path = require('path');

// Console text colors
const fontColors = {
    red: '\x1b[31m%s\x1b[0m',
    green: '\x1b[32m%s\x1b[0m',
    yellow: '\x1b[33m%s\x1b[0m',
    magenta: '\x1b[35m%s\x1b[0m'
};

// Work files directory
const filesDirectory = './to_change_files';

// Get current system date and time
function getDateTime() {
    var date = new Date();

    var hour = date.getHours();
    hour = (hour < 10 ? "0" : "") + hour;

    var min = date.getMinutes();
    min = (min < 10 ? "0" : "") + min;

    var sec = date.getSeconds();
    sec = (sec < 10 ? "0" : "") + sec;

    var year = date.getFullYear();

    var month = date.getMonth() + 1;
    month = (month < 10 ? "0" : "") + month;

    var day = date.getDate();
    day = (day < 10 ? "0" : "") + day;

    return year + "-" + month + "-" + day + "-" + hour + "-" + min + "-" + sec;
}

// Create new directory base on current system date and time
const baseDirectory = './',
    currentDateAndTime = getDateTime();

function createDirectory(callback) {
    fs.mkdirSync(baseDirectory + currentDateAndTime);
    callback();
}

// Replace all polish diacritics and spaces
String.prototype.escapeDiacritics = function () {
    return this.replace(/ą/g, 'a').replace(/Ą/g, 'A')
        .replace(/ć/g, 'c').replace(/Ć/g, 'C')
        .replace(/ę/g, 'e').replace(/Ę/g, 'E')
        .replace(/ł/g, 'l').replace(/Ł/g, 'L')
        .replace(/ń/g, 'n').replace(/Ń/g, 'N')
        .replace(/ó/g, 'o').replace(/Ó/g, 'O')
        .replace(/ś/g, 's').replace(/Ś/g, 'S')
        .replace(/ż/g, 'z').replace(/Ż/g, 'Z')
        .replace(/ź/g, 'z').replace(/Ź/g, 'Z')
        .replace(/ /g, '_');
};

// Get list of files, copy and rename them
function copyAndRenameFiles() {
    recursive(filesDirectory, function (error, allFiles) {
        if (error) {
            console.log(fontColors.red, '\n X Wystąpił błąd, spróbuj jeszcze raz bądź sprawdź poprawność ustawień. \n');
            return;
        }

        allFiles.forEach(function (fileName) {
            var fileOutput = fileName.split('\\');
            fileOutput.shift();
            var fileOnlyName = fileOutput.pop().escapeDiacritics();
            var fileOutputPath = fileOutput.join('\\');
            var fileOutputPathWithout = fileOutputPath.escapeDiacritics();
            fse.ensureDir(baseDirectory + currentDateAndTime + '\\' + fileOutputPathWithout);
            fse.copy(fileName, baseDirectory + currentDateAndTime + '\\' + fileOutputPathWithout + '\\' + fileOnlyName, err => {
                if (err) {
                    return console.error(err);
                }
                console.log(fontColors.green, '\n✔ KOPIOWANIE ZAKOŃCZONE \n' + 'Folder docelowy: ' + baseDirectory + currentDateAndTime + '    ' + fileOnlyName + '\n');
            });
        });
    });
}

createDirectory(copyAndRenameFiles);