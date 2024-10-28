export function randomCode() {
  const letters = "abcdefghijklmnopqrstuvwxyz";
  const numbers = "0123456789";

  const numLetters = Math.floor(Math.random() * 3) + 3;

  let code = "";
  for (let i = 0; i < 8; i++) {
    if (i < numLetters) {
      code += letters[Math.floor(Math.random() * letters.length)];
    } else {
      code += numbers[Math.floor(Math.random() * numbers.length)];
    }
  }

  return code;
}

export function getRandomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

