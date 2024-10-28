class Scene
{
    constructor()
    {
        this.elements = new LinkedList();
    }

    init(value)
    {
        this.elements.init(value);
    }

    add(value)
    {
        this.elements.addNode(value);
    }

    addBulk(valArray)
    {
        this.elements.addBulk(valArray);
    }

    deleteItem(value)
    {
        this.elements.deleteNode(value);
    }

    size()
    {
        return this.elements.size();
    }

    collisionsWith(object, callback)
    {
        this.elements.callNodeMethods((obj) =>
        {
            if (!(object === obj) && object.collideWith(obj))
                callback();
        });
    }

    update()
    {
        this.elements.callNodeMethods((object) =>
        {
            object.update();
        });
    }

    render()
    {
        this.elements.callNodeMethods((object) =>
        {
            object.render();
        });
    }
}