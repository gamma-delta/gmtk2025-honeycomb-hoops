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
    sidebar: `Welcome to Honeycomb Hoops!
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
require the line to go straight through.)`,
  },
  {
    source: `
 . .
. X K
 K . `,
    sidebar: `Black squares require the
line to cross itself exactly once over
them. The line cannot cross anywhere
else! And remember that it still must
form one continuous loop.

The line has to make an "X" shape,
not a "K" or the inside of a
peace sign.`,
  },
  {
    source: `
  . O .
 . X . .
. . O . .
 O . . .
  . . K `,
    sidebar: `Let's try a few puzzles
with just those pieces.`
  },
  {
    source: `
  . O .
 . X . .
K O K . K
 . K . .
  . O K `,
    sidebar: `By the way, if you want to
make your own hex-based games,
check out RedBlobGames' hex tutorial.
It's everything you could ever want
to know about hexagons. This game, as
well as many of my other projects,
would be impossible without his work.`,
  },
  {
    source: `
  K K K
 . X O .
. X . . .
 . O K O
  . . . `,
    sidebar: `This game is made
in Typescript, and uses the
browser's canvas API. In other
words, there's no game engine!
I like making jam games like this
because there's nothing for the
user to download, and it works
on everyone's computers
regardless of their OS.

The source code is available
on Github. I apologize for the
hideousness of src/puzzle.ts.`,
  },
  {
    source: `
  . . .
 . X X .
. X . X .
 . . X .
  . . . `,
    sidebar: `If you like this
game and haven't heard of
Masyu, I highly recommend it.
You can find free puzzles online.

It's a lot like this game,
but designed by someone who
designs pencil and paper games
for a living.

Which is to say, it's a lot
like this game but better.`,
  },
  {
    source: `
  . . .
 . X . .
K K K K K
 . . . .
  . O . `,
    sidebar: `Seriously, I can't
recommend Masyu enough. Also,
I'm running out of things to
put in these sidebars.`,
  },

  // Row 2
  {
    source: `
  . . .
 . X . .
. . 6 . .
 . . . .
  . . . `,
    sidebar: `Here's the last mechanic.
Numbers must not be drawn on.
Instead, the line must cross
between the hexes circling
it the given number of times,
always "hugging" the number.

I recognize this makes no sense,
so here's a few tutorial puzzles.`,
  },
  {
    source: `
  . . .
 . . . .
. . 3 . 2
 . . . .
  . . . `,
    sidebar: `Again, you want the line to
"hug" the number. A 6 (like
in the last puzzle) needs to
be surrounded on all sides.
A 3 needs to be surrounded
on exactly 3 contiguous
sides, like it's sitting
in a little cup.

Any other lines surrounding
the number is fine; it just
needs to have (at least)
one stretch of that many
contiguous hugging segments.`,
  },
  {
    source: `
  1 . 2
 . . . .
. . . . 1
 . X . .
  . . . `,
    sidebar: `If you want to
read or play the previous
tutorials, just go back to
the level select.

It helps to look at the
boundaries between hexes
when working with numbers.
Of the hexes surrounding
a number, you want the line
to pass through that many
hex walls.`,
  },
  {
    source: `
  . K .
 . . O .
. O 1 . .
 K . O K
  . . . `,
    sidebar: `One more number
tutorial for good luck.

Thanks to members of my
Discord server for giving me
feedback. (The feedback was
"The numbers, Petra, what
do they mean?")

Your solution will have the
line "hugging" the 1 several
times. This is OK as long
as it only does so for 1
tile at a time.`,
  },
  {
    source: `
  . . .
 . . . 3
1 . 1 . .
 . . . .
  K K K `,
    sidebar: `Back to these
sidebars being kibitzing.

This is the first
game that I tried to put
"juice" into. This is why I
decided to make it so minimal;
I didn't want to try to make
something bombastic because
I didn't want to bite off
more than I could chew.

If the sound effects feel
familiar somehow, that's
because they're from
Google's Material Design
framework. (CC-BY 4.0!)`,
  },
  {
    source: `
  . O .
 . 2 . .
. . K . .
 . O X .
  . . . `,
    sidebar: `There's not actually any
graphical assets in this game,
only sounds. All the graphics
are drawn with primitive shapes.

This means I don't have to draw
any textures (score!) and also
means that I can make the canvas
as big as I like without having
jaggy pixels.`,
  },
  {
    source: `
  . . .
 . 4 . .
. . . 2 .
 . . . .
  . 3 . `,
    sidebar: `I implemented numbers
last, which is why there's
a lot of puzzles without
them.

The other rules in this
game only mandate what
happens on their hex,
but the numbers mandate
what happens on themselves
and the 6 hexes surrounding
each of them. This means
there's ~7x possibilities
and restrictions created
by each number piece.

I felt I needed a
piece that created
more complexity.
Without it, I felt
like I had to put
a whole bunch of
random black circles
everywhere to corral
the line into place.`,
  },
  {
    source: `
  . . .
 . . 5 .
1 . . . .
 . K K .
  . . . `,
    sidebar: `If you know the rules of
original Masyu, you'll
note that the pieces
both mandate what
happens on themself
and the 4 squares
surrounding them.

In other words, every
piece has this "extra
reach" I was talking
about in the last
sidebar.

Maybe that's why Masyu
puzzles can be so hard
even on a small grid
with few pieces.`,
  },

  // Row 3
  {
    source: `
  K . .
 . O . .
. . . X K
 . O . .
  K . . `,
    sidebar: `Row 3 of puzzles!
There's no new mechanic
here, just more puzzles.`
  },
  {
    source: `
  . . .
 . . . O
K X X X K
 . . . .
  . O . `,
    sidebar: `Non-video game design
is something I'm quite
interested by, and I
feel like video game
designers could learn
a lot from them. In fact,
I don't know if I've seen
a single video on Youtube
talking about board game
design through the lens of
a video game designer.

Mark, in the offchance
you're reading this,
maybe you're interested
in this topic too :]`,
  },
  {
    source: `
  K . K
 . O . .
K . X K 1
 O . . .
  . O . `,
    sidebar: `For a while I was
considering making this game
bee-themed, where you're figuring
out the little bee dance you have
to do to tell your hive-mates
where the honey is, or whatever.

I dropped the idea pretty
quickly because I did not want
to texture all of that.

Even if I had gone for it,
I think it would have looked
worse than the game as-is.
The simple, clean look I
decided on is much easier
to make look professional.

Hopefully you agree.`,
  },
  {
    source: `
  K K K
 K K K K
K K 0 K K
 K K K K
  K K K `,
    sidebar: `Wheeeeeee!`,
  },
  {
    source: `
  . . .
 . . . .
. . O O .
 . . O .
  K K K `,
    sidebar: `I had the idea for
this game years ago, after
playing a few of the
Zachtronics pen-and-paper
games. I had originally
imagined it as research
mechanic for my Minecraft
mod Hex Casting, as the
way you discover great
spells. The solution to
the puzzle would be
the spell pattern!

I scrapped the idea
because I would have to
generate puzzles with
unique solutions at
runtime (because the
great spell patterns
are randomized based
on the world seed).`,
  },
  {
    source: `
  . . .
 . X . .
. . O 3 .
 . X . .
  . . . `,
    sidebar: `A lot of these
puzzles have multiple
solutions, probably.
I did my best to make
sure that solving each
one is interesting, even
if the solution isn't
unique.

Implementing numbers
made enforcing one
solution much easier.`,
  },
  {
    source: `
  . . .
 . O O .
. X K X .
 . O O .
  . . . `,
    sidebar: `As of time of
writing, this is my
favorite level in the
game. I like how it
forces you to make
something asymmetrical
even though the puzzle
is symmetrical.

(Spoilers, I guess.)`,
  },
  {
    source: `
  . O .
 . . K .
. . 0 K .
 . K . .
  . O . `,
    sidebar: `Did you submit
a game to the jam? If so,
put a link in the comments
and I'll go take a look
at it. (Unless that's not
allowed, in which case, I'm
still rooting for you!)`,
  },

  // Row 3
  {
    source: `
   K . . K
  . . . . .
 . . O O . .
K . O . O K .
 . . O O . .
  . X X X .
   . . . .`,
    sidebar: `Here come the
radius 4 puzzles.
I'n not sure if this
actually makes the game
better in any way,
but I wrote an engine
that works on any size
of hex grid, so I
might as well use it.`,
  },
  {
    source: `
   . . . .
  . 0 . . .
 . . 2 . . .
. . . K . . .
 . . . 5 . .
  . . X . .
   . . . .`,
    sidebar: `I'm running out of
things to say, frankly.

I hope you're having a
good day. If you've been
binging a bunch of the
games, make sure to get
up and drink some water!`,
  },
  {
    source: `
   1 . . 2
  . . . X .
 . . . X . .
2 . . X . . 1
 . . X . . .
  . X . . .
   . . . 2`,
    sidebar: `Come to think
of it I should go get
some water too.`,
  },
  {
    source: `
   . . . K
  . 0 0 . .
 . 1 . . . .
. 0 . K . . .
 . 1 . O . .
  . 0 1 . .
   . . . K`,
    sidebar: `Hexxy`,
  },
  {
    source: `
   . . . .
  . K . . .
 . 1 . . . .
. K . X . K .
 . . . . 1 .
  . 5 . K .
   . . . .`,
    sidebar: `Now I'm REALLY
out of things to talk about.`,
  },
  {
    source: `
   . . . .
  . . . . .
 . O . K . .
. . . 5 K . .
 . O . K . .
  . X . . .
   . . . .`,
    sidebar: `Water update:
I got some water.
This has been your petrak@
water update. Stay tuned for
petrak@ food updates.`,
  },
  {
    source: `
   K . . K
  . K . K .
 . . . . . .
K K . 5 . K K
 . . . . . .
  . K . K .
   K . . K`,
    sidebar: `Food update:
I got some food.
(Peanut butter and honey sandwich.)

Adding a sidebar message
to each puzzle felt like
a much better idea about
20 puzzles ago.`,
  },
  {
    source: `
   . . . .
  . 5 . . .
 . . . O . .
. . O X . . .
 . . . O . .
  . 3 . 4 .
   . . . .`,
    sidebar: `Last level!
You can do it!`,
  },
]
