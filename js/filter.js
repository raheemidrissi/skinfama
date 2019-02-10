avservicesApp.filter('fmDuration', function () {
	//TODO: refaire cette fonction en utilisant moment.js
  return function (input) {
	  if (input){
	    var sec_num = parseInt(input, 10); // don't forget the second param
	    var hours   = Math.floor(sec_num / 3600);
	    var minutes = Math.floor((sec_num - (hours * 3600)) / 60);
	    var seconds = sec_num - (hours * 3600) - (minutes * 60);
	
	    if (hours   < 10) {hours   = "0"+hours;}
	    if (minutes < 10) {minutes = "0"+minutes;}
	    if (seconds < 10) {seconds = "0"+seconds;}
	    return hours+':'+minutes+':'+seconds;
	  }
	  else {
		  // si on ne nous envoie pas de duration ou si on nous envoie 0, on envoie la chaine vide
		 return '';
	  }
  };
});

avservicesApp.filter('fmLimitTo', function () {
	  return function (input,limit,symbol) {
		if (input && input.length > limit){
		    input = input.substring(0,limit); // on commence par limiter suivant le nombre
		    input = input.substring(0,input.lastIndexOf(' ')); // on coupe au mot précédent, pour pas avoir de mot incomplet
		    if (symbol)
		    	input += symbol;
		}
		return input;
	  };
	});

avservicesApp.filter('galleryTo', function () {
	  return function (input) {
		if (input){
		    switch(input){
		    case 'PHOTO': return 'photo';break;
		    case 'REPORTAGE': return 'photo';break;
		    case 'VIDEO': return 'video';break;
		    case 'MEDIAGROUP': return 'mediagroupphoto';break;
		    }
		}
	  };
	});



avservicesApp.filter('fmHoraire', function () {
	  return function (input) {
		if (input){
		    var temp = input.split(":");
		    return temp[0]+':'+temp[1];
		}
		return;
	  };
	});

avservicesApp.filter('splitstringfirst', function () {
	  return function (input) {
		if (input){
			    var temp = input.split(",");
			    return temp[0];
		}
		return;
	  };
	});

avservicesApp.filter('splitstringlast', function () {
	  return function (input) {
		if (input){
			    var temp = input.split(",");
			    return temp[1];
		}
		return;
	  };
	});

avservicesApp.filter('fmSize', function () {
	//TODO: il faut gérer les conversions sur ko -> Mo -> Go
	  return function (input) {
		  return input + ' Mo';
	  };
	});

avservicesApp.filter('fmBitrate', function () {
	// TODO:  il faut gérer les conversions de bitrate
	  return function (input) {
		  return input + " kB/s";
	  };
	});

//traduction depuis le json retourné car traduction de données de la bdd, contrairement au label qui utilise le module de traduction
avservicesApp.filter('translateDB', ['language',function (languageProvider) {
	function trans (input,lang) {
		input = input || {};
		lang = lang || languageProvider.getUserLanguage().lang;
		if (input[lang.toUpperCase()])
			return input[lang.toUpperCase()];
		else
			if (input['EN'])
				return input['EN']; // si il n'existe pas de traduction pour cette langue, alors on retourne l'anglais
			else
				return input['FR']; // si il n'existe pas de traduction pour cette langue, ni l'anglais, on retourne le français
  	};
	trans.$stateful = true;
	return trans;
}]);

//traduction depuis le json retourné car traduction de données de la bdd, contrairement au label qui utilise le module de traduction
avservicesApp.filter('displaychannel', ['language',function (languageProvider) {
	function trans (input,lang) {
		input = input || {};
		lang = lang || languageProvider.getUserLanguage().lang;
		if (input == 1)
			return 'EbS';
		else if (input == 2)
			return 'EbS+'; 
		else
			return '';
  	};
	trans.$stateful = true;
	return trans;
}]);


//formattage du copyright selon les rules de la commission
//attention, le champ year n'est pas toujours présent et donc dans ce cas-là on prend l'année courante
//il n'y a qu'un seul holder à chaque fois, si cela change il faudra retourner tous séparé par des ,
avservicesApp.filter('fmCopyright', ['language','$filter',function (languageProvider,$filter) {
	function format (input,lang) {
		if (input){
			lang = lang || languageProvider.getUserLanguage().lang;
			if (input.holders[lang.toUpperCase()])
				return '© ' + input.holders[lang.toUpperCase()][0] + ', ' + (input.year || (new Date()).getFullYear()) ;
			else
				return '© ' + input.holders['EN'][0] + ', ' + (input.year || (new Date()).getFullYear());
		}
		else
			return '© ' + $filter('translate')('label.EU') + ', ' + (new Date()).getFullYear(); // attention, non traduit
	};
	format.$stateful = true;
	return format;
}]);

//formattage du lien selon les rules de la commission
avservicesApp.filter('fmLink', ['$sce',function ($sce) {
	function format (input,type) {
		if (type && type == 'RAPID'){
			return $sce.trustAsHtml("<a class=\"ecl-link ecl-link--standalone\" href=\"http://ec.europa.eu/rapid/start/cgi/guesten.ksh?p_action.gettxt=gt&doc="+input+"|0|RAPID&lg=EN\">IP</a>");
		}
		if (type && type == 'SPEECH'){
			return $sce.trustAsHtml("<a class=\"ecl-link ecl-link--standalone\" href=\"http://ec.europa.eu/rapid/start/cgi/guesten.ksh?p_action.gettxt=gt&doc="+input+"|0|RAPID&lg=EN\">SPEECH</a>");
		}
		else if (input){
			if (input.match(/\.pdf$/)){
				return $sce.trustAsHtml("<a class=\"ecl-link ecl-link--standalone\" href=\""+input+"\"><span class=\"fas fa-file-pdf\"></span></a>");
			}
			if (input.match(/\.docx?$/)){
				return $sce.trustAsHtml("<a class=\"ecl-link ecl-link--standalone\" href=\""+input+"\"><span class=\"fas fa-file-word\"></span></a>");
			}
			if (input.match(/\.xlsx?$/)){
				return $sce.trustAsHtml("<a class=\"ecl-link ecl-link--standalone\" href=\""+input+"\"><span class=\"fas fa-file-excel\"></span></a>");
			}
			if (input.match(/\.jpg$/)){
				return $sce.trustAsHtml("<a class=\"ecl-link ecl-link--standalone\" href=\""+input+"\"><span class=\"fas fa-file-image\"></span></a>");
			}
			if (input.match(/\.mp4$/)){
				return $sce.trustAsHtml("<a class=\"ecl-link ecl-link--standalone\" href=\""+input+"\"><span class=\"fas fa-file-video\"></span></a>");
			}
			if (input.match(/\.mp3?$/)){
				return $sce.trustAsHtml("<a class=\"ecl-link ecl-link--standalone\" href=\""+input+"\"><span class=\"fas fa-file-audio\"></span></a>");
			}
			else
				return $sce.trustAsHtml("<a class=\"ecl-link ecl-link--standalone\" href=\""+input+"\"><span class=\"fas fa-link\"></span></a>");
		}
		else
			return 'rien';
	};
	format.$stateful = true;
	return format;
}]);

avservicesApp.filter('fmLanguage', ['envConstants',function (envConstants) {
	// soit on va chercher dans le mediaorder si on lui en passe un, sinon, va voir dans les constantes
	function format (input,mediaorder) {
		if(mediaorder){
	        for (var j = 0; j < mediaorder.length; j++) {
	        	if (Object.keys(mediaorder[j])[0]==input)
	        		return mediaorder[j][input].TEXT;
	        }
	        // la langue n'a pas de traduction, on renvoie ce qu'on nous a envoyé
	        return input;
		}
		else {
			var tempLang = envConstants.languages.filter(function(item) {return item.hreflang.toUpperCase() == input});
			if (tempLang.length)
				return tempLang[0].label;
			else
		        return input;
		}
	};
	format.$stateful = true;
	return format;
}]);


// input : person = {id: int ,
//                  value: [] array de string,
//                  preferedterm : string}
// formatage des personnalités suivant les règles de la commission (ordre alphabétique sur le prefered-term
avservicesApp.filter('fmPersonnality', function () {
	function format (person) {
		if(person){
		// algo : 1. on prends le preferedterm qui ne contient que 1 et 1 seule virgule
		//        2. si il n'existe pas, on prend le 1er de la liste de value et chaque membre du value ne contient aussi que 1 et 1 seule virgule
		var arrName;
		if (person.preferedterm){
			arrName = person.preferedterm.split(',');
		}
		else {
			arrName = person.value[0].split(',');
		}
		return arrName[1]+' '+arrName[0];
		}
	};
  	format.$stateful = true;
	return format;
});

//permet d'afficher une liste de group de media suivant l'ordre protocolaire
avservicesApp.filter('orderprotocolaire',['envConstants',function (envConstants) {
	return function(items, field, reverse) {
		console.log("in filter ordre 1");
		var filtered = [];
		angular.forEach(items, function(item) {
		  filtered.push(item);
		});
		filtered.sort(function(v1,v2){
		if (envConstants.OrderProtocolaire.indexOf(v1[field]) != -1 && envConstants.OrderProtocolaire.indexOf(v2[field]) != -1)
	    	return (envConstants.OrderProtocolaire.indexOf(v1[field]) < envConstants.OrderProtocolaire.indexOf(v2[field])) ? -1 : 1;
		});
		if(reverse) filtered.reverse();
		return filtered;
	};
}]);


//permet d'afficher une liste de group de media suivant l'ordre protocolaire
avservicesApp.filter('htmlToPlaintext',['envConstants',function (envConstants) {
	    return function(text) {
      return  text ? String(text).replace(/<[^>]+>/gm, '') : '';
    };
}]);

//permet d'afficher une liste de group de media suivant l'ordre protocolaire
avservicesApp.filter('OrderProtocolaire2',['envConstants',function (envConstants) {
	return function(items, reverse) {
		console.log("in filter ordre2");
		var filtered = [];
		angular.forEach(items, function(item) {
		  filtered.push(item);
		});
		filtered.sort(function(v1,v2){
		if (envConstants.OrderProtocolaire.indexOf(v1['ref']) != -1 && envConstants.OrderProtocolaire.indexOf(v2['ref']) != -1)
	    	return (envConstants.OrderProtocolaire.indexOf(v1['ref']) < envConstants.OrderProtocolaire.indexOf(v2['ref'])) ? -1 : 1;
		});
		if(reverse) filtered.reverse();
		return filtered;
	};
}]);
