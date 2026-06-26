function computeFactorial(n) {
  let result = 1;
  for (let i = 2; i <= n; i++) {
    result *= i;
  }
  return result;
}

export async function calculateFactorial(num) {
  const start = Date.now();
  let result = computeFactorial(num);

  console.log(`calculateFactorial() took: ${Date.now() - start}ms`);
  return result;
}
