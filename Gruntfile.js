module.exports = function(grunt) {

    grunt.registerTask('start', 'description here', function() {
        grunt.log.writeln('Grunt Start!');
    });



    grunt.initConfig({
        jsdoc: {
            dist: {
                src: ['client/develop/*'],
                options: {
                    destination: 'doc'
                }
            }
        }
    });
    // プラグインの読み込み
    grunt.loadNpmTasks('grunt-jsdoc');

    // デフォルトで実行
    grunt.registerTask('default', ['start', 'jsdoc']);

};
