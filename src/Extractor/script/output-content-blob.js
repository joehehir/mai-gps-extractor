// output formatting functions
const format = (key, value) => {
    const nl = '\n';
    const timestamp = (i) => new Date(1000 * i).toISOString().replace(/.*(\d{2}:\d{2}:\d{2}.\d{3}).*/, '$1');

    /* eslint-disable arrow-body-style, max-len, no-param-reassign */
    const map = {
        srt: (v) => v.reduce((acc, cur) => {
            return acc.concat(`${nl}${cur.index}${nl}${timestamp(cur.index)} --> ${timestamp(++cur.index)}${nl}${cur.speed} ${cur.latitude} ${cur.longitude}${nl}`);
        }, ''),
        // ... WebVTT, TTML...
    };
    /* eslint-enable arrow-body-style, max-len, no-param-reassign */

    return map[key](value);
};

export default (ext, frames) => {
    const content = format(ext, frames);

    return new Blob(
        [content],
        { type: 'text/plain' },
    );
};
