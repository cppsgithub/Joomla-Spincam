{
	"class": "form-horizontal",
	"rows": [
		{
			"class": "form-group",
			"cols": [
				{
					"class": "col-sm-12",
					"settings": {
						"title": {
							"type": "text",
							"label": "Title"
						}
					}
				},
				{
					"class": "col-sm-12",
					"settings": {
						"target": {
							"type": "select",
							"label": "Target",
							"options": [
								{"value": "_blank", "label" : "Blank"},
								{"value": "_self", "label" : "Self"},
								{"value": "_parent", "label" : "Parent"},
								{"value": "_top", "label" : "Top"}
							]
						}
					}
				},
				{
					"class": "col-sm-12",
					"settings": {
						"items": {
							"type": "list-creator",
							"label": "Social Icon"
						}
					}
				},
				{
					"class": "col-sm-12",
					"settings": {
						"class-prefix": {
							"type": "text",
							"label": "prefix-class"
						}
					}
				}
			]
		}
	]
}
