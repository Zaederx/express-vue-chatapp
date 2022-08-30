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

    equals(friend:Friend)
    {
        if (friend.name === this.name && friend.id === this.id)
        {
            console.log('*same friend*')
            return true
        }
        else
        {
            console.log('*different friend*')
            return false
        }
    }
}