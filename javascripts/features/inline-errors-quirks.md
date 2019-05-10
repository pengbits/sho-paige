TOOL-4036

preemptively logging these holdover issues from TOOL-4036 as they are fairly minor/edge-case things, and imho are not worth holding back the main feature for, especially given how much time has already been spent on this:

_issues that will be reproducible in the wild after TOOL-4036 is deployed to QA:_

*startDate/endDate quirk number 1*
# go to a content-block such as http://qa-www.sho.com/shomin/paige/series/1003223/1003223-primary-hero and click 'add_promo'
# select a start-date of 02/01/2019
# immediately select an end-date of 01/31/2019 without clicking anywhere else
# tab to next field or click elsewhere
_error is shown as expected: "the endDate must come after the startDate"_
# now, try removing the startDate by clicking the `x`
_expected results:_
error message and red outline go away
_actual results:_
red outline goes away but error message persists (but promo can be saved)

- this stems from the fact that you are clearing _startDate_, but the last touched input that introduced the error state was _endDate_ if you were to instead remove endDate it works as -expected
