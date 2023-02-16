export function getTextBetweenParentheses(text: string) {
  const stack = [];
  let result = '';
  let start = false;

  for (let i = 0; i < text.length; i++) {
    switch (text[i]) {
      case '(':
        stack.push('(');
        if (!start) {
          start = true;
          continue;
        }
        result += text[i];
        break;
      case ')':
        if (stack[stack.length - 1] === '(') {
          stack.pop();
          if (stack.length === 0) {
            start = false;
            continue;
          }
          result += text[i];
        } else {
          //not balanced!
        }

        break;
      default:
        if (start) {
          result += text[i];
        }
    }
  }
  return result;
}

export function findOpenParen(text: string, closePos: number) {
  if (text[closePos] !== ')') {
    return -1;
  }
  let openPos = closePos;
  let counter = 1;
  while (counter > 0 && openPos > 0) {
    const c = text[--openPos];
    if (c == '(') {
      counter--;
    } else if (c == ')') {
      counter++;
    }
  }

  if (counter === 0) {
    return openPos;
  }

  return -1;
}

export function findClosingParen(text: string, openPos: number) {
  if (text[openPos] !== '(') {
    return -1;
  }
  let closePos = openPos;
  let counter = 1;
  while (counter > 0 && closePos < text.length - 1) {
    const c = text[++closePos];
    if (c == '(') {
      counter++;
    } else if (c == ')') {
      counter--;
    }
  }

  if (counter === 0) {
    return closePos;
  }

  return -1;
}
