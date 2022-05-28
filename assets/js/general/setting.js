//Step 1. Set FHIR Server URL and response type (json or xml)
let FHIRURL= 'https://tzfhir.ml/fhir/';	//'https://hapi.fhir.org/baseR5/';		//default FHIR Server API 
let FHIRResponseType= 'json';						//Requested data type returned by the server. The default value is JSON.

//Step 2. Define the FHIR Organization resource ID
let DB={
	organization: "1"	//"1"
};

/*
    Public variable area
*/
var partOfid = '';
var web_language= "EN";

//The global variable will be the template for session value
let globalVar = {
	expirationDate: '',	
	organization:{},
	person:{},
	role: []
}