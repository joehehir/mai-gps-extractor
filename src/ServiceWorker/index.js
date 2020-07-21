import { name } from '../../package.json';

const ServiceWorker = new class {
    /* eslint-disable class-methods-use-this */
    register() {
        if ('serviceWorker' in navigator) {
            const register = () => {
                window.removeEventListener('load', register);
                navigator.serviceWorker.register(`${name}.sw.js`);
            };
            window.addEventListener('load', register);
        }
    }
    /* eslint-enable class-methods-use-this */
}();

export { ServiceWorker as default };
