import definition from './definition';
import utility from './utility';

export default (identifier, array) => {
    const { size } = definition;

    const sequenceOccurrenceIndex = (seq, arr) => {
        const delta = seq.length; // size.atom
        const prefix = seq[0];
        const str = seq.join();

        // reverse naive search
        const range = arr.length - (arr.length * 0.30); // max search scope
        for (let i = arr.length; i > range; --i) {
            if (arr[i] === prefix) {
                const slice = arr.slice(i, (i + delta));
                if (str === slice.join()) return i; // string comparison match
            }
        }

        return null;
    };

    // find atom index
    const index = sequenceOccurrenceIndex(identifier, array);
    if (index) {
        // Uint8Array([...length[4], ...name[4], ...version[1], ...class[3]])
        const indices = {
            length: [(index - size.atom), index],
            atom: (bytes) => [(index - size.atom), ((index + size.atom) + bytes)],
        };

        const length = utility.uint8ArrayToUint32(array.slice(...indices.length));
        const atom = array.slice(...indices.atom(length));

        // extracted atom slice
        return atom;
    }

    return null;
};
