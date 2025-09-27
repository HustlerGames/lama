class World
{
    templates = []




    _objects = []


    constructor() {
    }


    getObjects()
    {
        return this._objects;
    }


    addObject(obj)
    {
        this._objects.push(obj)

    }

}

export {World}