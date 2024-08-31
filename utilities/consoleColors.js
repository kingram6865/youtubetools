// Actions
const Reset = "\x1b[0m"
const Bright = "\x1b[1m"
const Dim = "\x1b[2m"
const Underscore = "\x1b[4m"
const Blink = "\x1b[5m"
const Reverse = "\x1b[7m"
const Hidden = "\x1b[8m"

// Foregrounds
const FgBlack = "\x1b[30m"
const FgRed = "\x1b[31m"
const FgGreen = "\x1b[32m"
const FgYellow = "\x1b[33m"
const FgBlue = "\x1b[34m"
const FgMagenta = "\x1b[35m"
const FgCyan = "\x1b[36m"
const FgWhite = "\x1b[37m"

// Backgrounds
const BgBlack = "\x1b[40m"
const BgRed = "\x1b[41m"
const BgGreen = "\x1b[42m"
const BgYellow = "\x1b[43m"
const BgBlue = "\x1b[44m"
const BgMagenta = "\x1b[45m"
const BgCyan = "\x1b[46m"
const BgWhite = "\x1b[47m"

// Bright Foregrounds
const brightBlack = "\x1b[30m\x1b[1m"
const brightRed = "\x1b[31m\x1b[1m"
const brightGreen = "\x1b[32m\x1b[1m"
const brightYellow = "\x1b[33m\x1b[1m"
const brightBlue = "\x1b[34m\x1b[1m"
const brightMagenta = "\x1b[35m\x1b[1m"
const brightCyan = "\x1b[36m\x1b[1m"
const brightWhite = "\x1b[37m\x1b[1m"

// Basic Combos fgOnBg

const BlackOnRed = "\x1b[41m\x1b[30m\x1b[1m"
const BlackOnGreen = "\x1b[42m\x1b[30m\x1b[1m"
const BlackOnYellow = "\x1b[43m\x1b[30m\x1b[1m"
const BlackOnBlue = "\x1b[44m\x1b[30m\x1b[1m"
const BlackOnMagenta = "\x1b[45m\x1b[30m\x1b[1m"
const BlackOnCyan = "\x1b[46m\x1b[30m\x1b[1m"
const BlackOnWhite = "\x1b[47m\x1b[30m\x1b[1m"


const RedOnBlack = "\x1b[40m\x1b[31m\x1b[1m"
const RedOnGreen = "\x1b[42m\x1b[31m\x1b[1m"
const RedOnYellow = "\x1b[43m\x1b[31m\x1b[1m"
const RedOnBlue = "\x1b[44m\x1b[31m\x1b[1m"
const RedOnMagenta = "\x1b[45m\x1b[31m\x1b[1m"
const RedOnCyan = "\x1b[46m\x1b[31m\x1b[1m"
const RedOnWhite = "\x1b[47m\x1b[31m\x1b[1m"

const greenOnBlack = "\x1b[40m\x1b[32m\x1b[1m"
const greenOnRed = "\x1b[41m\x1b[32m\x1b[1m"
const greenOnYellow = "\x1b[43m\x1b[32m\x1b[1m"
const greenOnBlue = "\x1b[44m\x1b[32m\x1b[1m"
const greenOnMagenta = "\x1b[45m\x1b[32m\x1b[1m"
const greenOnCyan = "\x1b[46m\x1b[32m\x1b[1m"
const greenOnWhite = "\x1b[47m\x1b[32m\x1b[1m"

const yellowOnBlack = "\x1b[41m\x1b[33m\x1b[1m"
const yellowOnRed = "\x1b[42m\x1b[33m\x1b[1m"
const yellowOnGreen = "\x1b[43m\x1b[33m\x1b[1m"
const yellowOnBlue = "\x1b[44m\x1b[33m\x1b[1m"
const yellowOnMagenta = "\x1b[45m\x1b[33m\x1b[1m"
const yellowOnCyan = "\x1b[46m\x1b[33m\x1b[1m"
const yellowOnWhite = "\x1b[47m\x1b[33m\x1b[1m"

const blueOnBlack = "\x1b[41m\x1b[34m\x1b[1m"
const blueOnRed = "\x1b[42m\x1b[34m\x1b[1m"
const blueOnGreen = "\x1b[43m\x1b[34m\x1b[1m"
const blueOnYellow = "\x1b[44m\x1b[34m\x1b[1m"
const blueOnMagenta = "\x1b[45m\x1b[34m\x1b[1m"
const blueOnCyan = "\x1b[46m\x1b[34m\x1b[1m"
const blueOnWhite = "\x1b[47m\x1b[34m\x1b[1m"

const magentaOnBlack = "\x1b[41m\x1b[35m\x1b[1m"
const magentaOnRed = "\x1b[42m\x1b[35m\x1b[1m"
const magentaOnGreen = "\x1b[43m\x1b[35m\x1b[1m"
const magentaOnYellow = "\x1b[44m\x1b[35m\x1b[1m"
const magentaOnBlue = "\x1b[45m\x1b[35m\x1b[1m"
const magentaOnCyan = "\x1b[46m\x1b[35m\x1b[1m"
const magentaOnWhite = "\x1b[47m\x1b[35m\x1b[1m"

const cyanOnBlack = "\x1b[41m\x1b[36m\x1b[1m"
const cyanOnRed = "\x1b[42m\x1b[36m\x1b[1m"
const cyanOnGreen = "\x1b[43m\x1b[36m\x1b[1m"
const cyanOnYellow = "\x1b[44m\x1b[36m\x1b[1m"
const cyanOnBlue = "\x1b[45m\x1b[36m\x1b[1m"
const cyanOnMagenta = "\x1b[46m\x1b[36m\x1b[1m"
const cyanOnWhite = "\x1b[47m\x1b[36m\x1b[1m"

const WhiteOnBlack = "\x1b[41m\x1b[37m\x1b[1m"
const WhiteOnRed = "\x1b[42m\x1b[37m\x1b[1m"
const WhiteOnGreen = "\x1b[43m\x1b[37m\x1b[1m"
const WhiteOnYellow = "\x1b[44m\x1b[37m\x1b[1m"
const WhiteOnBlue = "\x1b[45m\x1b[37m\x1b[1m"
const WhiteOnMagenta = "\x1b[46m\x1b[37m\x1b[1m"
const WhiteOnCyan = "\x1b[47m\x1b[37m\x1b[1m"

/*

*/

// Bright Combos


module.exports = {
  Reset,
  Bright,
  Dim,
  Underscore,
  Blink,
  Reverse,
  Hidden,
  FgBlack,
  FgRed,
  FgGreen,
  FgYellow,
  FgBlue,
  FgMagenta,
  FgCyan,
  FgWhite,
  BgBlack,
  BgRed,
  BgGreen,
  BgYellow,
  BgBlue,
  BgMagenta,
  BgCyan,
  BgWhite,
  brightBlack,
  brightRed,
  brightGreen,
  brightYellow,
  brightBlue,
  brightMagenta,
  brightCyan,
  brightWhite,
  BlackOnRed,
  BlackOnGreen,
  BlackOnYellow,
  BlackOnBlue,
  BlackOnMagenta,
  BlackOnCyan,
  BlackOnWhite,
  RedOnBlack,
  RedOnGreen,
  RedOnYellow,
  RedOnBlue,
  RedOnMagenta,
  RedOnCyan,
  RedOnWhite,
  greenOnBlack,
  greenOnRed,
  greenOnYellow,
  greenOnBlue,
  greenOnMagenta,
  greenOnCyan,
  greenOnWhite,
  yellowOnBlack,
  yellowOnRed,
  yellowOnGreen,
  yellowOnBlue,
  yellowOnMagenta,
  yellowOnCyan,
  yellowOnWhite,
  blueOnBlack,
  blueOnRed,
  blueOnGreen,
  blueOnYellow,
  blueOnMagenta,
  blueOnCyan,
  blueOnWhite,
  magentaOnBlack,
  magentaOnRed,
  magentaOnGreen,
  magentaOnYellow,
  magentaOnBlue,
  magentaOnCyan,
  magentaOnWhite,
  cyanOnBlack,
  cyanOnRed,
  cyanOnGreen,
  cyanOnYellow,
  cyanOnBlue,
  cyanOnMagenta,
  cyanOnWhite,
  WhiteOnBlack,
  WhiteOnRed,
  WhiteOnGreen,
  WhiteOnYellow,
  WhiteOnBlue,
  WhiteOnMagenta,
  WhiteOnCyan
}
