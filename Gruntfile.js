module.exports = function (grunt) {
  grunt.initConfig({
    svgstore: {
      options: {
        formatting: {
          indent_size: 2
        },
        cleanup: ['fill', 'style', 'stroke']
      },
      default: {
        files: {
          './src/assets/svg-store/store.svg': ['./src/svgs/*.svg']
        }
      },
    },
  });
  grunt.loadNpmTasks('grunt-svgstore');
  grunt.registerTask('default', ['svgstore']);
};
