module.exports = function(eleventyConfig) {
  eleventyConfig.addPassthroughCopy('./demo/*.*');
  eleventyConfig.addPassthroughCopy('./web_modules/**/*.js');
  eleventyConfig.addPassthroughCopy('./generic-*.js');
  eleventyConfig.addPassthroughCopy('./utils/*.js');
  eleventyConfig.addPassthroughCopy('./generic-*/**/*.js');

  return {
    dir: { input: './', output: './_site' },
    passthroughFileCopy: true,
  };
};
