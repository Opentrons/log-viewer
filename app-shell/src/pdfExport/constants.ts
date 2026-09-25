import range from 'lodash/range'

/**
 * The list of fonts we know about and can embed in the PDF if needed.
 */
export const FONTS = {
    normal: [
        '/assets/fonts/public-sans-latin-wght-normal.woff2',
        '/assets/fonts/public-sans-latin-ext-wght-normal.woff2',
        '/assets/fonts/public-sans-vietnamese-wght-normal.woff2',
        ...range(1, 101).map(entry => `/assets/fonts/noto-sans-sc-${entry}-wght-normal.woff2`),
        ...range(1, 101).map(entry => `/assets/fonts/noto-sans-jp-${entry}-wght-normal.woff2`),
        ...range(1, 101).map(entry => `/assets/fonts/noto-sans-kr-${entry}-wght-normal.woff2`),
    ],
  italic: [
        '/assets/fonts/public-sans-latin-wght-normal.woff2',
        '/assets/fonts/public-sans-latin-ext-wght-normal.woff2',
        '/assets/fonts/public-sans-vietnamese-wght-normal.woff2',
        ...range(1, 101).map(entry => `/assets/fonts/noto-sans-sc-${entry}-wght-normal.woff2`),
        ...range(1, 101).map(entry => `/assets/fonts/noto-sans-jp-${entry}-wght-normal.woff2`),
        ...range(1, 101).map(entry => `/assets/fonts/noto-sans-kr-${entry}-wght-normal.woff2`),
    ]
}

