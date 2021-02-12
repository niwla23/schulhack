import { IservScrapper } from "./iservScrapper"
import * as Keychain from 'react-native-keychain';
import AsyncStorage from '@react-native-async-storage/async-storage';
import dayjs from "dayjs"
import relativeTIme from "dayjs/plugin/relativeTime"
import { relativeTime } from "dayjs/locale/*";
import { Task } from "./types";
var _ = require('lodash');
require('dayjs/locale/de')


dayjs.extend(relativeTIme)
dayjs.locale("de")

export class IservWrapper {
    iserv: IservScrapper | null
    constructor() {
        this.iserv = null
    }

    async init() {
        try {
            const server: String = await AsyncStorage.getItem("@server")
            const credentials = await Keychain.getGenericPassword()
            const user: String = credentials.username
            const password: String = credentials.password
            this.iserv = new IservScrapper(server, user, password)
        } catch {
            throw new Error("Login Error")
        }

    }

    async forceLogin() {
        return await this.iserv?.login()
    }

    async loadCookieOrLogin() {
        const expires_raw = await AsyncStorage.getItem("@cookie_expires")
        var expires
        if (expires_raw) {
            expires = new Date(expires_raw)
        } else {
            expires = new Date(0)
        }

        if (expires < new Date) {
            const cookies = await this.forceLogin()
            var expiresDate = new Date()
            expiresDate.setMinutes(expiresDate.getMinutes() + 15)
            AsyncStorage.setItem("@cookie_expires", expiresDate.toISOString())
            if (cookies) {
                AsyncStorage.setItem("@cookie", cookies.toString())
            } else {
                throw new Error("login failed")
            }

        } else {
            if (this.iserv) {
                this.iserv.cookies = await AsyncStorage.getItem("@cookie")
            } else {
                throw new Error("not initialized")
            }

        }

    }

    async getSubstitutionPlan(isNextDay) {
        const dayToPath = {
            false: "/iserv/plan/show/raw/01-Vertreter Schüler heute/subst_001.htm",
            true: "/iserv/plan/show/raw/02-Vertreter Schüler morgen/subst_002.htm"
        }
        var courses_raw = await AsyncStorage.getItem("@courses") || '[]'
        const currentPlanPath = await AsyncStorage.getItem("@currentPlanPath")
        const nextPlanPath = await AsyncStorage.getItem("@nextPlanPath")
        if (!courses_raw) {
            throw new Error("unexpected error")
        }
        if (nextPlanPath) {
            dayToPath[true] = nextPlanPath
        }
        if (currentPlanPath) {
            dayToPath[false] = currentPlanPath
        }
        const courses: Array<String> = JSON.parse(courses_raw)
        if (this.iserv) {
            // await this.iserv.login()
            await this.loadCookieOrLogin()
            var raw = await this.iserv.get_substitution_plan(dayToPath[isNextDay], courses)
            const plan = raw.plan
            var result = []
            for (const course in plan) {
                result.push({
                    title: course,
                    data: plan[course]
                })
            }
            return { plan: result, date: raw.date, week: raw.week }
            // return {plan: [], date: "", week: ""}
        } else {
            throw new Error("Not initialized. Please call .init() first.")
        }
    }

    _createDateString(date: Date) {
        return dayjs().to(dayjs(date))
    }

    async getTasksOverview() {
        // await this.iserv?.login()
        await this.loadCookieOrLogin()
        const raw = await this.iserv?.getTasksOverview()

        var result = [
            { title: "Überfällig", data: [] },
            { title: "Nächste 24 Stunden", data: [] },
            { title: "Nächste 7 Tage", data: [] },
            { title: "Irgendwann", data: [] },
            { title: "Fertig", data: [] },
            { title: "Nicht abgegeben", data: [] },
            { title: "Fehler", data: [] }
        ]

        const in7Days = new Date()
        in7Days.setDate(in7Days.getDate() + 7)



        const importantDate = new Date()
        importantDate.setHours(importantDate.getHours() + 24)

        raw?.forEach(task => {
            const taskEnd = task.end
            task.original = _.cloneDeep(task)
            task.end = this._createDateString(task.end)
            task.start = this._createDateString(task.start)

            const taskTimeout = new Date()
            taskTimeout.setDate(taskEnd.getDate() + 7)

            if (taskEnd < new Date() && taskEnd < taskTimeout && !task.done) {
                // overdue
                delete task.done
                delete task.feedback
                result[0].data.push(task)
            } else if (taskEnd < new Date() && !task.done) {
                // long overdue
                delete task.done
                result[5].data.push(task)
            } else if (taskEnd < importantDate && taskEnd > new Date() && !task.done) {
                // important
                delete task.done
                delete task.feedback
                result[1].data.push(task)
            } else if (taskEnd < in7Days && taskEnd > new Date() && !task.done) {
                // 7 days
                delete task.done
                delete task.feedback
                result[2].data.push(task)
            } else if (!task.done) {
                // in long time
                delete task.done
                delete task.feedback
                result[3].data.push(task)

            } else if (task.done) {
                // done
                delete task.done
                result[4].data.push(task)
            } else {
                // error
                result[6].data.push(task)
            }
        });

        var cleanedResult = []
        result.forEach(function callback(element, index) {
            if (element.data.length !== 0) {
                cleanedResult.push(element)
            }
        });
        return cleanedResult
    }

    async getTaskDetails(id: Number): Promise<Task | undefined> {
        await this.loadCookieOrLogin()
        return await this.iserv?.getTaskDetails(id)
    }

    async setTaskDoneState(id: Number, state: Boolean): Promise<Boolean | undefined> {
        await this.loadCookieOrLogin()
        return await this.iserv?.setTaskDoneState(id, state)
    }

    async getBirthdays() {
        await this.loadCookieOrLogin()
        const raw = await this.iserv?.getBirthdays()
        var formatted = []
        raw?.forEach(element => {
            const date = element.date
            var highlight = false
            var formattedDate = ""
            if (element.date.becomes && element.date.when !== "heute") {
                formattedDate = `wird ${date.when} ${date.becomes}`
            } else if (element.date.becomes && element.date.when === "heute") {
                formattedDate = `wird heute ${date.becomes}`
                highlight = true
            } else if (element.date.when === "heute") {
                formattedDate = `hat heute Geburtstag`
                highlight = true
            } else {
                formattedDate = `hat ${date.when} Geburtstag`
            }
            formatted.push({
                name: element.name,
                date: formattedDate,
                highlight: highlight
            })
        });
        return formatted
    }
}