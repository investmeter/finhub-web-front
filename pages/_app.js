import '../styles/globals.css'
import 'bootstrap/dist/css/bootstrap.min.css';
import 'react-bootstrap-typeahead/css/Typeahead.css';
import 'react-datepicker/dist/react-datepicker.css';


import { ApolloProvider } from '@apollo/client';
import { useApollo } from '../lib/apolloClient';

import { Provider } from 'next-auth/client';

const Main =  ({ Component, pageProps }) => {
    const apolloClient = useApollo(pageProps.initialApolloState)

  return (
      <Provider session={pageProps.session} >
          <ApolloProvider client={apolloClient}>
              <Component {...pageProps} />
          </ApolloProvider>
      </Provider>
  )
}

export default Main;
