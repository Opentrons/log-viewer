import { rgb } from "pdf-lib"

/**
 * The list of fonts we know about and embed in the PDF.
 *
 * This is collated by text style. The leaf entries are arrays that are in preference order,
 * and the earliest array entry that encodes an entire string should be used for that string.
 */
export const FONTS = {
  normal: {
    light: [
      "public-sans-latin-300-normal",
      "public-sans-latin-ext-300-normal",
      "GoNotoCurrent-Regular",
    ] as const,
    regular: [
      "public-sans-latin-400-normal",
      "public-sans-latin-ext-400-normal",
      "GoNotoCurrent-Regular",
    ] as const,
    "semi-bold": [
      "public-sans-latin-600-normal",
      "public-sans-latin-ext-600-normal",
      "GoNotoCurrent-Bold",
    ] as const,
    bold: [
      "public-sans-latin-700-normal",
      "public-sans-latin-ext-700-normal",
      "GoNotoCurrent-Bold",
    ] as const,
  } as const,
  italic: {
    light: [
      "public-sans-latin-300-italic",
      "public-sans-latin-ext-300-italic",
      "GoNotoCurrent-Regular",
    ] as const,
    regular: [
      "public-sans-latin-400-italic",
      "public-sans-latin-ext-400-italic",
      "GoNotoCurrent-Regular",
    ] as const,
    "semi-bold": [
      "public-sans-latin-600-italic",
      "public-sans-latin-ext-600-italic",
      "GoNotoCurrent-Bold",
    ] as const,
    bold: [
      "public-sans-latin-700-italic",
      "public-sans-latin-ext-700-italic",
      "GoNotoCurrent-Bold",
    ] as const,
  } as const,
} as const

export const COLOR_BLACK = rgb(0, 0, 0)
