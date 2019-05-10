// default dataType is 'text'
// default inputType is 'text'
const MAX_INTEGER_SIZE = 1e+150;
const CONFIG = {
  name:'promo', 
  context: "series-wibble",
  head:{
    name:'head',
    inline:true,
    children: [{
      "name"      : "position",
      "dataType"  : "number", // creating a css issue but this is where we wanna go with this..
      "inputType" : "text",
      "validate"  : {'isNumber':true, 'minValue':0, 'maxValue':1000}
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
      "name"      : "panelLinkType",
      "dataType"  : "text",
      "inputType" : "text"
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
      "inputType" : "text",
      "validate"  : {'maxLength':150 }
    },{
      "name"      : "smallImageUrl",
      "dataType"  : "imagePath",
      "inputType" : "text",
      "validate"  : {'maxLength':150 }      
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
export const INPUTS_IN_HEAD = CONFIG.head.children.map(i => i.name)