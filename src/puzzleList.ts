export type PuzzlePack = {
  source: string,
  sidebar: string,
}

export const puzzlePacks: PuzzlePack[] = [
  {
    source: `
 . .
. O .
 . . `,
    sidebar: `Welcome to Hexagon Hoops!
This is a pencil-and-paper-style game
inspired by Masyu (and not, as the
name suggests, a cereal brand).

To beat a puzzle, draw a single,
closed, non-interesecting loop
(hey reference!) on the grid by
clicking and dragging with your
mouse. You can drag over an existing
line to remove it.

The loop must touch every marked
shape on the board. White circles
must have the line go straight
through them, without turning.
`,
  },
  {
    source: `
 K K
. O .
 . K `,
    sidebar: `Black circles require the
line to turn on them; it cannot go
straight through. (As a reminder,
white circles are the opposite, and
require the line to go straight through.)

These tutorial puzzles have a few
different solutions each, but the
later ones should have exactly one,
if I do my job right.`,
  },
  {
    source: `
 . .
. X K
 K . `,
    sidebar: `Finally, black squares
require the line to cross itself on
them. The line cannot cross anywhere
else! And remember that it still must
form one continuous loop.`,
  },
  {
    source: `
  . O .
 . . . .
K . . O .
 K X X .
  K . . `,
    sidebar: "",
  }
]
