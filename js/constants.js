// les constantes de l'application
avservicesApp.constant('envConstants', 
    {
	// config des url de streaming EbS et EbS+
	"ebs_url":'//ott.ec.streamcloud.be/live/disk1/EBS/hls_or/EBS.m3u8',
	"ebs_url_cloud":'//d2a8k8y31syz0q.cloudfront.net/live/disk1/EBS/hls_or/EBS.m3u8',
	"ebsplus_url":'//ott.ec.streamcloud.be/live/disk1/EBSplus/hls_or/EBSplus.m3u8',
	"ebsplus_url_cloud":'//d2a8k8y31syz0q.cloudfront.net/live/disk1/EBSplus/hls_or/EBSplus.m3u8',

	// config des url pour les webservices : beluga2, tinify , log
    "urlLuceneServices_acceptance": "https://b6golj1og8.execute-api.eu-west-1.amazonaws.com/acceptance/", 
	"urlLuceneServices": "https://nbzac1j6ve.execute-api.eu-west-1.amazonaws.com/TEST/", 
    "urlLuceneServices_prod": "https://gfdwwnbuul.execute-api.eu-west-1.amazonaws.com/avsportal/", 
    
    "errorServer":"https://yb92tzm5s4.execute-api.eu-west-1.amazonaws.com/DEV",
    "UrlChannel":"/avservices/embed/index.html?",
    "urlPhotoCdn": "//ec.europa.eu/avservices/avs/files/video6/repository/prod/photo/store/",
    "urlVttCdn": "http://ec.europa.eu/avservices/avs/files/video6/repository/prod/file/store/",
//	"urlEmbededVideo": "//ec.europa.eu/avservices/play.cfm?ref=",
	"urlWebanalytics":"https://webanalytics.ec.europa.eu/",
	
	// config de l'id du focus
	"featuredtop":"M-002166",

	// les paramètres de config
	"preferredLanguage": ['INT','EN','FR','DE'], 
		"OrderProtocolaire":['754','775','771','785','797','772','798','794','789','791','792','786','778','784','781',
							'782','780','795','783','774','777','779','776','787','773','793','907','800','1044','790','788'],
		"categories":[
			{"id":"Stockshot","name":{'EN':"Stockshot",'FR':"Vidéos d'illustration"},"mediatype":"VIDEO","Genrethes":'13,14,16,24,30,38,41'},
			{"id":"Clip","name":{'EN':"Clip",'FR':"Clip"},"mediatype":"VIDEO","Genrethes":'15,21,25,42'},
			{"id":"VideoNews","name":{'EN':"Video News",'FR':"Vidéos d'actualités"},"mediatype":"VIDEO","Genrethes":'6,7,8,9,10,27,29,31,39,40,44'},
			{"id":"Photonews","name":{'EN':"Photo News", 'FR':"Photos d'actualités"},"mediatype":"PHOTO","Genrethes":'9,10,11,13'},
      {"id":"Illustration","name":{'EN':"Creative pics",'FR':"Photos d'illustration"},"mediatype":"PHOTO","Genrethes":'1,6,7,12,17'},
      {"id":"Portrait","name":{'EN':"Portrait",'FR':"Portrait"},"mediatype":"PHOTO","Genrethes":'2'},
			{"id":"AudioNews","name":{'EN':"AudioNews"},"mediatype":"AUDIO","Genrethes":''},
			{"id":"Press briefing","name":{'EN':"Press briefing",'FR':"Points presse"},"mediatype":"VIDEO","Genrethes":'63,64,67'},
			{"id":"Press conference","name":{'EN':"Press conference",'FR':"Conférence de presse"},"mediatype":"VIDEO","Genrethes":'39,40,62'},
		],
		"profile_types":[
			{"id":"1","name":{'EN':'Journalist - Press Agency','FR':'Journaliste - Agence de presse'},"group":{'EN':'Journalist','FR':'Journaliste'}},
			{"id":"2","name":{'EN':'Journalist - Written Press','FR':'Journaliste - Presse écrite'},"group":{'EN':'Journalist','FR':'Journaliste'}},
			{"id":"3","name":{'EN':'Journalist - Radio','FR':'Journaliste - Presse parlé - radio'},"group":{'EN':'Journalist','FR':'Journaliste'}},
			{"id":"4","name":{'EN':'Journalist - TV','FR':'Journaliste - TV'},"group":{'EN':'Journalist','FR':'Journaliste'}},
			{"id":"5","name":{'EN':'Journalist - Web','FR':'Journaliste - Web'},"group":{'EN':'Journalist','FR':'Journaliste'}},
			{"id":"6","name":{'EN':'Government/Institution','FR':'Gouvernement/Institution'},"group":{'EN':'Government','FR':'Gouvernement'}},
			{"id":"7","name":{'EN':'Education - Teacher','FR':'Education - Professeur'},"group":{'EN':'Education','FR':'Education'}},
			{"id":"8","name":{'EN':'Education - Student','FR':'Education - Etudiant'},"group":{'EN':'Education','FR':'Education'}},
			{"id":"9","name":{'EN':'Business','FR':'Business'},"group":{'EN':'Business','FR':'Business'}},
			{"id":"10","name":{'EN':'Citizen','FR':'Citoyen'},"group":{'EN':'Citizen','FR':'Citoyen'}}
		],
		"program_type":[
			{"id":"1"},
			{"id":"2","lg_text":{'EN':'To be confirmed','FR':'A confirmer'},"sh_text":{'EN':'TBC','FR':'AC'}},
			{"id":"3","lg_text":{'EN':'Followed by','FR':'Suivi de'},"sh_text":{'EN':'Cancel','FR':'Annul.'}},
			{"id":"4","lg_text":{'EN':'Cancelled','FR':'Annulé'},"sh_text":{'EN':'Cancel','FR':'Annul.'}},
			{"id":"5","lg_text":{'EN':'Time change','FR':'Changement d\'heure'},"sh_text":{'EN':'Journalist','FR':'Journaliste'}},
			{"id":"6","lg_text":{'EN':'New','FR':'Nouveau'},"sh_text":{'EN':'Journalist','FR':'Journaliste'}},
			{"id":"7","lg_text":{'EN':'Rerun','FR':'Rediffusion'},"sh_text":{'EN':'Journalist','FR':'Journaliste'}},
			{"id":"8","lg_text":{'EN':'Warning','FR':'Notice'},"sh_text":{'EN':'Journalist','FR':'Journaliste'}},
			{"id":"9","lg_text":{'EN':'Delayed','FR':'Déplacé'},"sh_text":{'EN':'Journalist','FR':'Journaliste'}},
			{"id":"11","lg_text":{'EN':'a','FR':'Journaliste - Agence de presse'},"sh_text":{'EN':'Journalist','FR':'Journaliste'}},
			{"id":"12","lg_text":{'EN':'Time unknown','FR':'Temps pas connu'},"sh_text":{'EN':'Journalist','FR':'Journaliste'}},
			{"id":"13","lg_text":{'EN':'Expected at','FR':'Attendu pour'},"sh_text":{'EN':'Journalist','FR':'Journaliste'}},
			{"id":"14","lg_text":{'EN':'Details to follow','FR':'Détails à suivre'},"sh_text":{'EN':'Journalist','FR':'Journaliste'}},
			{"id":"15","lg_text":{'EN':'Following college meeting','FR':'Suivi de la réunion du collège'},"sh_text":{'EN':'Journalist','FR':'Journaliste'}},
		],
		"institution":[
			{"doc_ref":"2618","titles_json":{'EN':'European Parliament','FR':'Parlement Européen'},"shortcut":{'EN':'EP','FR':'PE'}},
			{"doc_ref":"2619","titles_json":{'EN':'Council of the European Union','FR':"Conseil de l'Union Européenne"},"shortcut":{'EN':'CEU','FR':'CUE'}},
			{"doc_ref":"2620","titles_json":{'EN':'European Commission','FR':'Commission Européenne'},"shortcut":{'EN':'EC','FR':'CE'}},
//			{"doc_ref":"2621","titles_json":{'EN':'Court of Justice of the European Union','FR':''},"shortcut":{'EN':'','FR':''}},
//			{"doc_ref":"2671","titles_json":{'EN':'Council of Europe','FR':"Conseil de l'Europe"},"shortcut":{'EN':'','FR':''}},
//			{"doc_ref":"2672","titles_json":{'EN':'Council of Europe','FR':"Conseil de l'Europe"},"shortcut":{'EN':'','FR':''}},
//			{"doc_ref":"2685","titles_json":{'EN':'European Parliament and Commission','FR':'Parlement Européen et Commission'},"shortcut":{'EN':'','FR':''}},
		],
"languages": [
    {
      "href": "index_int",
      "hreflang": "int",
      "label": "Original",
      "lang": "",
      "website":false
    },
    {
      "href": "index_or",
      "hreflang": "or",
      "label": "Original",
      "lang": "",
      "website":false,
      "order": 1
    },
    {
      "href": "index_en",
      "hreflang": "en",
      "isActive": true,
      "label": "English",
      "lang": "en",
      "website":true,
      "order": 2
    },
    {
      "href": "index_fr",
      "hreflang": "fr",
      "label": "Français",
      "lang": "fr",
      "website":true,
      "order": 3
    },
    {
      "href": "index_de",
      "hreflang": "de",
      "label": "Deutsch",
      "lang": "de",
      "website":true,
      "order": 4
    },
    {
      "href": "index_it",
      "hreflang": "it",
      "label": "Italiano",
      "lang": "it",
      "website":false,
      "order": 5
    },
    {
      "href": "index_es",
      "hreflang": "es",
      "label": "Español",
      "lang": "es",
      "website":false,
      "order": 6
    },
    {
      "href": "index_el",
      "hreflang": "el",
      "label": "ελληνικά",
      "lang": "el",
      "website":false,
      "order": 7
    },
    {
      "href": "index_pt",
      "hreflang": "pt",
      "label": "Português",
      "lang": "pt-pt",
      "website":false,
      "order": 8
    },
    {
      "href": "index_nl",
      "hreflang": "nl",
      "label": "Nederlands",
      "lang": "nl",
      "website":false,
      "order": 9
    },
    {
      "href": "index_da",
      "hreflang": "da",
      "label": "Dansk",
      "lang": "da",
      "website":false,
      "order": 10
    },
    {
      "href": "index_fi",
      "hreflang": "fi",
      "label": "Suomi",
      "lang": "fi",
      "website":false,
      "order": 11
    },
    {
      "href": "index_sv",
      "hreflang": "sv",
      "label": "Svenska",
      "lang": "sv",
      "website":false,
      "order": 12
    },
    {
      "href": "index_cs",
      "hreflang": "cs",
      "label": "Čeština",
      "lang": "cs",
      "website":false,
      "order": 13
    },
    {
      "href": "index_et",
      "hreflang": "et",
      "label": "Eesti",
      "lang": "et",
      "website":false,
      "order": 14
    },
    {
      "href": "index_lv",
      "hreflang": "lv",
      "label": "Latviešu",
      "lang": "lv",
      "website":false,
      "order": 15
    },
    {
      "href": "index_lt",
      "hreflang": "lt",
      "label": "Lietuvių",
      "lang": "lt",
      "website":false,
      "order": 16
    },
    {
      "href": "index_hu",
      "hreflang": "hu",
      "label": "Magyar",
      "lang": "hu",
      "website":false,
      "order": 17
    },
    {
      "href": "index_mt",
      "hreflang": "mt",
      "label": "Malti",
      "lang": "mt",
      "website":false,
      "order": 18
    },
    {
      "href": "index_pl",
      "hreflang": "pl",
      "label": "Polski",
      "lang": "pl",
      "website":false,
      "order": 19
    },
    {
      "href": "index_sk",
      "hreflang": "sk",
      "label": "Slovenčina",
      "lang": "sk",
      "website":false,
      "order": 20
    },
    {
      "href": "index_sl",
      "hreflang": "sl",
      "label": "Slovenščina",
      "lang": "sl",
      "website":false,
      "order": 21
    },
    {
      "href": "index_bg",
      "hreflang": "bg",
      "label": "български",
      "lang": "bg",
      "website":false,
      "order": 22
    },
    {
      "href": "index_ro",
      "hreflang": "ro",
      "label": "Română",
      "lang": "ro",
      "website":false,
      "order": 23
    },
    {
      "href": "index_ga",
      "hreflang": "ga",
      "label": "Gaeilge",
      "lang": "ga",
      "website":false,
      "order": 24
    },
    {
      "href": "index_hr",
      "hreflang": "hr",
      "label": "Hrvatski",
      "lang": "hr",
      "website":false,
      "order": 25
    },
    {
      "href": "index_ka",
      "hreflang": "ka",
      "label": "Georgian",
      "lang": "ka",
      "website":false
    }
  ]
    }
)
