module.exports = function (grunt) {
  'use strict'

  grunt.initConfig({

    watch: {
      options: {
        livereload: true
      },
      html: {
        files: ['index.html', 'main.css', 'package.json']
      }
    },

    clean: {
      release: ['dist']
    },

    connect: {
      server: {
        options: {
          port: 8000,
          base: './',
          hostname: 'localhost',
          livereload: true
        }
      }
    },

  })

  grunt.loadNpmTasks('grunt-contrib-watch')
  grunt.loadNpmTasks('grunt-contrib-clean')
  grunt.loadNpmTasks('grunt-contrib-connect')

  grunt.registerTask('start', ['connect', 'watch'])
}
