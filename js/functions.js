
	// on va rechercher le programme à une heure donnée et on va dessus
function goto(id){
		$("html, body").animate({ scrollTop: $(id).offset().top }, 500); 
	}