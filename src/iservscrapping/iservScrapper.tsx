"use strict"

import axios, { ResponseType, Method } from 'axios';
const FormData = require('form-data');
const cheerio = require('react-native-cheerio');

import { untisPlanParser } from './parseUntisPlan'
import { parseTaskDetails, parseTasksOverview } from './parseTasks'
import login from './login'
import { Task } from './types';

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
      return this.cookies
    } catch (e) {
      throw e
    }

  }

  async _authenticated_request(path: String, responseType?: ResponseType, method?: Method, body?: Object) {
    return new Promise((resolve, reject) => {
      axios({
        method: method || "get",
        url: `${this.url}${path}`,
        responseType: responseType,
        headers: {
          Cookie: this.cookies,
          'User-Agent': 'Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:80.0) Gecko/20100101 Firefox/80.0',
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        data: body
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

  async getTaskDetails(id: Number): Promise<Task> {
    let response = await this._authenticated_request(`/iserv/exercise/show/${id}`);
    return parseTaskDetails(response.data, this.url)
  }

  async setTaskDoneState(id: Number, state: Boolean): Promise<Boolean> {
    // This function updates the "done" state on a select task.
    let response = await this._authenticated_request(`/iserv/exercise/show/${id}`);
    const $ = cheerio.load(response.data)

    // const confirmed = $("#confirmation_confirmed option:selected").attr("value")
    const confirmation_id = $("#confirmation_id").attr("value")
    const confirmation_token = $("#confirmation__token").attr("value")

    const formData = new URLSearchParams();
    formData.append("confirmation[confirmed]", Number(state).toString())
    formData.append("confirmation[submit]", "")
    formData.append("confirmation[id]", confirmation_id)
    formData.append("confirmation[_token]", confirmation_token)

    this._authenticated_request(`/iserv/exercise/confirm/${id}`, undefined, "POST", formData)

    return false
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