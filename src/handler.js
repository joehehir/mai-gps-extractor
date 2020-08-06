import expected from './expected';
import FileObject from './FileObject';

export default (args) => {
    // validate arguments
    if (!expected(args)) return;

    const {
        extension,
        nodes: {
            form,
            input,
            ul,
            template,
        },
    } = args;

    const accept = input.getAttribute('accept');
    const indicator = template.content.querySelector('svg.indicator');

    // event callback
    const drop = (e) => {
        const { dataTransfer } = e;
        if (dataTransfer) { // drop event specific
            e.stopPropagation();
            e.preventDefault();
        }

        const files = (dataTransfer) ? dataTransfer.files : e.target.files;
        if (!(accept && files && files.length)) return;

        /* eslint-disable no-restricted-syntax */
        // create component instances
        for (const file of files) {
            // verify file type
            if (file.type === accept) {
                // clone inline template 'svg.indicator'
                const clone = indicator.cloneNode(true);

                const ref = new FileObject({
                    file,
                    extension,
                    parentNode: ul,
                    indicator: clone,
                });

                // !note: cache and manage references
                console.log('File:', ref.file);
            }
        }
        /* eslint-enable no-restricted-syntax */
    };

    // event callback
    const dragover = (e) => {
        e.stopPropagation();
        e.preventDefault();

        // apply cursor appearance
        e.dataTransfer.dropEffect = 'copy';
    };

    // attach event listeners
    form.addEventListener('dragover', dragover, false);
    form.addEventListener('drop', drop, false);
    input.addEventListener('change', drop, false);
};
