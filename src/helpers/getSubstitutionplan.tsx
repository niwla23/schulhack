"use strict"

import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Keychain from 'react-native-keychain';
import { IservScrapper, ParserResult, createIserv } from '../iservscrapping'

type dayToPathType = {
    false: String,
    true: String
}

const dayToPath: dayToPathType = {
    false: "/iserv/plan/show/raw/01-Vertreter Schüler heute/subst_001.htm",
    true: "/iserv/plan/show/raw/02-Vertreter Schüler morgen/subst_002.htm"
}

export async function getPlan(is_next_day: Boolean): Promise<ParserResult> {
    var courses_raw = await AsyncStorage.getItem("@courses") || '[]' //"9f", "5d", "10a", "8f", "5a", "5d"
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
    const iserv: IservScrapper = await createIserv()
    await iserv.login()
    return iserv.get_substitution_plan(dayToPath[is_next_day], courses)
}

export default getPlan