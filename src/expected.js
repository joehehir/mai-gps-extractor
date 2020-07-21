// validate arguments against expected values
export default (args) => {
    const validators = {
        extension: (str) => (typeof str === 'string' && str.length), // String
        nodes: (obj) => (!Object.values(obj).some((node) => !(node instanceof Node))), // DOM Node
    };

    return (!Object.entries(validators).some(([key, test]) => !(args[key] && test(args[key]))));
};
