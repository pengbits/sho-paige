// frameworks
import moxios from 'moxios'
import {defineFeature, loadFeature} from 'jest-cucumber';

// mocks
import mockStore, { expectActions, resultingState, respondWithMockResponse} from '../mockStore'
import updatePromoMock from '../mocks/updatePromo'
import contentBlockMock from '../mocks/getContentBlock'

// reducers
import reducer, { 
  setAttributes, SET_ATTRIBUTES,
  selectPromo,   SELECT_PROMO,
  editPromo,     EDIT_PROMO,
  updatePromo,   UPDATE_PROMO,
  toggleDetails, TOGGLE_DETAILS,
  cancelEditing, CANCEL_EDITING
} from '../redux/promos'

// validation rules, which'll be applied to form
import {rules, getValidator} from '../utils/validation'

// models
import Promo from '../models/Promo'

// settings
const PAIGE_ROOT = './library/javascripts/tools/paige';

// misc
defineFeature(loadFeature(PAIGE_ROOT + '/features/front-end-validation.feature'), test => {  
  
  let attrs
  const validator = getValidator();
  
  const given_there_are_validation_rules = () => {
    expect(rules).toBeTruthy()
    expect(typeof rules).toBe('object')
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
      rules.ctaLink = {'forbidden': /[^a-z0-9-_]/}
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
      expect(rules.seriesId).toBeTruthy()
      const keys = 'seriesId showId seasonNumber'.split(' ')
      keys.map(k => {
        const entry = rules[k] || {}
        expect(entry.isNumber).toBeTruthy()
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
  
  
  test('Create/Edit a Promo and enter an excessively high value for position', ({ given, when, then }) => {
    given('there are validation rules', given_there_are_validation_rules)

    when('I enter an excessively high value for position', () => {
      attrs = {
        'name':'the affair 501 teaser',
        'title':'The Affair First Look Tacos',
        'position': 2000
      }
    })

    then('there will be some errors', () => {
      const errors  = validator(attrs)      
      expect(errors.position).toEqual('position can\'t be greater than 1000')
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



})