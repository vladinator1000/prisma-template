module.exports = {
  '*.{js,ts}': ['prettier --write', 'eslint', 'git add'],
  '*.{ts}': () => 'npm run ts',
  '*.{prisma}': () => 'yarn prisma format',
}
