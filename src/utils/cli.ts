/* istanbul ignore file */

// Mostly copied from https://github.com/stevenvachon/cli-clear/blob/master/index.js
const isWindows = process.platform.indexOf('win') === 0;

export function clearStdOut() {
  let i;
  let lines;
  let stdout = '';

  if (isWindows === false) {
    stdout += '\x1B[2J';
  } else {
    // @ts-ignore
    lines = process.stdout.getWindowSize()[1];

    for (i = 0; i < lines; i++) {
      stdout += '\r\n';
    }
  }

  // Reset cursur
  stdout += '\x1B[0f';

  process.stdout.write(stdout);
}
