"use strict"

import axios, { AxiosAdapter } from 'axios';
const cheerio = require('react-native-cheerio');

import { untisPlanParser } from './parseUntisPlan'
import { parseTasksOverview } from './parseTasks'
import login from './login'

export type ParserResult = {
  plan: Object,
  date: String,
  week: String
}

export class IservScrapper {
  url: String
  user: String
  password: String
  cookies: String | null

  constructor(url: String, user: String, password: String) {
    this.url = url;
    this.user = user;
    this.password = password;
    this.cookies = null;
  }

  async login() {
    try {
      this.cookies = await login(this.url, this.user, this.password)
      return true
    } catch (e) {
      throw e
    }

  }

  async _authenticated_request(path: String, responseType?) {
    return new Promise((resolve, reject) => {
      axios({
        method: 'get',
        url: `${this.url}${path}`,
        responseType: responseType,
        headers: {
          Cookie: this.cookies,
          'User-Agent': 'Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:80.0) Gecko/20100101 Firefox/80.0',
        },
      })
        .then(function (response) {
          resolve(response);
        })
        .catch(function (e) {
          reject(e);
        });
    });
  }


  getSchoolLogoUri() {
    return this.url + "/iserv/logo/logo.png"
  }

  async get_substitution_plan(plan_path: string, courses: Array<String>): Promise<ParserResult> {
    let encoded_path = encodeURI(plan_path);

    let response = await this._authenticated_request(
      encoded_path,
    );
    const parser: untisPlanParser = new untisPlanParser(response.data)
    return parser.parse(courses)
  }

  async getTasksOverview() {
    let response = await this._authenticated_request("/iserv/exercise"); // ?filter[status]=all
    return parseTasksOverview(response.data)
  }

  async getBirthdays() {
    let response = await this._authenticated_request("/iserv/");
    const $ = cheerio.load(response.data)

    var parsed: Array<Object> = []
    const birthdaysContainer = $($('h2:contains("Geburtstage")').parent().parent())
    const birthdayList = $($($(birthdaysContainer.children()[1]).children()[0]).children()[0])

    birthdayList.children().each(function (_index: Number, row) {
      row = $(row)
      var birthday = {}
      const splitted = row.text().split("\n")
      
      birthday.name = splitted[1].trim()

      const date = splitted[3].trim()
      const dateSplitted = date.split(",")

      birthday.date = {}
      birthday.date.when = dateSplitted[0].trim()
      if (dateSplitted[1]) {
        birthday.date.becomes = parseInt(dateSplitted[1].trim())
      }


      parsed.push(birthday)
    })

    return parsed
  }
}