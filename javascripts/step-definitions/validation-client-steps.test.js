// frameworks
import moxios from 'moxios'
import {defineFeature, loadFeature} from 'jest-cucumber';

// mocks
import mockStore, { expectActions, resultingState, respondWithMockResponse} from '../mockStore'
import updatePromoMock from '../mocks/updatePromo'
import contentBlockMock from '../mocks/getContentBlock'

// reducers
import reducer from '../redux/promos'

// validation rules, which'll be applied to form
import FormConfig from '../components/PromoFormConfig'
import {getRules, getValidator} from '../utils/validation'

// models
import Promo from '../models/Promo'

// settings
const PAIGE_ROOT = './library/javascripts/tools/paige';

// misc
defineFeature(loadFeature(PAIGE_ROOT + '/features/validation-client.feature'), test => {  
  
  let attrs
  let rules
  let validator
  
  const given_there_are_validation_rules = (strategy) => {
    validator = getValidator(['default',{'config':FormConfig}])
    expect(typeof validator).toBe('function')
  };
  
  test('Create/Edit a Promo and enter all Required Fields', ({ given, when, then, pending }) => {
    given('there are validation rules', given_there_are_validation_rules)

    when('I enter all of the required fields', () => {
      attrs = {
        'name':'the affair 501 teaser',
        'title':'The Affair First Look Tacos'
      }
    });
    
    then('there will not be any errors', () => {
      const errors  = validator(attrs)
      expect(errors).toEqual({})
    });
  });
    
  test('Create/Edit a Promo and omit some Required Fields', ({ given, when, then, pending }) => {
    given('there are validation rules', given_there_are_validation_rules)

    when('I enter some of the required fields', () => {
      attrs =  {
        'name':'the affair 501 teaser'
      }
    });

    then('there will be some errors', () => {
      const errors  = validator(attrs)
      expect(errors.title).toEqual('title can\'t be blank')
    });
  });

  test('Create/Edit a Promo and enter forbidden characters', ({ given, when, then, pending }) => {
    given('there are validation rules', given_there_are_validation_rules)
    
    given('non-alphanumeric characters are forbidden', () => {
      validator = getValidator(['default'], {
        'ctaLink': {'forbidden' : /[^a-z0-9-_]/}
      })
    })
    
    when('I enter forbidden characters', () => {
      attrs = {
        'name':'the affair 501 teaser',
        'title':'The Affair First Look Tacos',
        'ctaLink':'naughty-text$%-url'
      }
    });

    then('there will be some errors', () => {
      const errors  = validator(attrs)      
      expect(errors.ctaLink).toEqual('ctaLink contains forbidden characters')
    });
  });


  test('Create/Edit a Promo and enter non-numeric values for ids', ({ given, when, then, pending }) => {
    given('there are validation rules', given_there_are_validation_rules)
    
    given('ids must be numbers', () => {
      validator = getValidator(['default'], {
        'seriesId'    : {'isNumber':true},
        'seasonNumber': {'isNumber':true},
        'showId'      : {'isNumber':true}
      })
    })

  	when('I enter forbidden characters', () => {
      attrs = {
        'seriesId':'a',
        'showId':'b',
        'seasonNumber':'c'
      }
    })
    
    then('there will be some errors', () => {
      const errors  = validator(attrs)      
        
      expect(errors.seriesId).toEqual('seriesId must be a number')
      expect(errors.showId).toEqual('showId must be a number')
      expect(errors.seasonNumber).toEqual('seasonNumber must be a number')
    })
  });
  
  
  test('Create/Edit a Promo and enter an excessively high value for some fields', ({ given, when, then }) => {
    given('there are validation rules', given_there_are_validation_rules)

    when('I enter an excessively high value for position and seasonNumber', () => {
      let seasonNumber=''; for(var c=1;c<12; c++) { seasonNumber+= '9'; }

      attrs = {
        'name':'the affair 501 teaser',
        'title':'The Affair First Look Tacos',
        'position': 2000,
        seasonNumber
      }
    })

    then('there will be some errors', () => {
      const errors  = validator(attrs)      
      expect(errors.position).toEqual('position can\'t be greater than 1000')
      expect(errors.seasonNumber).toEqual('seasonNumber can\'t be longer than 10 digits')
    })
  })
  
  test('Create/Edit a Promo with excessively long values for some fields', ({ given, when, then, pending }) => {
    given('there are validation rules', given_there_are_validation_rules)

    when('I enter an excessively long string for smallImageUrl', () => {
      let blah = '',i; for(i=0;i<151;i++){ blah += 'x' }
      attrs = {
        'title' :'A Mischievous Promo',
        'name'  :'A Mischievous Promo',
        'weight':600,
        'smallImageUrl' : blah
      }
    })
    then('there will be some errors', () => {
      const errors  = validator(attrs)  
      expect(errors.smallImageUrl).toContain('smallImageUrl can\'t be longer than 150')
    })
  })

  
  test('Create/Edit a Promo and enter a string value for position', ({ given, when, then }) => {
    given('there are validation rules', given_there_are_validation_rules)

    when('I enter a string for position', () => {
      attrs = {
        'name':'the affair 501 teaser',
        'title':'The Affair First Look Tacos',
        'position': '2inln'
      }
    })

    then('there will be some errors', () => {
      const errors  = validator(attrs)      
      expect(errors.position).toEqual('position must be a number')
    })
  })
  

  test('Create/Edit a Promo and enter a decimal value for position', ({ given, when, then, pending }) => {
    given('there are validation rules', given_there_are_validation_rules)
    
    when('I enter a decimal for position', () => {
      attrs = {
        'name':'so badly badly bad',
        'title':'so badly badly bad',
        'position': 100.5
      }
    })
    
    then('there will be some errors', () => {
      const errors  = validator(attrs)      
      expect(errors.position).toEqual('position must be a whole number, decimals are not supported')
    })
  })
  
  test('Create/Edit a Promo and enter invalid dates', ({ given, when, then, pending }) => {
    given('there are validation rules', given_there_are_validation_rules)

    when('I enter end date that occurs before the start date', () => {
      attrs = {
        'name':'the chi 301 thai combo',
        'title':'The Chi First Look Pad Key Mow',
        'startDate': Promo.parseDate('10-15-2018'),
        'endDate'  : Promo.parseDate('10-01-2018')
        // works with times too
        // 'startDate': Promo.parseDate('10-01-2018T09:00.000'),
        // 'endDate'  : Promo.parseDate('10-01-2018T07:00.000')
      }
    });

    then('there will be some errors', () => {
      const errors  = validator(attrs)     
      expect(errors.endDate).toEqual('the endDate must come after the startDate')
    })
  })

  test('Create/Edit a Promo with negative ids', ({ given, when, then, pending }) => {
    given('there are validation rules', given_there_are_validation_rules)
     when('I enter negative values for seriesId, seasonNumber and showId', () => {
       attrs = {
         'title'    : 'A Mischievous Promo',
         'name'     : 'A Mischievous Promo',
         'seriesId' : -1,
         'seasonNumber' : -1,
         'showId'   : -1
       }
     })
    
    then('there will be some errors', () => {
      const errors  = validator(attrs)     
      expect(errors).toEqual({
        seriesId: 'seriesId can\'t be less than 0',
        seasonNumber: 'seasonNumber can\'t be less than 0',
        showId: 'showId can\'t be less than 0'
      })
    })
  })

  test('Validate by DataType', ({ given, when, then }) => {
    given('there are validation rules for \'dataType\' strategy', () => {
      given_there_are_validation_rules(['default','dataType'])
    })

    when('I enter a string for position', () => {
      attrs = {
        'name':'the affair 501 teaser',
        'title':'The Affair First Look Tacos',
        'position': '2inln'
      }
    })

    then('there will be some errors', () => {
      const errors  = validator(attrs)    
      expect(errors.position).toEqual('position must be a number')
    });
  })
  
})



