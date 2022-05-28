function getAllQueryString(){
	var params = new URLSearchParams(window.location.search)	//Get query string part of the URL
	
	//Iterate over all the parameters, using for..of:
	for (const param of params) {
		document.write(param[0] + ": " + param[1] + "<br>");
	}
}
	
function getQueryStringByID(key){
	var params = new URLSearchParams(window.location.search)	//Get query string part of the URL
	
	if(params.has(key))		
		return params.get(key);
	else return 0;
}