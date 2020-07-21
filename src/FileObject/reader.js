export default (file, progress) => new Promise((resolve, reject) => {
    // instantiate file reader
    const reader = new FileReader();

    // define events
    const events = {
        progress,
        error: (err) => {
            Object.entries(events).forEach((e) => reader.removeEventListener(...e, false));
            reject(`${err.name}: ${err.message}`);
        },
        load: (evt) => {
            // ensure one reader progress update
            progress({ loaded: 87.5, total: 100 });

            Object.entries(events).forEach((e) => reader.removeEventListener(...e, false));
            resolve(evt.target.result); // ArrayBuffer
        },
    };

    // attach event listeners
    Object.entries(events).forEach((e) => reader.addEventListener(...e, false));

    reader.readAsArrayBuffer(file);
});
