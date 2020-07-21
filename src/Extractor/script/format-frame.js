import utility from './utility';

// value formatting functions
const format = (key, ...value) => {
    const reverse = (v) => `${v}`.split('').reverse().join('');

    const map = {
        'geocode-dd': (arg) => { // expect: 5055505
            if (!(arg.length === 2)) return arg;
            return `${arg[1]}${arg[0].toString().replace(/(\d{5})$/, '.$1')}`;
        },
        'geocode-dms': (arg) => {
            if (!(arg.length === 2)) return arg;
            const formatted = reverse(reverse(arg[0]).replace(/^(\d{1})(\d{2})(\d{2})/, '$1.$2\'$3°'));
            return `${formatted}"${arg[1]}`;
        },
        speed: (arg) => `${Math.round(+(arg[0] / 1000).toFixed(1))} km/h`, // expect: 60972
    };

    return map[key](value);
};

export default (frame) => {
    // restructure frame object and discard extraneous properties
    const restructure = {
        index: utility.uint8ArrayToUint32(frame.index, 1),
        speed: format(
            'speed',
            utility.uint8ArrayToUint32(frame.speed, 1),
        ),
        latitude: format(
            'geocode-dd',
            utility.uint8ArrayToUint32(frame.latitude, 1),
            String.fromCodePoint(frame['latitude-cardinal']),
        ),
        longitude: format(
            'geocode-dd',
            utility.uint8ArrayToUint32(frame.longitude, 1),
            String.fromCodePoint(frame['longitude-cardinal']),
        ),
    };

    return restructure;
};
