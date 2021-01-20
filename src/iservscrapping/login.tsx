"use strict"
import { NativeModules } from 'react-native';
const { LoginModule } = NativeModules;

export default async function login(url: String, user: String, password: String) {
    try {
        return await LoginModule.login(url, user, password)
    } catch (e) {
        if (e.toString().includes("String index out of range")) {
            throw new Error("login failed")
        }
        throw e
    }
}