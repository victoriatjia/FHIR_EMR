//Function Initialization
$(document).ready(function(){
	$("#loadingPage").show();
	//Clear session
	let stringValue = window.sessionStorage.getItem("globarVar")
    if (stringValue != null) 
	{
		window.sessionStorage.removeItem("globarVar");
	}
	// Get Organization Information
	getResource(FHIRURL, 'Organization', '/' + DB.organization, FHIRResponseType, 'displayOrganizationMessage');
});

// Get FHIR Organization Information
function displayOrganizationMessage(str){
	let obj= JSON.parse(str);
	if(retValue(obj))
	{
		globalVar.organization= obj;
		let organizationName= (obj.name) ? obj.name : '';
		let CPName="";
		let CPEmail="";
		let CPPhone="";
		if (obj.contact)
		{
			CPName= obj.contact[0].name.text;
			obj.contact[0].telecom.map((telecom, i) => {
				if (telecom.system == "email")
					CPEmail= telecom.value;
				else if (telecom.system == "phone")
					CPPhone= telecom.value;
			});
		}
		let template= ", please contact " + CPName + "<br>Phone No.：" + CPPhone + "<br>Email：" + CPEmail;
		//Show page body
		$("#loadingPage").hide();
		$("#page-body").show();
		$("#header-brand").html(organizationName);
		$("#contactPerson").html(alertMessageEN.signInFail + template);
	}
}

//Validate data input by user
function validateData(){
	globalVar.person= {};
	globalVar.role= [];
	if(formFieldValidation("loginForm")){
		let username= $("#Username").val();
		getResource(FHIRURL, 'Person', '?identifier=' + username, FHIRResponseType, 'verifyUser');
	}
}

//Verify login account username and password
function verifyUser(str)
{
	let obj= JSON.parse(str);
	
	if (obj.total == 0) alert(alertMessageEN.accountUnexist);
	else if (obj.total == 1){
		globalVar.person= obj.entry[0].resource;
		let personID = (obj.entry[0].resource.id) ? obj.entry[0].resource.id : '';
		let personName = (obj.entry[0].resource.name) ? obj.entry[0].resource.name[0].text : '';
		let personUsername= (obj.entry[0].resource.identifier[0])? obj.entry[0].resource.identifier[0].value : '';
		let personPassword= (obj.entry[0].resource.identifier[1])? obj.entry[0].resource.identifier[1].value : '';
		
		if(obj.entry[0].resource.link)
		{
			obj.entry[0].resource.link.map((link, i) => {
				let roleID= link.target.reference;
				/* Get user role: Patient or Practitioner */
				if(roleID.split('/')[0] == "Practitioner") 
					getResource(FHIRURL, 'PractitionerRole', '?practitioner=' + roleID.split('/')[1], FHIRResponseType, 'getPractitionerRole');
					
			});
		}
		if($('#SHA256PWD').val() != personPassword)	alert(alertMessageEN.passwordWrong);
		else if(globalVar.role.length == 0) alert("Only practitioner account can login!");
		else if(globalVar.role.length == 1){
			sessionSet("globalVar", globalVar, 30);
			if(globalVar.role[0].resourceType == "PractitionerRole")
				window.open('index.html',"_self");
		}
	}
	else{
		alert(alertMessageEN.systemError + " " + alertMessageEN.contactPerson);
	}
}


function getPractitionerRole(str)
{ 
	let obj= JSON.parse(str);
	obj.entry.map((entry, i) => {
		let organizationID = entry.resource.organization? entry.resource.organization.reference.split('/')[1] : '';
		// Only store PractitionerRole information which belong to the organization define in variable DB.organization (in setting.js)
		if(organizationID == DB.organization)
			globalVar.role.push(entry.resource);
	});
}