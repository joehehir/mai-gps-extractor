import './styles/index.less';
import handler from './handler';
// import { ServiceWorker } from './ServiceWorker';

// check browser support
if (![
    'File',
    'FileList',
    'FileReader',
    'Promise',
    'Worker',
].some((obj) => !window[obj])) {
    // ServiceWorker.register();

    // map selectors array to node references
    const nodes = IDX_SELECTORS.reduce((acc, cur) => {
        const key = cur.replace(/-\w+$/, ''); // remove hash
        return { ...acc, [key]: document.getElementById(cur) };
    }, {});

    handler({
        extension: 'srt', // output file extension
        nodes,
    });
} else {
    console.error('UnsupportedBrowser');
}
