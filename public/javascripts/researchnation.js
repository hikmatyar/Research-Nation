function showTab(value) 
	{
		if(value == "signup")
		{
			document.getElementById('tabOne').style.display = "block"
			document.getElementById('tabTwo').style.display = "none"

			document.getElementById('tab1').style.background = "#FFFFFF"
			document.getElementById('tab1').style.color = "#245a83"

			document.getElementById('tab2').style.background = "#bfbfb5"
			document.getElementById('tab2').style.color = "#FFFFFF"

			return true;
		}
		if(value == "login")
		{
			document.getElementById('tabOne').style.display = "none"
			document.getElementById('tabTwo').style.display = "block"

			document.getElementById('tab2').style.background = "#FFFFFF"
			document.getElementById('tab2').style.color = "#245a83"

			document.getElementById('tab1').style.background = "#bfbfb5"
			document.getElementById('tab1').style.color = "#FFFFFF"

			return true;
		}
	}

