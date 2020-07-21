import {
    name,
    version,
} from '../../../package.json';
import er from './catch(er)';

const CACHE_KEY = `${name}?${version}`;
const CACHE_FILES = [
    // ...
];

// console.info
const gearEmoji = String.fromCodePoint(0x2699);

const install = (event) => {
    console.info(`${gearEmoji} [install]: "${event}"`);

    event.waitUntil( // add static files to cache
        caches.open(CACHE_KEY).then((cache) => cache.addAll(CACHE_FILES)).catch(er),
    );
};

const activate = (event) => {
    console.info(`${gearEmoji} [activate]: "${event}"`);

    // remove obsolete caches using package version
    const reset = async () => {
        const obsolete = await caches.keys().then((keys) => keys.filter((key) => (
            (key.startsWith(`${name}?`) && key !== CACHE_KEY) // package specific
        ))).catch(er);

        return Promise.all(obsolete.map(caches.delete)).catch(er);
    };

    event.waitUntil(reset());
};

const fetch = (event) => {
    console.info(`${gearEmoji} [fetch]: "${event}"`);

    event.respondWith(
        caches.open(CACHE_KEY).then((cache) => fetch(event.request).then((response) => {
            cache.put(event.request, response.clone());
            return response;
        })).catch(er),
    );
};

// attach event listeners
Object.entries({
    install,
    activate,
    fetch,
}).forEach((e) => window.self.addEventListener(...e));
