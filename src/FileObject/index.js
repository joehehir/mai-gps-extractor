import h from './h';
import reader from './reader';
import Extractor from '../Extractor';

// ref: srt.svg { --stroke-dashoffset }
const increments = [87.5, 75, 62.5, 50, 37.5, 25, 12.5]; // ...[100]

export default class FileObject {
    constructor(args) {
        ({ // instance destructuring assignment
            file: this.file,
            extension: this.extension,
            parentNode: this.parentNode,
            indicator: this.indicator,
        } = args);

        this.template = this.render();
        this.objectURL = undefined;

        this.extract();
    }

    // update progress indicator
    update(value) {
        if (this.indicator) {
            this.indicator.style.setProperty('--stroke-dashoffset', `var(--i${value})`);
        }
    }

    // progress event callback
    progress(e) {
        const current = (((e.loaded / e.total) * 100) + 0.5) >> 0; // Math.round()
        const increment = increments.find((value) => current >= value);
        if (increment) {
            this.update(increment);
        }
    }

    error(err) {
        if (this.indicator) {
            this.indicator.classList.add('error');
        }
        console.error(err);
    }

    // set download content
    output(blob) {
        if (this.template.anchor) {
            // store reference for release
            this.objectURL = URL.createObjectURL(blob);
            this.template.anchor.setAttribute('href', this.objectURL);
            this.update(100);
        }
    }

    render() {
        // format output file name
        const download = this.file.name.replace(/[^.]+$/, this.extension);

        const trunc = (str) => ( // N02...000.mp4
            (str && str.length > 13)
                ? `${str.slice(0, 3)}...${str.slice(-7)}`
                : str
        );

        // create template
        const anchor = h('a', { class: 'link', title: download, download }, this.indicator);
        const root = h('li', { class: 'output__li', role: 'listitem' }, [
            h('span', { class: 'name', title: this.file.name }, trunc(this.file.name)),
            anchor,
        ]);
        // inject template
        this.parentNode.append(root);

        // return node references for update
        return {
            anchor,
            root,
        };
    }

    async extract() {
        const buffer = await reader(this.file, this.progress.bind(this)).catch(this.error.bind(this));
        const blob = (buffer)
            ? await Extractor.transfer(this.file.name, this.extension, buffer).catch(this.error.bind(this))
            : null;

        if (blob) this.output(blob);
    }

    destroy() { // remove references
        this.template.root.remove();
        URL.revokeObjectURL(this.objectURL);
    }
}
