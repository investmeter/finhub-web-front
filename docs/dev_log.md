# apollo-client branch

Implement next.js and apollo client example https://github.com/vercel/next.js/tree/master/examples/with-apollo

Use-cases:
- (done) prefetch first 10 assets on build time
- (done) fetch dynamically assets when typing in:
    - use async Typehead https://github.com/ericgio/react-bootstrap-typeahead/blob/master/docs/API.md#asynctypeahead
- (done) display prefetched first 10 assets when set focus and there is no typed search request
- (done) set up graph ql server for front-end https://www.apollographql.com/docs/apollo-server/ 
- (done) investigate federation of several gql services https://www.apollographql.com/docs/federation/implementing-services/
- (done) registration form 
- 
- save portfolio
- portfolio value - current and historical value 
 
... 
- use radis or smth for data exchange between services

## Registration Form
https://react-bootstrap.github.io/components/forms/#forms-validation-native

With Formik https://formik.org/docs/overview 

Schema management for Formik https://github.com/jquense/yup   

check http://jquense.github.io/react-formal/getting-started
https://react-hook-form.com/get-started#Quickstart

## Registration
- communications with backend via graphQl 
- Credentials provider

## Auth for backend gateway 
- [x] generate JWT tokens to store user_uuid
- [ ] request api point to get raw jwt token 
- pass JWT to gateway
- if JWT token will expire - request token from nextjs api point


 
   


