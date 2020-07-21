export default {
    atom: 'GPS ', // Uint8Array([71, 80, 83, 32])
    size: {
        atom: 4, // Uint8Array([...int[4]])
        preamble: 8, // Uint8Array([...length[4], ...name[4]])
        frame: 36, // Uint8Array([...int[4], ...int[4], ...int[4], ...int[4], ...char[1], ...int[4], ...char[1], ...int[4], ...string[10]])
    },
    struct: [
        ['unused-10', -10],
        ['longitude', -4],
        ['longitude-cardinal', -1],
        ['latitude', -4],
        ['latitude-cardinal', -1],
        ['speed', -4],
        ['index', -4],
        ['unused-4', -4],
        ['set', -4],
    ],
};
