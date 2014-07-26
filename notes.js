Notes = new Meteor.Collection('notes');


if (Meteor.isClient) {

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
        editor.setValue("Type Notes Here");

        $(".save").click(function() {

            var text = editor.getValue();
            var title = $("#title").val();
            var subject = $("#subject").val();
            var topic = $("#topic").val();

            Notes.insert({
                created_at: new Date,
                title: title,
                subject: subject,
                topic: topic,
                text: text,
                user: Meteor.user(),
                user_id: Meteor.userId()
            });

            alert("saved");
        });
    };

}

if (Meteor.isServer) {

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