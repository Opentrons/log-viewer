import path from "path"

import { flattenDeep, last } from "lodash"
import type {Font} from 'fontkit'

import { FONTS } from "./constants"
import type { AvailableFont, LoadedFonts, FontStyle, FontWeight, StringChunk } from "./types"

export async function loadFonts(): Promise<LoadedFonts> {
  const eachFont = flattenDeep(Object.values(FONTS).map((vals) => Object.values(vals)))
  return Promise.all(
    eachFont.map(async (fontName) => {
      const response = await fetch(path.join("assets", "fonts", `${fontName}.ttf`))
      if (!response.ok) {
        throw new Error(`Failed to load font ${fontName}: ${response.statusText}`)
      }
      const fontData = await response.arrayBuffer()
      return { fontName: await doc.embedFont(fontData) }
    }),
  ).then((results) => results.reduce((acc, val) => ({ ...acc, ...val }), {}) as LoadedFonts)
}

export function fontsForLine(
  content: string,
  style: FontStyle,
  weight: FontWeight,
  fonts: LoadedFonts,
): StringChunk[] {
  return [...content].reduce((stringChunks, char) => {
    const font = fontFor(char, style, weight, fonts)
    if (stringChunks.length === 0) {
      return [...stringChunks, { contentSegment: char, font }]
    } else {
      const currentChunk = last(stringChunks)!
      if (currentChunk.font.name === font.name) {
        currentChunk.contentSegment.concat(char)
        return [...stringChunks.slice(0, stringChunks.length - 1), currentChunk]
      } else {
        return [...stringChunks, { contentSegment: char, font }]
      }
    }
  }, [] as StringChunk[])
}

export function fontFor(
  content: string,
  style: FontStyle,
  weight: FontWeight,
  fonts: LoadedFonts,
): PDFFont {
  const familySequence = FONTS[style][weight]
  for (const fontName of familySequence) {
    const loaded = fonts[fontName]
    if (loaded != null) {
      if (
        [...content].reduce(
          (acc, char) => acc && loaded.getCharacterSet().includes(char.codePointAt(0) || 0),
          true,
        )
      ) {
        return loaded
      }
    }
  }
  return fonts[last(familySequence)]
}
