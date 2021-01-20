"use strict"

import { parse } from "path";

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


function parseDate(input) {
    var parts = input.match(/(\d+)/g);
    return new Date(parts[2], parts[1] - 1, parts[0]);
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
                }

            }

        })
        parsed.push(parsedRow);

    });

    return parsed;

}