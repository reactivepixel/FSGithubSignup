var fb = new Firebase('https://fsgithub.firebaseio.com/');
var auth = new FirebaseSimpleLogin(fb, function(error, user) {
  if (error) {
    // an error occurred while attempting login
    console.log(error);
  } else if (user) {
    // user authenticated with Firebase
    console.log('User ID: ' + user.id + ', Provider: ' + user.provider);
    fb.push({email:'force', githubID: user.id});
  } else {
    // user is logged out
  }
});

var fire = function(){
	auth.login('github', {
		rememberMe: true,
  		scope: 'user,repo,gist'
	});
}