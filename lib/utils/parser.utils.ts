import { NodeType, SyntaxNodeRef, Tree } from "@lezer/common";
import { BlockContext, LeafBlock, LeafBlockParser, MarkdownConfig } from "@lezer/markdown";
import { tags as t } from "@lezer/highlight";

export const Abbreviations = {
  H1: "ATXHeading1",
  H2: "ATXHeading2",
  H3: "ATXHeading3",
  H4: "ATXHeading4",
  H5: "ATXHeading5",
  H6: "ATXHeading6",
  CB: "CodeBlock",
  FC: "FencedCode",
  Q: "Blockquote",
  HR: "HorizontalRule",
  BL: "BulletList",
  OL: "OrderedList",
  LI: "ListItem",
  HB: "HTMLBlock",
  P: "Paragraph",
  BR: "HardBreak",
  Em: "Emphasis",
  St: "StrongEmphasis",
  Im: "Image",
  C: "InlineCode",
  HT: "HTMLTag",
  CM: "Comment",
  q: "QuoteMark",
  l: "ListMark",
  L: "LinkMark",
} as const

export type Abbreviation = keyof typeof Abbreviations;



export function renderHtmlTree(tree: Tree) {
  let lists = ''
  tree.iterate({
    enter({ type, from, to }: SyntaxNodeRef) {
      lists += `<ul><li>${type.name} (${from},${to})`
    },
    leave({ type, from, to }: SyntaxNodeRef) {

      lists += '</ul>'
    }
  })
  return lists;
}

export function chunkByAbbreviationType(tree: Tree, input: string, abbr: Abbreviation) {
  const chunks: string[] = [];
  let lastPosition = 0;
  tree.iterate({
    enter({ type, from, to }: SyntaxNodeRef) {
      if (type.name == Abbreviations[abbr]) {
        chunks.push(input.substring(lastPosition, from))
        lastPosition = to;
      }
    },
    leave({ type, from, to }: SyntaxNodeRef) {
    }
  })
  return chunks.length > 0 ? chunks : [input];
}
export type ParsedQuestion = { type?: { name: string }, header: string, content: string, nextHeader: string, options: string[] };
export type QuestionHtml = ParsedQuestion & { contentHtml: string }
export type State = { position: number, node?: { type: NodeType, from: number, to: number }, options: string[], excludeChunks: PositionChunk[] }
export function generateHeadingsList(tree: Tree, input: string) {

  const children: ParsedQuestion[] = [];
  const isHeading = (type: NodeType) => type.name == Abbreviations.H1 || type.name == Abbreviations.H2;
  let lastState: State = { position: 0, options: [], excludeChunks: [] }

  tree.iterate({
    enter({ type, from, to }: SyntaxNodeRef) {
      if (isHeading(type) || (type.name == Abbreviations.HR)) {

        const computedExcludeChunks = lastState.excludeChunks.map(d => ({
          from: d.from - lastState.position,
          to: d.to - lastState.position,
        }))

        children.push({
          nextHeader: input.substring(from, to),
          type: lastState.node != null ? lastState.node?.type : { name: "HorizontalRule" },
          header: lastState.node != null && lastState.node.type.name != Abbreviations.HR ? input.substring(lastState.node.from, lastState.node.to) : '',
          content: excludeChunks(input.substring(lastState.position, from), computedExcludeChunks),
          options: lastState.options
        })
        lastState = { position: to, node: { type, from, to }, options: [], excludeChunks: [] };
      }
    
      if (type.name == "Option") {
        lastState.options?.push(input.substring(from, to))
      }

    },
    leave({ type, from, to }: SyntaxNodeRef) {
      if (type.name == Abbreviations.BL &&  lastState.options?.length > 0) {        
        lastState.excludeChunks.push({ from, to })

      }
    }
  })
  return children;
}


export const OptionList: MarkdownConfig = {
  defineNodes: [
    { name: "Option", block: true, style: t.list },
    { name: "OptionMarker", style: t.atom }
  ],
  parseBlock: [{
    name: "OptionList",
    leaf(cx, leaf) {
      return /^\[[\w\d]*\][ \t]/.test(leaf.content) && cx.parentType().name == "ListItem" ? new OptionParser : null
    },
    after: "SetextHeading"
  }]
}
class OptionParser implements LeafBlockParser {
  nextLine() { return false }

  finish(cx: BlockContext, leaf: LeafBlock) {
    cx.addLeafElement(leaf, cx.elt("Option", leaf.start, leaf.start + leaf.content.length, [
      cx.elt("OptionMarker", leaf.start, leaf.start + 3),
      ...cx.parser.parseInline(leaf.content.slice(3), leaf.start + 3)
    ]))
    return true
  }
}

export const ShortCodeMarker: MarkdownConfig = {
  defineNodes: [{
    name: "ShortCodeMarker",
    style: t.atom
  }],
  parseInline: [{
    name: "ShortCodeMarker",
    parse(cx, next, pos) {
      let match: RegExpMatchArray | null
      if (next != 123 /* '{' */ || !(match = /^[a-zA-Z_0-9\.]+\}/.exec(cx.slice(pos + 1, cx.end)))) return -1
      return cx.addElement(cx.elt("ShortCodeMarker", pos, pos + 1 + match[0].length))
    },
  }]
}

export function extractContentInSquareBrackets(inputString: string) {
  const regex = /^\[([\w\d]*)\][ \t]/; // Regular expression to match content inside square brackets
  const match = inputString.match(regex);

  // If there is a match, return the content inside square brackets (group 1)
  return match ? match[1] : null;
}


export type PositionChunk = {
  from: number;
  to: number;
};

export function excludeChunks(inputString: string, chunks: PositionChunk[]): string {
  if (chunks.length === 0) {
    return inputString; // No chunks to exclude, return the original string
  }

  // Sort chunks by start index in descending order
  const sortedChunks = chunks.sort((a, b) => b.from - a.from);

  let result = inputString;
  for (const chunk of sortedChunks) {
    const { from: start, to: end } = chunk;
    
    // Ensure start and end indices are within the bounds of the string
    if (start >= 0 && end <= result.length && start <= end) {
      // Exclude the chunk from the result string
      result = result.slice(0, start) + result.slice(end);
    }
  }

  return result;
}