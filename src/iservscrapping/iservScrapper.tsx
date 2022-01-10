'use strict';

import axios, {ResponseType, Method} from 'axios';
const FormData = require('form-data');
const cheerio = require('react-native-cheerio');

import {untisPlanParser} from './parseUntisPlan';
import {parseTaskDetails, parseTasksOverview} from './parseTasks';
import {get_remember_token} from './auth';
import {Task, Birthday, Classtest} from './types';

export type ParserResult = {
  plan: Object;
  date: String;
  week: String;
};

export class IservScrapper {
  url: string;
  remembertoken: string | null;

  constructor(url: string, remembertoken: string) {
    this.url = url;
    this.remembertoken = remembertoken;
  }

  public static async login(
    url: string,
    user: string,
    password: string,
  ): Promise<string> {
    try {
      return await get_remember_token(url, user, password);
    } catch (e) {
      throw e;
    }
  }

  getHeaders() {
    return {
      Cookie: `REMEMBERME=${this.remembertoken}`,
      'User-Agent':
        'Mozilla/5.0 (X11; Linux x86_64; rv:95.0) Gecko/20100101 Firefox/95.0',
      'Content-Type': 'application/x-www-form-urlencoded',
    };
  }

  async _authenticated_request(
    path: String,
    responseType?: ResponseType,
    method?: Method,
    body?: Object,
  ) {
    return axios({
      method: method || 'get',
      url: `${this.url}${path}`,
      responseType: responseType,
      headers: this.getHeaders(),
      data: body,
    });
  }

  getSchoolLogoUri() {
    return this.url + '/iserv/logo/logo.png';
  }

  async get_substitution_plan(
    plan_path: string,
    courses: Array<String>,
  ): Promise<ParserResult> {
    let encoded_path = encodeURI(plan_path);

    let response = await this._authenticated_request(encoded_path);
    const parser: untisPlanParser = new untisPlanParser(response.data);
    return parser.parse(courses);
  }

  async getTasksOverview(all?: Boolean) {
    let response;
    if (all) {
      response = await this._authenticated_request(
        '/iserv/exercise/past/exercise',
      ); // fetch all tasks
    } else {
      response = await this._authenticated_request('/iserv/exercise'); // fetch only current tasks
    }

    return parseTasksOverview(response.data);
  }

  async getTaskDetails(id: Number): Promise<Task> {
    let response = await this._authenticated_request(
      `/iserv/exercise/show/${id}`,
    );
    return parseTaskDetails(response.data, this.url);
  }

  async setTaskDoneState(id: Number, state: Boolean): Promise<Boolean> {
    // This function updates the "done" state on a select task.
    let response = await this._authenticated_request(
      `/iserv/exercise/show/${id}`,
    );
    const $ = cheerio.load(response.data);

    // const confirmed = $("#confirmation_confirmed option:selected").attr("value")
    const confirmation_id = $('#confirmation_id').attr('value');
    const confirmation_token = $('#confirmation__token').attr('value');

    const formData = new URLSearchParams();
    formData.append('confirmation[confirmed]', Number(state).toString());
    formData.append('confirmation[submit]', '');
    formData.append('confirmation[id]', confirmation_id);
    formData.append('confirmation[_token]', confirmation_token);

    this._authenticated_request(
      `/iserv/exercise/confirm/${id}`,
      undefined,
      'POST',
      formData,
    );

    return false;
  }

  async getBirthdays() {
    let response = await this._authenticated_request('/iserv/');

    const $ = cheerio.load(response.data);

    var parsed: Array<Birthday> = [];
    const birthdaysContainer = $(
      $('h2:contains("Geburtstage")').parent().parent(),
    );
    const birthdayList = $(
      $($(birthdaysContainer.children()[1]).children()[0]).children()[0],
    );

    birthdayList.children().each(function (_index: Number, row) {
      row = $(row);
      var birthday: Birthday = {name: '', when: '', becomes: 0};
      const splitted = row.text().split('\n');

      birthday.name = splitted[1].trim();

      const date = splitted[3].trim();
      const dateSplitted = date.split(',');

      birthday.when = dateSplitted[0].trim();
      if (dateSplitted[1]) {
        birthday.becomes = parseInt(dateSplitted[1].trim());
      }

      parsed.push(birthday);
    });

    return parsed;
  }
  async getClasstests() {
    let response = await this._authenticated_request('/iserv/');

    const $ = cheerio.load(response.data);

    let parsed: Classtest[] = [];
    const classTestsContainer = $(
      $('h2:contains("Klausuren")').parent().parent(),
    );
    const classTestList = $(
      $($(classTestsContainer.children()[1]).children()[0]).children(),
    );
    classTestList.each(function (_index: Number, row) {
      if (row.tagName === 'li') {
        row = $(row);
        let classtest: Classtest = {
          title: '',
          date: '',
          kind: 'Implement me',
          course: '',
        };
        const splitted = row.text().split('-');

        let title_and_kind: string[] = splitted[3].trim().split('(');
        classtest.kind = title_and_kind.pop()?.slice(0, -1);
        classtest.title = title_and_kind.join('(');
        classtest.date = splitted[0].trim() + ',' + splitted[1].trim();
        classtest.course = splitted[2].trim();
        parsed.push(classtest);
      }
    });
    return parsed;
  }
}
