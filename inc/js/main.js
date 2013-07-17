angular.module('githubAuth', [])
.config(['$routeProvider',function(r){

	// Routes
	r
	.when('/',{
		templateUrl : 'views/formAuth.tpl',
	})
	.when('/stepTwo', {
		templateUrl : 'views/formFSAuth.tpl',
		controller	: 'FireLogic'
	})
	.when('/added', {
		templateUrl : 'views/added.tpl',
	})
	.when('/error/:msg', {
		templateUrl : 'views/error.tpl',
		controller	: 'ErrorLogic'
	})

}])

// Core Controller
.controller('AuthLogic', ['$scope', function(s){
	s.title = 'Time to show a detail Page Derp derp';
	
	//Firebase Simple Login Auth Call
	s.authenticateMe = function(){
		auth.login('github', {
			rememberMe: true,
	  		scope: 'user,repo'
		});
	}
}])

// Error Controller
.controller('ErrorLogic', ['$scope', '$routeParams', function(s,params){

	// Don't trust current Firebase connection, create new, and apply error to log
	var fbError = new Firebase('https://fsgithub.firebaseio.com/errors');
	fbError.push({params:params});
	s.errorMsg = 'An error has occurred. [code: ' + params.msg + ']';
	
}])

// Second Step Controller
.controller('FireLogic', ['$scope', function(s){

	// Check local Storage, if nothing is there, you shouldn't be on this page... Dump out to Error Screen
	if(!localUser){
		window.location = "#/error/Skipped A Step"
	} else {

		// Visual Feedback for Email's Validity
		s.Valid = false;

		// On Email Change
		s.$watch('Email', function(){
			if(s.Email){

				// Verify is email format
				var emailPattern 	= /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
				var allowedDomains 	= ['fullsail.edu','fullsail.com'];
			   	for(var i = 0; i < allowedDomains.length; i++){

			   		//Verify Pattern and Allowed Domains are present
		    		if(s.Email.toLowerCase().match( allowedDomains[i]) && emailPattern.test(s.Email) ){
		    			s.Valid = true;
		    			break;
		    		} else{
		    			s.Valid = false;
		    		}
		    	}
		    }
		}, true);

		// On Email Verification Submit
		s.FSVerify = function(){

			//Fresh Firebase connection, don't trust anything
			var fbVerify = new Firebase('https://fsgithub.firebaseio.com/users');

			//When the Data Async loads
			fbVerify.on('value', function(data){
				var bMatchFound = false;
				var users = data.val();

				// Loop thru each entry
				for(userID in users){

					//Check for Duplicate Email, If found, Fail out to error screen
					if( users[userID].email == s.Email ){
						bMatchFound = true;
						console.log('Match Discovered');						
						window.location = "#/error/Duplicate Email"
						return false;
						break; // Really dont let anyone pass =P
					}
				}

				// Email Valid? Inject into Firebase
				if(s.Valid){
					fb.push( {email: s.Email, GHID:localUser.id, data: localUser} );
					window.location = '#/added/'
				}	
			});
			
			
			
		}

		
	}
	
	//
}]);

var localUser;

//Generic FB Connection. Could be integrated into Core Controller.
var fb = new Firebase('https://fsgithub.firebaseio.com/users');
var auth = new FirebaseSimpleLogin(fb, function(error, user) {
  if (error) {
    // an error occurred while attempting login
    window.location = "#/error/Database failure - " + error;
  } else if (user) {
    // user authenticated with Firebase
    localUser = user;
    window.location = '#/stepTwo';
//	fb.push({email:'force', githubUserInfo: user});

  } else {
    // user is logged out
  }
});