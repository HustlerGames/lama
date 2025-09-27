class AnimationHandler
{

    counter
    currentAnimation
    constructor() {
        this.counter = 0
    }


    start(name)
    {
        this.currentAnimation = name
        this.counter = 0
    }

    update()
    {
        this.counter++
    }

    reset()
    {
        this.counter = 0;
    }
}
export {AnimationHandler}