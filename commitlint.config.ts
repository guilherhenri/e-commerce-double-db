export default {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'type-enum': [
      2,
      'always',
      [
        'feat',
        'fix',
        'docs',
        'style',
        'refactor',
        'test',
        'chore',
        'build',
        'ci',
        'perf',
      ],
    ],
    'subject-max-length': [2, 'always', 50],
    'scope-case': [2, 'always', 'lower-case'],
  },
  ignores: [
    (message) =>
      message.includes('[skip ci]') || message.includes('chore(release)'),
  ],
}
