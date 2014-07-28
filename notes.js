Notes = new Meteor.Collection('notes');
Results = new Meteor.Collection('results');


if (Meteor.isClient) {

    notesSub = Meteor.subscribe('notes');
    resultsSub = Meteor.subscribe('results');


    Template.resetview.events({
        'click button': function(e, tmpl) {
            Meteor.call('resetAll');
        }
    });

    Template.signup.events = {
        'click input[type=submit]': function(event) {
            event.preventDefault();

            var user = {
                username: $('#username').val(),
                email: $('#email').val(),
                password: $('#password').val()
            };

            if (!user.username || !user.email || !user.password) {
                alert('Please fill in all fields');
            } else {
                Accounts.createUser(user, function(error) {
                    if (error) {
                        alert(error.reason + 'error');
                    } else {
                        Router.go('/mynotes');
                    }
                });
            }
        }
    };



    Template.login.events = {
        'click input[type=submit]': function(event) {
            event.preventDefault();
            var username = $('#username').val();
            var password = $('#password').val();
            Meteor.loginWithPassword(username, password, function(error) {
                if (error) {
                    alert(error.reason + 'error');
                } else {
                    Router.go('/mynotes');
                    alert('You are now logged in.');
                }
            });
        }
    };

    Template.header.user = function() {
        return Meteor.user();
    }

    Template.header.events({
        'click .log-out': function() {
            Meteor.logout();
        }
    });

    Template.header.helpers({
        messages: function() {
            return Messages.find();
        },
        isLoggedIn: function() {
            return !!Meteor.user();
        }

    });

    Template.mynotes.rendered = function() {
        var editor = ace.edit("editor");
        editor.setTheme("ace/theme/pastel_on_dark");
        editor.getSession().setMode("ace/mode/");
        editor.setHighlightActiveLine(true);
        editor.getSession().setUseWorker(true);
        editor.getSession().setUseWrapMode(true);
        editor.setValue("Type Notes Here");

        $(".save").click(function() {

            var text = editor.getValue();
            var countConfused = text.match(/#confused/g);
            var countMorePractice = text.match(/#morepractice/g);
            var countLost = text.match(/#lost/g);

            if (countConfused == null) {
                countConfused = 0;
            } else {
                countConfused = countConfused.length;
            }

            if (countMorePractice == null) {
                countMorePractice = 0;
            } else {
                countMorePractice = countMorePractice.length;
            }

            if (countLost == null) {
                countLost = 0;
            } else {
                countLost = countLost.length;
            }

            var title = $("#title").val();
            var subject = $("#subject").val();
            var topic = $("#topic").val();

            if (title == "Enter Title...") {
                return alert("Please fill out title form")
            }
            if (subject == "Enter Subject...") {
                return alert("Please fill out subject form")
            }
            if (topic == "Enter Topic...") {
                return alert("Please fill out topic form")
            }

            Notes.insert({
                created_at: new Date,
                title: title,
                subject: subject,
                topic: topic,
                noteText: text,
                countConfused: countConfused,
                countMorePractice: countMorePractice,
                countLost: countLost,
                user: Meteor.user(),
                user_id: Meteor.userId()
            });

            alert("saved");
        });
    };

    Template.TeacherNotes.rendered = function() {
        var editorTeacher = ace.edit("editorTeacher");
        editorTeacher.setTheme("ace/theme/pastel_on_dark");
        editorTeacher.getSession().setMode("ace/mode/");
        editorTeacher.setHighlightActiveLine(true);
        editorTeacher.getSession().setUseWorker(true);
        editorTeacher.getSession().setUseWrapMode(true);
        editorTeacher.setValue("Type Notes Here");


        $(".runTest").click(function() {
            var text = editorTeacher.getValue();
            // text = text.replace(/\s/g, "\n");
            var array = text.split("\n");
            for (i = 0; i < array.length; i++) {
                array[i] = array[i].trim();

            }


            arr = array.filter(function(n) {
                return n != "";
            });


            notesArray = Notes.find().fetch();

            console.log(notesArray[0].noteText);

            for (i = 0; i < notesArray.length; i++) {
                var correct = 0;
                for (j = 0; j < arr.length; j++) {
                    if ((notesArray[i].noteText.toLowerCase()).indexOf(arr[j].toLowerCase()) > -1) {
                        correct++;
                    }
                }
                console.log("-------------------------------------")
                console.log("USERNAME: " + notesArray[i].user.username)
                console.log("CORRECT: " + correct)
                var score = correct / arr.length;
                score = score * 100;
                console.log("score" + score);


                Results.insert({
                    created_at: new Date,
                    user: notesArray[i].user.username,
                    correct: correct,
                    score: score,
                });
            }

            Router.go('/results');


        });

    }



    Template.teacher.helpers({
        items: function() {
            return Notes.find({}, {
                sort: {
                    created_at: -1
                }
            });
        },

        countConfused: function() {
            var sum = 0;
            // console.log(sum);
            Notes.find({}).forEach(function(object) {
                sum += object.countConfused;
            })
            // console.log(sum);
            return sum;
        },

        countMorePractice: function() {
            var sum = 0;
            // console.log(sum);
            Notes.find({}).forEach(function(object) {
                sum += object.countMorePractice;
            })
            // console.log(sum);
            return sum;
        },

        countLost: function() {
            var sum = 0;
            // console.log(sum);
            Notes.find({}).forEach(function(object) {
                sum += object.countLost;
            })
            // console.log(sum);
            return sum;
        },

        countUnhappy: function() {
            var sum = 0;
            // console.log(sum);
            Notes.find({}).forEach(function(object) {
                sum += object.countUnhappy;
            })
            // console.log(sum);
            return sum;
        },

        uniqueTopics: function() {
            var array = [];
            Notes.find({}).forEach(function(object) {
                if (array.indexOf(object.topic) < 0) {
                    array.push(object.topic);
                }
            });
            return array;
        },


    });

    Template.results.helpers({
        items: function() {
            return Results.find({}, {
                sort: {
                    created_at: -1
                }
            });
        },
    });






}

if (Meteor.isServer) {

    Meteor.startup(function() {

        return Meteor.methods({

            resetAll: function() {

                Notes.remove({});
                Results.remove({});
                return;

            }

        });

    });

    Meteor.publish('notes', function() {
        return Notes.find({}, {
            sort: {
                created_at: 1
            }
        });
    });

    Meteor.publish('results', function() {
        return Results.find({}, {
            sort: {
                created_at: 1
            }
        });
    });

    Accounts.onCreateUser(function(options, user) {
        user.test = "null";
        return user;
    })

    Meteor.publish("userData", function() {
        return Meteor.users.find();
    });

    Meteor.methods({

    })

}