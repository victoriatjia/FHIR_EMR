/* Check required field and format pattern */
function formFieldValidation(formID){
	var form = document.getElementById(formID);
	var count = 0;
	var isEmpty=false, formatIsWrong= false;
	
	for(var i=0; i < form.elements.length; i++)
	{
		let element= form.elements[i];
		if(element.hasAttribute('required'))
		{
			if ((element.type == "text" || element.type == "password" || element.type == "date") && element.value == "") 
			{ 
				isEmpty=true;
				break;
			}
			if (element.type == "radio" && !element.checked) 
			{
				isEmpty=true;
				break;
			}
			if (element.type == "email" && element.value == "") 
			{ 
				isEmpty=true;
				break;
			}
		}
		else
		{
			var emailFormat = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
			if (element.type == "email" && element.value != "" && !emailFormat.test(element.value)) 
			{ 
				formatIsWrong= true;
				break;
			}
		}	
    }
	
	if (isEmpty || formatIsWrong){
		if (isEmpty) alert(alertMessageEN.requiredField);
		if (formatIsWrong) alert(alertMessageEN.emailFormatWrong);
		//document.getElementById("btnSubmit").disabled = false;
		return 0;
	}
	return 1;
}