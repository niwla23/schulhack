'use strict';

import {Task, IservFile} from './types';
const cheerio = require('react-native-cheerio');

type Row = {
  id?: Number;
  title?: String;
  end?: Date;
  tags?: String;
  done?: Boolean;
  feedback?: String;
};

function parseDate(input: String) {
  var parts = input.match(/(\d+)/g);
  if (parts) {
    return new Date(Number(parts[2]), Number(parts[1]) - 1, Number(parts[0]));
  }
}

export function parseTasksOverview(input: String) {
  var parsed: Row[] = [];
  const $ = cheerio.load(input);

  // The table containing the tasks
  const content = $('#crud-table > tbody');
  // const content = $(table.children()[1]);

  // The headers of the contentTable
  var contentHeaderList = [
    'icon', // 0
    'start', // 1
    'end', // 2
    'tags', // 3
    'done', // 4
    'feedback', // 5
  ];
  console.log(content.children().length);

  // Scrapping function start
  content.children().each((index, row) => {
    let parsedRow: Row = {done: false, id: index};
    row = $(row);
    console.log('row');
    row.children().each(function (index2, column) {
      column = $(column);
      console.log('columnt');
      if (index2 === 1) {
        parsedRow.title = column.text().trim();
      } else if (index2 === 2) {
        let text: string = column.attr('data-sort');
        const year = Number(text.substring(0, 4));
        const month = Number(text.substring(4, 6));
        const day = Number(text.substring(6, 8));
        const hour = Number(text.substring(8, 10));
        const minutes = Number(text.substring(10, 12));
        const seconds = Number(text.substring(12, 14));
        console.log(
          year,
          month,
          day,
          hour,
          minutes,
          seconds,
          new Date(year, month, day, hour, minutes, seconds),
        );
        parsedRow.end = new Date(year, month, day, hour, minutes, seconds);
      } else if (index2 === 3) {
        parsedRow.feedback = column.text().trim();
      } else if (index2 === 4) {
        parsedRow.tags = column.text().trim();
      }
    });
    parsed.push(parsedRow);
  });

  return parsed;
}

function _getIconName(filename: String) {
  const icon_map = {
    'file-ftext.png': 'text',
  };
  return icon_map[filename] || 'file';
}

export function parseTaskDetails(input: String, baseUrl: String): Object {
  var task: Task = {};
  const $ = cheerio.load(input);

  task.from = $($('.mailto')[0]).text().trim();
  // start and end can be parsed on overview so no need to do this here actually.
  task.description = $($('.text-break-word')[0]).html().trim();

  // get task type
  if ($('.file-universal-upload-button').length > 0) {
    task.type = 'upload';
  } else if ($('form[name="submission"]').length > 0) {
    task.type = 'text';
  } else {
    task.type = 'confirmation';
  }

  // get provided files
  task.providedFiles = [];

  $($('form[name="iserv_exercise_attachment"] > table > tbody')[0])
    .children()
    .each(function (_index: Number, file) {
      file = $(file);

      var parsedFile: IservFile = {};
      parsedFile.name = $(file.children()[1]).text().trim(); // Title
      parsedFile.size = $(file.children()[2]).text(); // Size
      parsedFile.url = $($($(file.children()[1]).children()[0])[0]).attr(
        'href',
      ); // URL

      parsedFile.type = 'file';
      task.providedFiles?.push(parsedFile);
    });

  if (task.type === 'upload') {
    task.uploadedFiles = [];
    const tableIndex = task.providedFiles.length > 0 ? 1 : 0;
    $($('form[name="iserv_exercise_element"] > table > tbody')[0])
      .children()
      .each(function (_index, file) {
        file = $(file);

        var parsedFile: IservFile = {};
        parsedFile.name = $(file.children()[1]).text().trim(); // Title
        parsedFile.url = $($(file.children()[1]).children()[0]).attr('href'); // URL
        parsedFile.size = $(file.children()[2]).text().trim(); // Size
        parsedFile.type = 'file';
        task.uploadedFiles?.push(parsedFile);
      });
    try {
      task.feedbackText = $(
        '.table-fixed-width > tbody > tr div.text-break-word',
      )
        .html()
        .trim();
    } catch {
      task.feedbackText = undefined;
    }
  } else if (task.type === 'text') {
    task.uploadedText = $('#submission_text').text().trim();
    try {
      task.feedbackText = $(
        '.table-fixed-width > tbody > tr div.text-break-word',
      )
        .html()
        .trim();
    } catch {
      task.feedbackText = undefined;
    }
  }

  return task;
}
