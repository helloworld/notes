/* ---------------------------------------------------- +/

## Client Router ##

Client-side Router.

/+ ---------------------------------------------------- */

// Config

Router.configure({
    layoutTemplate: 'layout',
});

// Filters

var filters = {

    myFilter: function() {
        // do something
    },

    isLoggedIn: function() {
        if (!(Meteor.loggingIn() || Meteor.user())) {
            alert('Please Log In First.')
            this.stop();
        }
    }

}


// Routes

Router.map(function() {


    // Pages

    this.route('home', {
        path: '/'
    });

    this.route('signup');
    this.route('login');
    this.route('mynotes');





});