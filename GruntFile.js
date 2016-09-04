/*global module:false*/
module.exports = function (grunt) {
    
    //Load Grunt Plugins
    require('load-grunt-tasks')(grunt);
    
    //Configuration
    grunt.initConfig({

        pkg: grunt.file.readJSON('package.json'), //read content from package.json

        //Banner
        banner:
        '/*! <%= pkg.name %> - v<%= pkg.version %> - ' +
        '<%= grunt.template.today("yyyy-mm-dd") %>\n' +
        '<%= pkg.homepage ? "* " + pkg.homepage + "\\n" : "" %>' +
        '* Copyright (c) <%= grunt.template.today("yyyy") %> <%= pkg.author.name %>;' +
        ' Licensed <%= _.pluck(pkg.licenses, "type").join(", ") %> */\n',
        
        jshint: {
            options: {
                reporterOutput: "",
                unused: true
            },
            development: ['public/js/**/*.js']
        },
        
        //VAlidate CSS files
        csslint: {
            development: {
                src: ['public/css']
            }
        },
        //Validate HTML Files and Templates (HTML Fragments)
        htmlangular: {
            development: {
                src: [
                    'public/views/**/*.template.html', 
                    'public/index.html', 
                    'public/protected/**/*.template.html'
                ]
            },
            
            options: {
                tmplext: 'template.html',
                reportpath: null,
                reportCheckstylePath: null
                // customtags: [
                //     'my-dirctive'
                // ],
                // customattrs: [
                //     'my-attr'
                // ]
            }
        },
        //Merge my applications JS and CSS files
        concat: {
            options: {
                banner: '<%= banner %>'
            },
            css: {
                src: ['public/css/*.css'],
                dest: 'publish/css/main.css'
            },
            js: {
                src: ['public/js/**/*.js'],
                dest: 'publish/js/main.js'
            }
        },
        clean: {
            production: ['publish/']
        },
        
        uglify: {
            production: {
                options: {
                    preserveComments: false,
                    mangleProperties: true
                },
                files: {
                    'publish/js/main.min.js' : ['publish/js/main.js']
                }
            }
        }
        
        
    });
    
    //Default task
    grunt.registerTask('default', ['jshint', 'csslint', 'htmlangular', 'clean', 'concat']);
};