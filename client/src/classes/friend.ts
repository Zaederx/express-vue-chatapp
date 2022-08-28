export class Friend
{
    name:string
    id:string

    constructor(name:string, id:string)
    {
        this.name = name
        this.id = id
    }
    toString()
    {
        var str =  
        `Friend:{
            name:${this.name},
            id:${this.id}
        }`
        return str
    }
}