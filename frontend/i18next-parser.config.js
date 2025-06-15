module.exports = {
  locales: ['vi', 'en'],
  output: 'i18n/locales/$LOCALE.json',
  input: ['app/**/*.{ts,tsx}', 'components/**/*.{ts,tsx}'],
  defaultValue: '',
  keySeparator: false,
  namespaceSeparator: false,
};
