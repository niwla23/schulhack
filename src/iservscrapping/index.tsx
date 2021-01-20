"use strict"

import {IservScrapper} from './iservScrapper'
import {IservWrapper} from './iservWrapper'


// export async function createIserv() : Promise<IservScrapper> {
//   const server: String = await AsyncStorage.getItem("@server")// || "http://10.0.2.2:5000"
//   const credentials = await Keychain.getGenericPassword()
//   const user: String = credentials.username// || "demo.user"
//   const password: String = credentials.password// || "123"
//   return new IservScrapper(server, user, password)
// }



export {IservScrapper, IservWrapper};
