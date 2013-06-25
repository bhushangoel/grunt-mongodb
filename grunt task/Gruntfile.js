module.exports = function(grunt) {
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        //  db:'manusis',
//coll:'users',


        clean: {
            build: {
                src: ["compress/*"]
            }
        },



        unzip: {
            src: '<%=db%><%= grunt.template.today("yyyy-mm-dd") %>.zip'
        },

        gitco: {    //git clone      //git archive --prefix=aa/ HEAD:cars cars_2013-06-25_11:02.zip | tar x (to checkout specific file to a a specific folder)
            branch:'master',
            repo :'git@github.com:bhushangoel/grunt-demo.git'
        },

        /*mongodump : {
         //manusis:'users'    //databasename:collectionname
         },*/

//        mongorestore : {
//            db: 'test',
//            directory: '/tmp/test111'
//        },

        compress: {
            main: {
                options: {
                    archive: '<%=database%>/<%=database%>_<%= grunt.template.today("yyyy-mm-dd") %>_<%= grunt.template.today("hh:MM") %>.zip'
                },

                files: [
                    {
                        src: ['dump/<%=database%>/*']
                    }
                ]
            }},

        'gh-pages': {
            options: {
                repo: 'git@github.com:bhushangoel/grunt-demo.git',
                clone: 'git@github.com:bhushangoel/grunt-demo.git',
                message:'Latest commit',
                branch:'cars'
            },
            src: [ '<%=database%>/<%=database%>_<%= grunt.template.today("yyyy-mm-dd") %>_<%= grunt.template.today("hh:MM") %>.zip']
//src:['Gruntfile.js']  
        },

        backuplist: {
            options: {
                sort: 'commits',
                id: true,
                nomerges: true,
                Url: 'git@github.com:bhushangoel/grunt-demo.git',    //repo URL
                branch:'cars'                                   //Branch Name
//                datab: '<%=database%>'
            },
            url:'git@github.com:bhushangoel/grunt-demo.git'
        },

        checkout: {

            filename: '<%=abc%>'
        },

        checkoutt: {
            options: {
                path: '<%=dbpath%>',
                nme: '<%=dbnme%>'

            }
                                        //<%=dbnme%>: '<%=dbnme%>'
        }
    });

    grunt.registerMultiTask('unzip', 'unzip the file', function() {
        var myTerminal = require("child_process").exec,
            commandToBeExecuted = "unzip "+ this.data +" -d "+ this.target;
        console.log(commandToBeExecuted);
        myTerminal(commandToBeExecuted, function(error, stdout, stderr) {
        });
    });

    grunt.registerTask('mongodump', 'Dumps the mongodb', function(db) {
        console.log('creating Dumpfile '  +db);
        var myTerminal = require("child_process").exec,
            commandToBeExecuted = 'mongodump --db '+db+' --out dump/';
        grunt.config.set('database' , db);
        myTerminal(commandToBeExecuted, function(error, stdout, stderr) {
        });
        var done = this.async();
        setTimeout(function() {
            // Fail asynchronously.
            done(true);
        }, 3000);
        grunt.task.run('compress','gh-pages');
    });




    grunt.registerTask('mongorestore', 'Restore the mongodb', function(db1, db2) {
        var myTerminal = require("child_process").exec,
            commandToBeExecuted = "mongorestore --db "+db2+" dump/"+db1;
console.log(commandToBeExecuted);
        myTerminal(commandToBeExecuted, function(error, stdout, stderr) {
        });
    });

    var _ = grunt.util._;
    var exec = require('child_process').exec;

    grunt.registerTask('backuplist', 'Get the latest commit file names from a git repository', function(d) {
        var options = this.options({
//      sort: 'chronological', // alphabetical, commits
            id: false, // show emails in the output
            nomerges: false, // only works when sorting by commits
//            output: './AUTHORS.txt' // the output file
            Url: 'git@github.com:bhushangoel/grunt-demo.git',
            branch: 'cars'
//            db:'cars'
        });
//        console.log(d);

        var done = this.async();

        var _format = function (stdout) {
            var maxcol = 0;
            var pad = ' ';
            return stdout.replace(/^\s+|\s+$/g, '').split('\n').map(function (l) {
                var numl = l.match(/\d+/);
                if (numl) {
                    numl = numl[0].length;
                    maxcol = numl > maxcol ? numl : maxcol;
                    pad = '  ' + new Array(maxcol-numl+1).join(' ');
                }
                return _.trim(l.replace(/\t+/, pad));
            });
        };

        // sort types
        var sortMethod = {
//            alphabetical: 'sort',
            chronological: 'reverse'
        };

        // sort output
        var _sort = function (stdout) {
            if (sortMethod[options.sort]) {
                stdout = _.unique(stdout[sortMethod[options.sort]]());
            }
            return stdout;
        };

        // default command 'git'
        var cmd = 'git';



        // show email
        if (options.id) {                //--git-dir=clone/.git rev-parse --short HEAD
            cmd += ' --git-dir=' + options.Url +'/.git ls-tree --name-status -r '+ options.branch +' '+ d + ' | sort -r';
        }

        cmd += '';
//        console.log(cmd);
        // show email
//      if (options.id) {
//        cmd += 'e';
//      }


        exec(cmd, function (error, stdout, stderr) {
            if (!error) {
                stdout = _format(stdout);
                stdout = _sort(stdout);
                grunt.log.write( stdout.join('\n'));
//        grunt.log.writeln('File "' + options.output + '" created.');
                done();
            } else {
                grunt.fail.warn(error);
            }
        });
    });


    var _ = grunt.util._;
    var exec = require('child_process').exec;
    grunt.registerTask('restore', 'Restore the latest commit file from a git repository', function (db,filename) {
//        console.log('inside restore');
        var options = this.options({
//      sort: 'chronological', // alphabetical, commits
            id: false, // show emails in the output
            nomerges: false, // only works when sorting by commits
            output: './AUTHORS.txt' // the output file
        });

        var done = this.async();

        var _format = function (stdout) {
            var maxcol = 0;
            var pad = ' ';
            return stdout.replace(/^\s+|\s+$/g, '').split('\n').map(function (l) {
                var numl = l.match(/\d+/);
                if (numl) {
                    numl = numl[0].length;
                    maxcol = numl > maxcol ? numl : maxcol;
                    pad = '  ' + new Array(maxcol-numl+1).join(' ');
                }
                return _.trim(l.replace(/\t+/, pad));
            });
        };

        // sort types
        var sortMethod = {
            alphabetical: 'sort',
            chronological: 'reverse'
        };

        // sort output
        var _sort = function (stdout) {
            if (sortMethod[options.sort]) {
                stdout = _.unique(stdout[sortMethod[options.sort]]());
            }
            return stdout;
        };

        // default command 'git'
        var cmd = 'git';
        // show commit id
//        if (options.id) {
            cmd += ' log -1 --pretty=tformat:%n --name-status '+db+'/';
//        }
        grunt.config.set('dbnme', db);
        grunt.config.set('dbpath', filename);


        cmd += '';
        console.log(cmd);

        exec(cmd, function (error, stdout, stderr) {
            if (!error) {
                stdout = _format(stdout);
                stdout = _sort(stdout);
//                grunt.log.write(stdout.join('\n'));
                 var nme = stdout.join('\n');
                console.log(nme);
                var n=nme.replace("/"," ");
                var r= n.replace("A  ","");
                grunt.config.set('abc', r);
                console.log(n);
                done();
            } else {
                grunt.fail.warn(error);
            }
        });if(path==null){
        grunt.task.run('checkout');
        }
        else{
            grunt.task.run('checkoutt');
        }
    });

    grunt.registerTask('checkoutt', 'copy file to folder from git', function() {
        var options = this.options ({
            path: '<%=dbpath%>',
                nme: '<%=dbnme%>'
        });
        var myTerminal = require("child_process").exec,
            commandToBeExecuted = 'git --git-dir=git@github.com:bhushangoel/grunt-demo.git/.git archive --prefix=aa/ HEAD:'+options.nme+' '+options.path+' | tar x ';
        console.log(commandToBeExecuted);
        myTerminal(commandToBeExecuted, function(error, stdout, stderr) {
        });

    });

    grunt.registerMultiTask('checkout', 'copy file to folder from git', function() {

        grunt.log.write(this.data);
        var myTerminal = require("child_process").exec,
            commandToBeExecuted = 'git --git-dir=git@github.com:bhushangoel/grunt-demo.git/.git archive --prefix=aa/ HEAD:'+this.data+' | tar x ';
console.log(commandToBeExecuted);
        myTerminal(commandToBeExecuted, function(error, stdout, stderr) {
        });
    });




    grunt.loadNpmTasks('grunt-contrib-compress');
    grunt.loadNpmTasks('grunt-gitco');
    grunt.loadNpmTasks('grunt-gh-pages');
//grunt.loadNpmTasks('grunt-mongodump');
//    grunt.loadNpmTasks('grunt-gitlist');
//    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.registerTask('list', ['ver']);
//    grunt.registerTask('aaa', ['restore', 'checkout']);
    grunt.registerTask('tasks', ['mongodump','compress','gh-pages','gitlist','unzip']);
};
