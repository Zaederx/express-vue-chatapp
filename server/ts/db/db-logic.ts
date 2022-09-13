import { Low, JSONFile } from "lowdb";
import { Data } from "./classes/Data";
//@ts-ignore
import path from "path"

export function produceDb(dbPath:string)
{
    //use json file for storage
    const file = path.join(dbPath);
    const adapter = new JSONFile<Data>(file);
    var db = new Low(adapter)
    return db
}