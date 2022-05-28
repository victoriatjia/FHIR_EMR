//Function Initialization
$(document).ready(function(){
	/* Check session */
	globalVar= sessionGet("globalVar");
	if(globalVar==null) {
		//redirect users to login page
		window.location.href = "login.html";
	}
	else {
		$("#header-brand").html(globalVar.organization.name);
		$("#intro").html("Welcome, " + globalVar.person.name[0].text + "!");
	}
});

function logOut(){			
	 window.sessionStorage.removeItem("globalVar");
	 window.location.href = "login.html";
}
