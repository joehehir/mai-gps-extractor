import definition from './definition';
import extractAtom from './extract-atom';
import outputContentBlob from './output-content-blob';
import unpackAtomData from './unpack-atom-data';

const reject = (name, err) => {
    self.postMessage({
        name,
        // structured clone algorithm compatible type conversion
        response: err.toString(),
    });
};

const extract = (e) => {
    const { data: { name, extension, buffer } } = e;

    // --- Worker-Timing --- //
    const duration = (() => {
        const start = self.performance.now();
        return {
            end: () => (self.performance.now() - start),
        };
    })();

    // Uint8Array conversion
    const array = new Uint8Array(buffer);
    const identifier = new TextEncoder('utf-8').encode(definition.atom);

    let atom = extractAtom(identifier, array);
    if (atom) {
        // remove preamble
        atom = atom.slice(definition.size.preamble);

        const frames = unpackAtomData(definition.size.frame, definition.struct, atom);
        const response = outputContentBlob(extension, frames);

        self.postMessage({
            name,
            response,
            duration: duration.end(),
        });
        return;
    }

    reject(name, new RangeError('"GPS " atom not present or unreadable.'));
};

// attach events
Object.entries({
    error: reject,
    message: extract,
}).forEach((e) => self.addEventListener(...e, false));
