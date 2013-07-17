angular.module('githubAuth', [])
.config(['$routeProvider',function(r){
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


.controller('AuthLogic', ['$scope', function(s){
	s.title = 'Time to show a detail Page Derp derp';
	

	s.authenticateMe = function(){
		auth.login('github', {
			rememberMe: true,
	  		scope: 'user,repo'
		});
	}
}])
.controller('ErrorLogic', ['$scope', '$routeParams', function(s,params){

	var fbError = new Firebase('https://fsgithub.firebaseio.com/errors');
	fbError.push({params:params});
	s.errorMsg = 'An error has occurred. [code: ' + params.msg + ']';
	
}])

.controller('FireLogic', ['$scope', function(s){
	if(!localUser){
		window.location = "#/error/Skipped A Step"
	} else {
		s.Valid = false;
		s.$watch('Email', function(){
			
			if(s.Email){
				var emailPattern 	= /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
				var allowedDomains 	= ['fullsail.edu','fullsail.com'];
			   	for(var i = 0; i < allowedDomains.length; i++){
		    		if(s.Email.toLowerCase().match( allowedDomains[i]) && emailPattern.test(s.Email) ){
		    			s.Valid = true;
		    			break;
		    		} else{
		    			s.Valid = false;
		    		}
		    	}

		    }
			
			
		}, true);

		s.FSVerify = function(){

			
			var fbVerify = new Firebase('https://fsgithub.firebaseio.com/users');
			fbVerify.on('value', function(data){
				var bMatchFound = false;
				var users = data.val();
				for(userID in users){
					if( users[userID].email == s.Email ){
						bMatchFound = true;	
						console.log('Match Discovered');
						
						window.location = "#/error/Duplicate Email"
						return false;
						break;
					}
				}

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
var fb = new Firebase('https://fsgithub.firebaseio.com/users');
var auth = new FirebaseSimpleLogin(fb, function(error, user) {
  if (error) {
    // an error occurred while attempting login
    console.log(error);
  } else if (user) {
    // user authenticated with Firebase
    localUser = user;
    window.location = '#/stepTwo';
//	fb.push({email:'force', githubUserInfo: user});

  } else {
    // user is logged out
  }
});
