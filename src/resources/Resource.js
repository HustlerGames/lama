// Resource.js
class Resource {
    loaded = false
    _callbacks = []

    constructor() {}

    // подписка на событие загрузки
    onLoad(cb) {
        if (this.loaded) {
            cb(this);
        } else {
            this._callbacks.push(cb);
        }
    }

    // отмечаем ресурс как загруженный
    markLoaded() {
        this.loaded = true;
        this._callbacks.forEach(cb => cb(this));
        this._callbacks = [];
    }
}

export { Resource }
