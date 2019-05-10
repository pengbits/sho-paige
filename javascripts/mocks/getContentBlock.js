// API GET /api/paige/content-block/{id}
// we are unlikely to need to load this via xhr, since the
// the active contentBlock's id will be passed into the app via the jsp
import Promo from '../models/Promo'
const timestamp = (dateStr) => (Promo.toTimestamp(Promo.parseDate(dateStr)))

export default {
  "timestamp": 1533231922482,
  "status": {
    "code": 200,
    "success": true,
    "message": "OK",
    "errors": []
  },
  "payload": {
    "name": "Primary Hero",
    "id": 312,
    "contentBlockKey": "342-primary-hero",
    "contextId": 342,
    "createdDate": 1532977810000,
    "updatedDate": 1532968789600,
    "promotionList" : [{
      "id": 1,
      "name": "Apples The Affair Season 4 Lookahead", 
      "title": "Find out what's ahead on Season 4",
      "subTitle": "Don't miss new episodes Sundays at 9PM ET/PT",
      "smallImageUrl": "https://www.sho.com/site/image-bin/images/1031103_4_0/1031103_4_0_pro05_640x360.jpg",
      "imageUrl": "https://www.sho.com/site/image-bin/images/1031103_4_0/1031103_4_0_pro05_640x360.jpg",
      "ctaLabel": null,
      "ctaType": "series promo video",
      "ctaLink": "/video/62044/the-affair-season-4-lookahead",
      "startDate": timestamp('01-01-19'),
      "endDate":   timestamp('01-15-19'),
      "isDraft": true,
      "position": 20
    }, {
      "id": 2,
      "name": "Zuccini The Affair 401 Preview",
      "title": "Watch a preview of Season 4",
      "subTitle": "Don't miss the Season 4 Premiere tonight at 9PM ET/PT",
      "smallImageUrl": "https://www.sho.com/site/image-bin/images/1031103_4_0/1031103_4_0_pro01_640x360.jpg",
      "imageUrl": "https://www.sho.com/site/image-bin/images/1031103_4_0/1031103_4_0_pro01_640x360.jpg",
      "ctaLabel": null,
      "ctaType": "series promo video",
      "ctaLink": "/video/61066/the-affair-season-4",
      "startDate": timestamp('01-17-19'),
      "endDate":   timestamp('01-28-19'),
      "isDraft": true,
      "position": 10
    }, {
      "id": 3,
      "name": "Grapes The Affair Season 4 Character Focus - Allison and Cole",
      "title": "Alison and Cole in Season 4",
      "subTitle": null,
      "smallImageUrl": "https://www.sho.com/site/image-bin/images/1031103_4_0/1031103_4_0_prf02_640x360.jpg",
      "imageUrl": "https://www.sho.com/site/image-bin/images/1031103_4_0/1031103_4_0_prf02_640x360.jpg",
      "ctaLabel": null,
      "ctaType": "bts video",
      "ctaLink": "/video/61962/the-affair-characters-alison-cole-and-ben",
      "startDate": timestamp('01-10-19'),
      "endDate":  null,
      "isDraft": true,
      "position": 30
    }, {
      "id": 4,
      "name": "Berries The Affair Season 4 Same Mistakes Spot",
      "title": "Check out a preview of Season 4",
      "subTitle": null,
      "smallImageUrl": "https://www.sho.com/site/image-bin/images/1031103_4_0/1031103_4_0_pro03_640x360.jpg",
      "imageUrl": "https://www.sho.com/site/image-bin/images/1031103_4_0/1031103_4_0_pro03_640x360.jpg",
      "ctaLabel": null,
      "ctaType": "series promo video",
      "ctaLink": "/video/61695/the-affair-same-mistakes",
      "startDate": timestamp('01-05-19'),
      "endDate":   timestamp('01-20-19'),
      "isDraft": true,
      "position": 100
    }, {
      "id": 5,
      "name": "Squash The Affair Season 4 Character Focus - Noah and Vik",
      "title": "Find out how Noah really feels about Vik",
      "subTitle": null,
      "smallImageUrl": "https://www.sho.com/site/image-bin/images/1031103_4_0/1031103_4_0_prf01_640x360.jpg",
      "imageUrl": "https://www.sho.com/site/image-bin/images/1031103_4_0/1031103_4_0_prf01_640x360.jpg",
      "ctaLabel": null,
      "ctaType": "bts video",
      "ctaLink": "/video/61947/the-affair-characters-helen-vik-and-noah",
      "startDate": null,
      "endDate":   timestamp('01-20-19'),
      "isDraft": false,
      "position": 20
    }, {
      "id": 6,
      "name": "Toast The Affair Season 2 TBT preview",
      "title": "Catch Up on Seasons 1-3 for TBT preview",
      "subTitle": "Don't miss new episodes Sundays at 9PM ET/PT",
      "smallImageUrl": "https://www.sho.com/site/image-bin/images/1031103_4_0/1031103_4_0_rcp01_640x360.jpg",
      "imageUrl": "https://www.sho.com/site/image-bin/images/1031103_4_0/1031103_4_0_rcp01_640x360.jpg",
      "ctaLabel": null,
      "ctaType": "series promo video",
      "ctaLink": "/video/62285/the-affair-series-recap",
      "startDate": timestamp('01-19-19'),
      "endDate":   timestamp('01-21-19'),
      "position": 50
    },{
      "id": 7,
      "name": "Carrots The Affair Season 1-3 Recap",
      "title": "Catch Up on Seasons 1-3 of The Affair in 30 seconds",
      "subTitle": "Don't miss new episodes Sundays at 9PM ET/PT",
      "smallImageUrl": "https://www.sho.com/site/image-bin/images/1031103_4_0/1031103_4_0_rcp01_640x360.jpg",
      "imageUrl": "https://www.sho.com/site/image-bin/images/1031103_4_0/1031103_4_0_rcp01_640x360.jpg",
      "ctaLabel": null,
      "ctaType": "series promo video",
      "ctaLink": "/video/62285/the-affair-series-recap",
      "startDate": timestamp('01-10-19'),
      "endDate":   timestamp('01-12-19'),
      "isDraft": false,
      "position": 50
    },{
      "id": 8,
      "name": "Cantelope Penny Dread Season 2 TBT preview",
      "title": "Cantelope Penny Dread Seasons 1-3 for TBT preview",
      "subTitle": "Don't miss new episodes Sundays at 9PM ET/PT",
      "smallImageUrl": "https://www.sho.com/site/image-bin/images/1031103_4_0/1031103_4_0_rcp01_640x360.jpg",
      "imageUrl": "https://www.sho.com/site/image-bin/images/1031103_4_0/1031103_4_0_rcp01_640x360.jpg",
      "ctaLabel": null,
      "ctaType": "series promo video",
      "ctaLink": "/video/62285/the-affair-series-recap",
      "startDate": timestamp('01-10-19'),
      "endDate":   timestamp('01-15-19'),
      "position": 50
    }]
  }
}