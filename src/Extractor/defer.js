export default () => {
    const deferred = {
        promise: null,
        resolve: null,
        reject: null,
    };

    // expose properties
    deferred.promise = new Promise((resolve, reject) => {
        deferred.resolve = resolve;
        deferred.reject = reject;
    });

    return deferred;
};
