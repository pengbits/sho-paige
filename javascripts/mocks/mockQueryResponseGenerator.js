const lorem_ipsum_names = [
  'Bacon ipsum dolor amet spare ribs capicola',
  'Swine pork loin pancetta leberkas salami tail pork belly',
  'Cupim ham hock. Short ribs biltong jowl',
  'Chicken short loin tenderloin bacon T-bone',
  'Sirloin porchetta capicola brisket.',
  'Ball tip strip steak rump pork chop.',
  'Bacon turkey venison, frankfurter',
  'Corned beef buffalo pig jerky tri-tip.',
  'Boudin tenderloin bacon ribeye beef ribs pancetta swine.',
  'Beef ribs meatball landjaeger boudin',
  'Leberkas sausage frankfurter pork belly bresaola ham',
  'Capicola ground round tail drumstick shoulder.',
  'Shoulder fatback pork loin sausage',
  'Filet mignon andouille tri-tip.',
  'Swine meatloaf prosciutto frankfurter sirloin.',
  'Ground round boudin swine beef',
  'Bacon chicken fatback pancetta',
  'Rump andouille tenderloin salami.',
  'Bacon swine sausage pig, ball tip shoulder kielbasa',
  'Hamburger salami prosciutto picanha frankfurter ribeye. ',
  'Pancetta meatball filet mignon.',
  'Buffalo fatback t-bone boudin',
  'Leberkas strip steak venison short loin.',
  'Pork tenderloin meatloaf chicken ball',
  'Bacon beef turducken ribeye'
];

const promo = {
  "name": "the-affair-first-look-mee-fun! (Copy)",
  "id": 1,
  "title": "the affair first look tacos!",
  "ctaLabel": null,
  "ctaLink": null,
  "position": 100,
  "seasonNumber": null,
  "seriesId": null,
  "showId": null,
  "startDate": 1534963304000,
  "endDate": 1569951331000,
  "topLine": null,
  "panelLinkType": null,
  "panelLink": null,
  "subtitleType": null,
  "staticSubtitle": null,
  "smallImageUrl": null,
  "largeImageUrl": "https://www.sho.com/site/image-bin/images/1031103_4_0/1031103_4_0_prm-keyart_1700x1063.jpg",
  "ctaType": null,
  "createdDate": 1536869695000,
  "updatedDate": null,
  "contentBlockId": 224,
  "description": null
}

let response = {
  "timestamp": 1536945519697,
  "status": {
    "code": 200,
    "success": true,
    "message": "OK",
    "errors": []
  },
  "totalPages": 1,
  "size": 0,
  "nextPage": null,
  "previousPage": null,
  "page": {
    "content": [],
    "last": null,
    "totalPages": 1,
    "totalElements": 0,
    "size": 100,
    "number": 0,
    "first": null,
    "sort": null,
    "numberOfElements": null
  }
}

const mockQueryResponseGenerator = (numPromos, responsePageNumber) => {
  const totalPages = Math.ceil(numPromos/100)
  const newResponse = JSON.parse(JSON.stringify(response))//deep copies generic response object

  //Generate each individual promo and adds them to the response content. Increment anything in the response that deals with how many promos there are in the content list
  let counter = 1;
  let counterMax = ((responsePageNumber*100)-numPromos) < 0 ? 100 : ((responsePageNumber*100)-numPromos)
  if(counterMax > 100){
    throw new Error('That is not a valid responsePageNumber')
  }
  while(counter <= counterMax && counterMax<=100){
    const newPromo = JSON.parse(JSON.stringify(promo))
    const newPromoName =  lorem_ipsum_names[(counter % 25)]
    newPromo.name = newPromoName
    newPromo.id = counter
    // newPromo.id = Math.floor(Math.random() * 1000) 
    newResponse.page.content.push(newPromo)
    newResponse.page.numberOfElements = counter
    newResponse.page.size = counter
    counter = counter + 1
  }
 
  //Set nextPage and previousPage on the response, if they exist 
  if(responsePageNumber < totalPages){
    let mockApi = "/mock/api/paige/promotions/" + (responsePageNumber+1)
    newResponse.nextPage = mockApi
  } 
  if(responsePageNumber > 1 ){
    let mockApi = "/mock/api/paige/promotions/" + (responsePageNumber-1)
    newResponse.previousPage = mockApi
  } 

  //Set the total number of response pages available and total number of promos on the response object
  newResponse.size = numPromos
  newResponse.totalPages = totalPages
  newResponse.page.totalPages = totalPages
  newResponse.page.totalElements = numPromos

  //todo => set first, last and sort

  return newResponse
}

export default mockQueryResponseGenerator