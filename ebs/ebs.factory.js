
avservicesApp.factory('scheduleFactory', function ($http, envConstants,utilsFactory,$q,$interval) {

	var progEbS = [];
	var progEbSplus = [];


	var getChannel = function (params) {
		if ((params.date == moment().format('YYYYMMDD') && params.channel == 1 && progEbS.length>0) || (params.date == moment().format('YYYYMMDD') && params.channel == 2 &&  progEbSplus.length>0 )){
			// on veut le programme d'aujourd'hui et il a déjà été initialisé, on prends cette valeur
			console.log("on sert le cache", params, progEbS, progEbSplus);
			return $q(function(resolve){resolve();}).then(function (response){if (params.channel==1){ return progEbS;} else {return progEbSplus;}}); 
		}
		else{
//			console.log("on va chercher");
			var GlobalParams = {'type': 'PROGRAM','wt': 'json'};
			 
			var MyPromise = $http({
	            method: 'get',
	            url: envConstants.urlLuceneServices + 'scheduler',
	            params: $.extend(GlobalParams,params),
//	            jsonpCallbackParam: 'json.wrf'
	            });
	        return MyPromise.then(function onSuccess(response){
	        	var formatedData = {
	        						time:moment().format('YYYYMMDD HH:mm:ss'),
	        						summary:utilsFactory.createScheduleList(response.data.response.docs),
	        						warning:utilsFactory.createWarningList(response.data.response.docs)
	        						};
	        	return formatedData;
	        });
		}
    };
 
    // initialisation du programme
	$interval(function(){
		getChannel({channel : 1, date:moment().format('YYYYMMDD') }).then(function(result){progEbS = result;})
		getChannel({channel : 2, date:moment().format('YYYYMMDD') }).then(function(result){progEbSplus = result;})
	},60000);
//	getChannel({channel : 1, date:moment().format('YYYYMMDD') }).then(function(result){progEbS = result;})
//	getChannel({channel : 2, date:moment().format('YYYYMMDD') }).then(function(result){progEbSplus = result;})
    
 
	// input : {time: "YYYMMDD HH:mm:ss", summary : []}
	// où time est la date/heure de retrieve
	// summary est le tableau avec les programmes
	calculCurrentNextOnProg = function (prog,channel, offset){
//		console.log('calcul prg',prog);
		var channel = channel ? channel : (prog.summary.length ? prog.summary[0].channel : prog.warning[0].channel);
		var currentProg =
		 {
			onAir : {
				prog : {prog_id:'',types:'',title:'',hour:'',lang:''  }, 
				seq : {seq_id:'',duration:'',title:'',hour:'',lang:''  }
			},
			nextOn : {
				prog : {prog_id:'',types:'',title:'',hour:'',lang:''  }, 
				seq : {seq_id:'',duration:'',title:'',hour:'',lang:'' }
			},
			warning : undefined
		};
		var EbsProg =(prog && prog.summary) ? prog.summary : [];
		if (prog && prog.warning && prog.warning.length) currentProg.warning = prog.warning[0];
		var now = moment();
		for(var i=EbsProg.length-1;i >= 0 ;i--){
			// on remonte les programmes
//			console.log('i',i);
			for(var j = EbsProg[i].seq.length-1; j >= 0;j--){
//				console.log('j',j);
				// on remonte les séquences
				if (moment(EbsProg[i].seq[j].hour,'HH:mm:ss').isValid() && moment.max(moment(EbsProg[i].seq[j].hour,'HH:mm:ss'),now) === now){
					// si la séquence à un horaire et que cet horaire et avant l'heure actuelle (now > seq.hour)
					if (moment.max(
							moment(EbsProg[i].seq[j].hour,'HH:mm:ss').add(moment.duration(EbsProg[i].seq[j].duration || '03:00:00')),
									now) != now){
						// si on est pendant la séquence (grâce à la durée, si pas de durée, on prend 3h), alors on est sur le bon pour le on Air
						currentProg.onAir.seq = EbsProg[i].seq[j];
						currentProg.onAir.prog = EbsProg[i];
					}
					if (j+1 < EbsProg[i].seq.length){
						// si il existe une séquence après dans le programme, alors c'est le nextOn
//						console.log('j+1 is nexton',j);
						currentProg.nextOn.seq = EbsProg[i].seq[j+1];
						currentProg.nextOn.prog = EbsProg[i];
						break;
					}
					else {
//						console.log('j+1 is not nexton',j);

						if (i+1 < EbsProg.length){
							// si on peut aller au programme suivant, alors c'est le nextOn
//							console.log('i+1 is nexton',j);

						currentProg.nextOn.seq = EbsProg[i+1].seq[0];
						currentProg.nextOn.prog = EbsProg[i+1];
						}
						break;
					}
			}
			}
			if (currentProg.nextOn.prog == EbsProg[i] || currentProg.nextOn.prog == EbsProg[i+1]) break;
		}
		// si on a rien trouvé pour aujourd'hui
		if (! currentProg.nextOn.prog.prog_id || (moment.max(moment(currentProg.nextOn.seq.hour,'HH:mm:ss').add(moment.duration(currentProg.nextOn.seq.duration || '03:00:00')),now) == now)){
			console.log('dans calcul demain')
			// il faut aller lire le programme du jour suivant (ou plus loin si week-end ou vacances)
			getChannel({channel :channel, date:moment().add(1,'d').format('YYYYMMDD') }).then(function(nextDay){
				// le lendemain (souvent samedi)
				if (nextDay.summary && nextDay.summary.length){
//					console.log('samedi');
					currentProg.nextOn.seq = nextDay.summary[0].seq[0];
					currentProg.nextOn.prog = nextDay.summary[0];
					return currentProg;
				}
				else {
					// le surlendemain (souvent dimanche)
					getChannel({channel :channel, date:moment().add(2,'d').format('YYYYMMDD') }).then(function(nextDay){
						if (nextDay.summary && nextDay.summary.length) {
//							console.log('dimanche');
							currentProg.nextOn.seq = nextDay.summary[0].seq[0];
							currentProg.nextOn.prog = nextDay.summary[0];
							return currentProg;
						}
						else {
							// le sur-surlendemain (souvent le lundi)
							getChannel({channel :channel, date:moment().add(3,'d').format('YYYYMMDD') }).then(function(nextDay){
								if (nextDay.summary && nextDay.summary.length){
									currentProg.nextOn.seq = nextDay.summary[0].seq[0];
									currentProg.nextOn.prog = nextDay.summary[0];
									return currentProg;
								}
								else {
									currentProg =
									 {
										onAir : {
											prog : {prog_id:'',types:'',title:'',hour:'' }, 
											seq : {seq_id:'',duration:'',title:'',hour:'' }
											},
										nextOn : {
											prog : {prog_id:'',types:'',title:{'EN':'see you later'},hour:'06:00:00' },
											seq : {seq_id:'',duration:'',title:{'EN':'see you later'},hour:'06:00:00' }
											}
									};
									return currentProg;

									}
								});
							}
						});
				}
			});
		}
		else {
			return currentProg;
		}
	}

	return {
        getChannel: getChannel,
        calculCurrentNextOnProg:calculCurrentNextOnProg,
        getCurrentEbSplus: function(){
        	return progEbSplus;
        },
        getCurrentEbS: function(){
//        	console.log('appel current Ebs');
        	return progEbS;
        }
    };
    
});

