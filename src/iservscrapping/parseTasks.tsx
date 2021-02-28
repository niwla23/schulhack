"use strict"

import { Task, IservFile } from './types'
const cheerio = require('react-native-cheerio');


type row = {
    [index: string]: {
        index: string,
        title?: String,
        start?: Date,
        end?: Date,
        tags?: String,
        done?: Boolean,
        feedback?: String
    }
}


function parseDate(input: String) {
    var parts = input.match(/(\d+)/g);
    if (parts) {
        return new Date(Number(parts[2]), Number(parts[1]) - 1, Number(parts[0]));
    }

}


export function parseTasksOverview(input: String) {
    var parsed = []
    const $ = cheerio.load(input)

    // The table containing the tasks
    const table = $("#crud-table")
    const content = $(table.children()[1])

    // The headers of the contentTable
    var contentHeaderList = [
        "task",        // 0
        "start",       // 1
        "end",         // 2
        "tags",        // 3
        "done",        // 4
        "feedback",    // 5
    ];

    // Scrapping function start
    content.children().each(function (_index: Number, row) {
        row = $(row)
        var parsedRow: row = {};
        row.children().each(function (index2, column) {
            column = $(column)
            if (contentHeaderList.length > index2) {
                if (index2 === 5 || index2 === 4) {
                    if (column.children().length === 0) {
                        parsedRow[contentHeaderList[index2]] = false
                    } else {
                        parsedRow[contentHeaderList[index2]] = true
                    }
                } else if (index2 === 2) {
                    parsedRow[contentHeaderList[index2]] = new Date($(column.children()[0]).data("date"))
                } else if (index2 === 1) {
                    parsedRow[contentHeaderList[index2]] = parseDate(column.text())
                }
                else if (index2 === 3) {
                    parsedRow[contentHeaderList[index2]] = column.text() === "(keine)" ? "" : column.text()
                } else {
                    parsedRow[contentHeaderList[index2]] = column.text()
                    const url = ($(column.children()[0]).attr("href").split("/"))
                    parsedRow.id = Number(url[url.length - 1])
                }

            }

        })
        parsed.push(parsedRow);

    });

    return parsed;

}

function _getIconName(filename: String) {
    const icon_map = {
        "file-ftext.png": "text"
    }
    return icon_map[filename] || "file"
}



export function parseTaskDetails(input: String, baseUrl: String): Object {
    var task: Task = {}
    const $ = cheerio.load(input)

    task.from = $($(".mailto")[0]).text().trim()
    // start and end can be parsed on overview so no need to do this here actually.
    task.description = $($(".text-break-word")[0]).html().trim()

    // get task type
    if ($("#confirmation").length > 0) {
        task.type = "confirmation"
        // do nothing since we already now if it is done
    } else if ($(".file-universal-upload-button").length > 0) {
        task.type = "upload"
        // TODO
    } else {
        task.type = "text"
        // TODO
    }

    // get provided files
    task.providedFiles = []

    $($(".table-condensed > tbody")[0]).children().each(function (_index: Number, file) {
        file = $(file)

        var parsedFile: IservFile = {}
        parsedFile.name = $(file.children()[1]).text().trim() // Title
        parsedFile.size = $(file.children()[2]).text() // Size
        parsedFile.url = baseUrl + $($($(file.children()[1]).children()[0])[0]).attr("href") // URL

        parsedFile.type = "file"
        task.providedFiles?.push(parsedFile)
    })

    if (task.type === "upload") {
        task.uploadedFiles = []
        const tableIndex = task.providedFiles.length > 0 ? 1 : 0
        $($(".table-condensed > tbody")[tableIndex]).children().each(function (_index, file) {
            file = $(file)

            var parsedFile: IservFile = {}
            parsedFile.name = $(file.children()[1]).text().trim() // Title
            parsedFile.url = baseUrl + $($(file.children()[1]).children()[0]).attr("href")// URL
            parsedFile.size = $(file.children()[2]).text().trim() // Size
            parsedFile.type = "file"
            task.uploadedFiles?.push(parsedFile)
        })
        try {
            task.feedbackText = $(".col-md-12 > .panel > .panel-body").html().trim()
        } catch {
            task.feedbackText = undefined
        }
    } else if (task.type === "text") {
        task.uploadedText = $(".col-md-12 > .panel > .panel-body").html().replace("Bearbeiten", "").trim()
        try {
            task.feedbackText = $(".col-md-6 > .panel > .panel-body").html().trim()
        } catch {
            task.feedbackText = undefined
        }

    }



    return task;

}