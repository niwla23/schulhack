import {IservScrapper} from './iservScrapper';
import * as Keychain from 'react-native-keychain';
import AsyncStorage from '@react-native-async-storage/async-storage';
import RNRestart from 'react-native-restart';
import dayjs from 'dayjs';
import relativeTIme from 'dayjs/plugin/relativeTime';
import {Task} from './types';
import RNFetchBlob from 'rn-fetch-blob';
var _ = require('lodash');
require('dayjs/locale/de');

dayjs.extend(relativeTIme);
dayjs.locale('de');

export class IservWrapper {
  iserv: IservScrapper | null;
  constructor() {
    this.iserv = null;
  }

  async init() {
    try {
      const server: string | null = await AsyncStorage.getItem('@server');
      if (server) {
        const credentials = await Keychain.getGenericPassword();
        if (credentials) {
          const remembertoken: string = credentials.password;
          this.iserv = new IservScrapper(server, remembertoken);
        } else {
          throw new Error('Login Error: Credentials not found');
        }
      } else {
        throw new Error('Login Error: Server URL not found');
      }
    } catch (e) {
      throw e;
    }
  }

  public static async login(
    server: string,
    username: string,
    password: string,
  ) {
    let remembertoken = await IservScrapper.login(server, username, password);
    await Keychain.setGenericPassword(username, remembertoken);
    return new IservWrapper();
  }

  async logout_if_expired() {
    const expires_raw = await AsyncStorage.getItem('@cookie_expires');
    let expires;
    if (expires_raw) {
      expires = new Date(expires_raw);
    } else {
      expires = new Date(0);
    }
    if (expires < new Date()) {
      AsyncStorage.clear();
      RNRestart.Restart();
    } else {
      return;
    }
  }

  async downloadFile(path: string, title: string) {
    await this.logout_if_expired();
    const fileUrl = this.iserv?.url + path;
    const headers = this.iserv?.getHeaders();
    let dirs = RNFetchBlob.fs.dirs;
    RNFetchBlob.config({
      path: dirs.DownloadDir + '/' + title,
      addAndroidDownloads: {
        useDownloadManager: true,
        notification: true,
        description: 'Datei heruntergeladen von SchulHack',
      },
    }).fetch('GET', fileUrl, headers);
  }

  async getSubstitutionPlan(isNextDay) {
    this.logout_if_expired();
    const dayToPath = {
      false:
        '/iserv/plan/show/raw/01-Vertreter Schüler heute/subst_001.htm' ||
        (await AsyncStorage.getItem('@currentPlanPath')),
      true:
        '/iserv/plan/show/raw/02-Vertreter Schüler morgen/subst_002.htm' ||
        (await AsyncStorage.getItem('@nextPlanPath')),
    };
    var courses_raw = (await AsyncStorage.getItem('@courses')) || '[]';

    const courses: Array<String> = JSON.parse(courses_raw);
    if (this.iserv) {
      var raw = await this.iserv.get_substitution_plan(
        dayToPath[isNextDay],
        courses,
      );
      const plan = raw.plan;
      var result = [];
      for (const course in plan) {
        result.push({
          title: course,
          data: plan[course],
        });
      }
      return {plan: result, date: raw.date, week: raw.week};
      // return {plan: [], date: "", week: ""}
    } else {
      throw new Error('Not initialized. Please call .init() first.');
    }
  }

  _createDateString(date: Date) {
    return dayjs().to(dayjs(date));
  }

  async getTasksOverview(all?: Boolean) {
    // await this.iserv?.login()
    await this.logout_if_expired();
    return await this.iserv?.getTasksOverview(all);
  }

  async getTaskDetails(id: Number): Promise<Task | undefined> {
    await this.logout_if_expired();
    return await this.iserv?.getTaskDetails(id);
  }

  async setTaskDoneState(
    id: Number,
    state: Boolean,
  ): Promise<Boolean | undefined> {
    await this.logout_if_expired();
    return await this.iserv?.setTaskDoneState(id, state);
  }

  async getBirthdays() {
    await this.logout_if_expired();
    return await this.iserv?.getBirthdays();
  }
  async getClasstests() {
    await this.logout_if_expired();
    return await this.iserv?.getClasstests();
  }
}
