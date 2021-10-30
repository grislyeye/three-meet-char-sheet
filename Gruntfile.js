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

    copy: {
      main: {
        files: [
          {
            expand: true,
            src: [
              '**',
              '!**/.git/**',
              '!**/gh-pages/**',
              '!.gitignore',
              '!dist/**'
            ],
            dest: 'dist/html/'
          },
          {
            expand: true,
            src: ['dist/components.js'],
            dest: 'dist/html/'
          },
        ],
      },
    },

  })

  grunt.loadNpmTasks('grunt-contrib-watch')
  grunt.loadNpmTasks('grunt-contrib-clean')
  grunt.loadNpmTasks('grunt-contrib-connect')
  grunt.loadNpmTasks('grunt-contrib-copy')

  grunt.registerTask('start', ['connect', 'watch'])
}
