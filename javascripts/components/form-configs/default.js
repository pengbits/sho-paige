// default dataType is 'text'
// default inputType is 'text'
const CONFIG = {
  name:'promo', 
  context: "default",
  head:{
    name:'head',
    inline:true,
    children: [{
      "name"      : "position",
      "dataType"  : "number", // creating a css issue but this is where we wanna go with this..
      "inputType" : "text",
      "validate"  : {'isNumber':true, 'minValue':0, 'maxValue':1000}
    },{
      "name"      : "displayContext",
      "inputType" : "text",
      "renderConditions" : {'isSearchContext' : true}  // the form component will compare its props against this criteria at render-time
    },{
      "name"      : "name",
      "inputType" : "text",
      "validate"  : {'required':true, 'maxLength':200}
    },{
      "name"      : "startDate",
      "dataType"  : "datetime",
      "inputType" : "datetime",
      "validate"  : {'validForEndDate': true }
    },{
      "name"      : "endDate",
      "dataType"  : "datetime",
      "inputType" : "datetime",
      "validate"  : {'validForStartDate': true }
    }]
  },
  body:{
    name: "body",
    children : [{
      "name"      : "title",
      "inputType" : "text",
      "validate"  : {'required':true, 'maxLength':200}
    },{
      "name"      : "theme",
      "inputType" : "text",
      "validate"  : {'maxLength':25}
    },{
      "name"      : "panelLinkType",
      "dataType"  : "text",
      "inputType" : "select"
    },{
      "name"      : "panelLink",
      "dataType"  : "text",
      "inputType" : "text"
    },{
      "name"      : "topLine",
      "dataType"  : "text",
      "inputType" : "text",
      "validate"  : {'maxLength':150}
    },{
      "name"      : "description",
      "dataType"  : "text",
      "inputType" : "textArea"
    },{
      "name"      : "seriesId",
      "dataType"  : "number",
      "inputType" : "number",
      "validate"  : {'isNumber':true, 'minValue':0, 'maxLength' : 10}
    },{
      "name"      : "seasonNumber",
      "dataType"  : "number",
      "inputType" : "number",
      "validate"  : {'isNumber':true, 'minValue':0, 'maxLength' : 10}
    },{
      "name"      : "showId",
      "dataType"  : "number",
      "inputType" : "number",
      "validate"  : {'isNumber':true, 'minValue':0, 'maxLength' : 10}
    },{
      "name"      : "largeImageUrl",
      "dataType"  : "imagePath",
      "inputType" : "imagePath",
      "validate"  : {'enforceHttps':true,'maxLength':150 }
    },{
      "name"      : "smallImageUrl",
      "dataType"  : "imagePath",
      "inputType" : "imagePath",
      "validate"  : {'enforceHttps':true, 'maxLength':150 }      
    },{
      "name"      : "subtitleType",
      "dataType"  : "text",
      "inputType" : "select",
      "options"   : ["static","dynamic"]
    },{
      "name"      : "staticSubtitle",
      "dataType"  : "text",
      "inputType" : "text"
    },{
      "name"      : "ctaType",
      "dataType"  : "text",
      "inputType" : "select"
    },{
      "name"      : "ctaLabel",
      "dataType"  : "text",
      "inputType" : "text",
      "validate"  : {'maxLength':150}
    },{
      "name"      : "ctaLink",
      "dataType"  : "text",
      "inputType" : "text",
      "validate"  : {'maxLength':1000}
    }]
  },
  footer:{
    name: "footer",
    children : [{
      "name"      : "setDraftMode",
      "dataType"  : "boolean",
      "inputType" : "checkbox",
      "input"     : {"name":"setDraftMode"}
    }]
  }
}

export default CONFIG

export const imagePathFields = CONFIG.body.children.filter(field=>field["inputType"] == "imagePath").map(field=>field.name)