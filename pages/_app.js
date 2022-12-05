import '../styles/globals.css'
import 'bootstrap/dist/css/bootstrap.min.css';
// import 'react-bootstrap-typeahead/css/Typeahead.css';
import 'react-datepicker/dist/react-datepicker.css';


import { ApolloProvider } from '@apollo/client';
import { useApollo } from '../lib/apolloClient';

import { SessionProvider  } from 'next-auth/react';

const Main =  ({ Component, pageProps }) => {
    const apolloClient = useApollo(pageProps.initialApolloState)

  return (
      <SessionProvider session={pageProps.session} >
          <ApolloProvider client={apolloClient}>
              <Component {...pageProps} />
          </ApolloProvider>
      </SessionProvider>
  )
}

export default Main;
