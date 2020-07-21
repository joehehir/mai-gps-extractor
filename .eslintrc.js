module.exports = {
    env: {
        browser: true,
    },
    extends: ['airbnb-base'],
    rules: {
        indent: ['error', 4],
        'max-len': ['error', {
            ignoreComments: true,
            code: 160,
        }],
        'prefer-promise-reject-errors': 0,
        'no-restricted-globals': 0,
        'no-plusplus': 0,
        'no-console': 0,
        'no-bitwise': 0,
    },
    globals: { // webpack.DefinePlugin
        IDX_SELECTORS: 'readonly',
    },
};
