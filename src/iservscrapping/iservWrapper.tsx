import { IservScrapper } from "./iservScrapper"
import * as Keychain from 'react-native-keychain';
import AsyncStorage from '@react-native-async-storage/async-storage';


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
            await this.iserv.login()
            var raw = await this.iserv.get_substitution_plan(dayToPath[isNextDay], courses)
            const plan = raw.plan
            console.log(JSON.stringify(raw))
            var result = []
            for (const course in plan) {
                console.log(`${course}: ${plan[course]}`);
                result.push({
                    title: course,
                    data: plan[course]
                })
            }
            console.log(JSON.stringify(result))
            return { plan: result, date: raw.date, week: raw.week }
        } else {
            throw new Error("Not initialized. Please call .init() first.")
        }
    }

    _createDateString(date: Date) {
        const day = ("0" + date.getDate()).slice(-2)
        const month = ("0" + date.getMonth() + 1).slice(-2)
        const year = date.getFullYear()
        const hour = ("0" + date.getHours()).slice(-2)
        const minute = ("0" + date.getMinutes()).slice(-2)
        return `${day}.${month}.${year} um ${hour}:${minute}`
    }

    async getTasksOverview() {
        await this.iserv?.login()
        const raw = await this.iserv?.getTasksOverview()

        var result = [
            { title: "Überfällig", data: [] },
            { title: "Dringend", data: [] },
            { title: "7 Tage", data: [] },
            { title: "Irgendwann", data: [] },
            { title: "Fertig", data: [] },
            { title: "Nicht abgegeben", data: [] },
            { title: "Fehler", data: [] }
        ]

        const in7Days = new Date()
        in7Days.setDate(in7Days.getDate() + 7)



        const importantDate = new Date()
        importantDate.setDate(importantDate.getDate() + 2)

        raw?.forEach(task => {
            const taskEnd = task.end

            task.end = this._createDateString(task.end)
            task.start = this._createDateString(task.start)
            const taskTimeout = new Date()
            taskTimeout.setDate(taskEnd.getDate() + 7)

            if (taskEnd < new Date() && taskEnd > taskTimeout && !task.done) {
                delete task.done
                delete task.feedback
                result[0].data.push(task)
            } else if (taskEnd < new Date() && !task.done) {
                delete task.done
                result[5].data.push(task)
            } else if (taskEnd < importantDate && taskEnd > new Date() && !task.done) {
                delete task.done
                delete task.feedback
                result[1].data.push(task)
            } else if (taskEnd < in7Days && taskEnd > new Date() && !task.done) {
                delete task.done
                delete task.feedback
                result[2].data.push(task)
            } else if (!task.done) {
                delete task.done
                delete task.feedback
                result[3].data.push(task)

            } else if (task.done) {
                delete task.done
                result[4].data.push(task)
            } else {
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
    async getBirthdays() {
        await this.iserv?.login()
        const raw = await this.iserv?.getBirthdays()
        var formatted = []
        raw?.forEach(element => {
            const date = element.date
            var highlight = false
            var formattedDate = ""
            if (element.date.becomes && element.date.when !== "heute") {
                formattedDate = `wird in ${date.when} ${date.becomes}`
            } else if (element.date.becomes && element.date.when === "heute") {
                formattedDate = `wird heute ${date.becomes}`
                highlight = true
            } else if (element.date.when === "heute") {
                formattedDate = `hat heute Geburtstag`
                highlight = true
            } else {
                formattedDate = `hat in ${date.when} Geburtstag`
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