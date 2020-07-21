const isNodeOrString = (i) => (i instanceof Node || typeof i === 'string');

// hyperscript-esque depth-first templater
export default (name, attributes = {}, children) => {
    const root = document.createElement(name);
    Object.entries(attributes).forEach(([key, value]) => root.setAttribute(key, value));

    if (Array.isArray(children) && children.length && !children.some((i) => !isNodeOrString(i))) {
        root.append(...children);
    } else if (isNodeOrString(children)) root.append(children);

    return root;
};
