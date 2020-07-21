// convert to number
/* eslint-disable-next-line arrow-body-style */
const uint8ArrayToUint32 = (arr, littleEndian = undefined) => {
    return new DataView(new Uint8Array(arr).buffer).getUint32(0, littleEndian);
};

export default {
    uint8ArrayToUint32,
};
