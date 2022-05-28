let json_person={
		"resourceType": "Person",
		"active": "true",
		"identifier": [ 
			{
				"system": "UserID",
				"value": "victoriatjiaa@gmail.com"
			}, 
			{
				"system": "Password",
				"value": "MWI0ZjBlOTg1MTk3MTk5OGU3MzIwNzg1NDRjOTZiMzZjM2QwMWNlZGY3Y2FhMzMyMzU5ZDZmMWQ4MzU2NzAxNA=="
			}
		],
		"name": [ {
			"text": "Victoria Tjia"
		} ],
		"telecom": [
			{
			  "system": "email",
			  "value": "victoriatjiaa@gmail.com"
			}
		],
		"gender": "female",
		"birthDate": "1999-12-25"
	}

let json_practitioner= {
	  "resourceType": "Practitioner",
	   "active": true,
		"name": [
		{
		  "text": [
			"Albert Einstein"
		  ]
		}
	  ]
	}

let json_practitionerrole= {
	  "resourceType": "PractitionerRole",
	  "identifier": [ {
		"system": "PractitionerID",
		"value": "P0001"
	  } ],
	  "active": true,
	  "code": [ {
		"coding": [ {
		  "system": "http://hl7.org/fhir/R4/valueset-practitioner-role.html",
		  "code": "6868009",
		  "display": "Hospital administrator"
		} ]
	  } ],
	  "practitioner": {
		"reference": "Practitioner/2863581",
		"display": "Albert Einstein"
	  },
	  "organization": {
		"reference": "Organization/2863475"
	  }
	}

let localVar = {
	person:{},
	practitioner:{},
	practitionerRole: {}
}

function initLocalVar()
{
	localVar.person= json_person;
	localVar.practitioner= json_practitioner;
	localVar.practitionerRole= json_practitionerrole;
}

//Practitioner role reference to http://hl7.org/fhir/R4/valueset-practitioner-role.html
let practitionerRoleList={
	code:["doctor", "nurse", "pharmacist", "researcher", "teacher",
		  "ict", "1421009", "3430008", "3842006", "4162009",
		  "5275007", "6816002", "6868009", "8724009", "11661002",
		  "11911009", "11935004", "13580004", "14698002", "17561000"
		 ],
	desc: ["Doctor", "Nurse", "Pharmacist", "Researcher", "Teacher/educator",
		   "ICT professional", "Specialized surgeon", "Radiation therapist", "Chiropractor", "Dental assistant",
		   "NA - Nursing auxiliary", "Specialized nurse", "Hospital administrator", "Plastic surgeon", "Neuropathologist",
		   "Nephrologist", "Obstetrician", "School dental assistant", "Medical microbiologist", "Cardiologist"
		  ]
}

//Function Initialization
$(document).ready(function(){
	$("#loadingPage").show();
	// Clear session
	let stringValue = window.sessionStorage.getItem("globarVar")
    if (stringValue != null) 
	{
		window.sessionStorage.removeItem("globarVar");
	}
	// Get Organization Information
	getResource(FHIRURL, 'Organization', '/' + DB.organization, FHIRResponseType, 'displayOrganizationMessage');
});

// Get FHIR Organization Information
function displayOrganizationMessage(str)
{
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
		template="";
		for(let i=0;i<practitionerRoleList.code.length;i++)
		{
			template+= '<option value="' + practitionerRoleList.code[i] + '">' + practitionerRoleList.desc[i] + '</option>';
		}
		$('#PractitionerRoleOption').html(template); 
	}
}

//Validate data input by user
function validateData(){
	initLocalVar();
	if(formFieldValidation("signUpForm")){
		getResource(FHIRURL, 'Person', '?identifier=' + $("#Email").val(), FHIRResponseType, 'verifyUser');
	}
}

//Verify FHIR Person & Patient exist or not 
function verifyUser(str){ 
	let obj= JSON.parse(str);
	//if person exist -> alert "user exist"
	if (obj.total > 0)
	{			
		alert(alertMessageEN.accountExist);
	}
	//if person unexist -> create new Person ->  create new Patient
	else 
	{
		createPerson();
	}
}


//Create new FHIR Person
function createPerson(){
	//initialize();
	localVar.person.identifier[0].value= $("#Email").val();
	localVar.person.identifier[1].value= $('#SHA256PWD').val();
	localVar.person.name[0].text= $('#Name').val();
	localVar.person.telecom[0].value= $("#Email").val();
	localVar.person.gender= $('input[name="Gender"]:checked').val();
	localVar.person.birthDate= $("#DOB").val();
	let personSTR = JSON.stringify(localVar.person);	
	postResource(FHIRURL, 'Person', '', FHIRResponseType, "createPractitioner", personSTR);
}

//Create new FHIR Practitioner
function createPractitioner(str){
	let obj= JSON.parse(str);
	//If success to create new Person
	if (retValue(obj))
	{
		localVar.person= obj;
		localVar.practitioner.name[0].text= localVar.person.name[0].text;
		let practitionerSTR = JSON.stringify(localVar.practitioner);
		postResource(FHIRURL, 'Practitioner', '', FHIRResponseType, "createPractitionerRole", practitionerSTR);
	}
}

//Create new FHIR PractitionerRole
function createPractitionerRole(str){
	let obj= JSON.parse(str);
	//If success to create new Person
	if (retValue(obj))
	{
		localVar.practitioner= obj;
		localVar.practitionerRole.identifier[0].value= $("#PractitionerID").val()? $("#PractitionerID").val() : "";
		localVar.practitionerRole.code[0].coding[0].code= $('#PractitionerRoleOption').find(":selected").val();
		localVar.practitionerRole.code[0].coding[0].display= $('#PractitionerRoleOption').find(":selected").text();
		localVar.practitionerRole.organization.reference= 'Organization/' + DB.organization;
		localVar.practitionerRole.practitioner.reference= 'Practitioner/' + obj.id;
		localVar.practitionerRole.practitioner.display= localVar.person.name[0].text;
		let practitionerRoleSTR = JSON.stringify(localVar.practitionerRole);
		postResource(FHIRURL, 'PractitionerRole', '', FHIRResponseType, "updatePerson", practitionerRoleSTR);
	}
}

//Update FHIR Person to connect it with FHIR Patient
function updatePerson(str){
	let obj= JSON.parse(str);
	if (retValue(obj))
	{
		localVar.patient= obj;
		let link= '{"link":[{"target":{"reference":"Practitioner/' + localVar.practitioner.id + '","display": "' + localVar.person.name[0].text + '"}}]}';
		link= JSON.parse(link);
		
		if(localVar.person.link == null)
		{
			localVar.person = {
			  ...localVar.person,
			  ...link,
			};
		}
		let personSTR = JSON.stringify(localVar.person);
		putResource(FHIRURL, 'Person', '/' + localVar.person.id, FHIRResponseType, "signUpResult", personSTR);
	}
}


function signUpResult(str){
	let obj= JSON.parse(str);
	if (retValue(obj))
	{
		alert(alertMessageEN.signUpOK);
		window.close();
	}
}