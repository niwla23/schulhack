"use strict"

const cheerio = require('react-native-cheerio');


type row = {
    time: String | null,
    subject: String | null,
    teacher: String | null,
    text: String | null,
    course: String | null,
    room: String | null
}

export class untisPlanParser {
    input: String
    constructor(input: String) {
        this.input = input
    }

    parse(courses: Array<String>) {
        const $ = cheerio.load(this.input)
        let header = $(".mon_title").text().split(" ")
        let date = header[0]
        let week = header[header.length - 1]


        // The table containing the actual plan
        const contentTable = $($(".mon_list").children()[0])

        // The headers of the contentTable
        var contentHeaderList = [
            "time",
            "subject",
            "teacher",
            "text",
            "course",
            "room",
        ];

        // Scrapping function start
        var currentClass: String | null = null;
        var parsedPlan = {};
        var beforeRow: String | null = null
        var beforeClass: String | null = null
        contentTable.children().each(function (_index: Number, row) {
            row = $(row)
            if (row.children().length === 6) {
                if (currentClass) {
                    if (courses.includes(currentClass)) {
                        var parsedRow: row = { time: null, subject: null, teacher: null, text: null, course: null, room: null };
                        if (!parsedPlan[currentClass]) {
                            parsedPlan[currentClass] = [];
                        }
                        row.children().each(function (index2, column) {
                            column = $(column)
                            if (column.text().trim()) {
                                parsedRow[contentHeaderList[index2]] = column.text();
                            } else {
                                parsedRow[contentHeaderList[index2]] = null;
                            }
                            
                            // if (column.children().length > 0) {
                            //     parsedRow[contentHeaderList[index2]] =
                            //         column.text()
                            //         ;
                            // } else {
                            //     parsedRow[contentHeaderList[index2]] = column.text();
                            // }
                        })
                        var comparableParsedRow = Object.assign({}, parsedRow)
                        var comparableBeforeRow = Object.assign({}, beforeRow)
                        delete comparableParsedRow.time
                        delete comparableBeforeRow.time
                        if (JSON.stringify(comparableParsedRow) === JSON.stringify(comparableBeforeRow) && currentClass == beforeClass) {
                            parsedPlan[currentClass].pop()
                            parsedRow.time = beforeRow.time + " / " + parsedRow.time
                            parsedPlan[currentClass].push(parsedRow)
                        } else {
                            parsedPlan[currentClass].push(parsedRow);
                        }
                        beforeRow = JSON.parse(JSON.stringify(parsedRow))
                        beforeClass = currentClass
                    }
                }


            } else if (row.children().length === 1) {
                currentClass = row.text().split(" ")[0];
            }
        });

        return { plan: parsedPlan, date, week };
    }
}
