import defer from './defer';

// eager instantiate singleton
const Extractor = new class {
    constructor() {
        this.worker = new Worker('extractor.js', { type: 'module' });
        this.cache = new Map();

        // attach event listeners
        Object.entries({
            error: this.receive.bind(this),
            message: this.receive.bind(this),
        }).forEach((e) => this.worker.addEventListener(...e, false));
    }

    transfer(name, extension, buffer) {
        // cache deferred promise
        if (this.cache.get(name) === undefined) {
            this.cache.set(name, defer());

            this.worker.postMessage({
                name,
                extension,
                buffer,
            }, [buffer]); // Transferable

            return this.cache.get(name).promise;
        }

        // fallback
        return defer().promise;
    }

    receive(e) {
        const { data: { name, response, duration } } = e;

        // --- Worker-Timing --- //
        if (duration) console.info('Worker-Timing:', { name, duration });

        const deferred = this.cache.get(name);
        if (deferred) {
            // resolve/reject deferred promise
            if (response instanceof Blob) deferred.resolve(response);
            else deferred.reject(response);

            // remove cache reference
            this.cache.delete(name);
            return;
        }

        // worker error event bubble
        console.error(response);
    }
}();

export { Extractor as default };
