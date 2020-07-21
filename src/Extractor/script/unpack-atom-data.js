import formatFrame from './format-frame';

export default (length, struct, atom) => {
    const frames = [];

    // traverse atom and extract frames
    for (let i = 0; i < atom.length; i += length) {
        const slice = Array.from(atom.slice(i, (i + length)));

        // slice verification and exit condition
        if (!(slice.length === length && slice[0] === 1)) {
            break;
        }

        // map frame to struct template
        const frame = struct.reduce((acc, [key, size]) => (
            { ...acc, [key]: slice.splice(size) }
        ), {});

        // restructure frame object
        frames.push(formatFrame(frame));
    }

    return frames;
};
