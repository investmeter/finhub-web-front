import '../styles/globals.css'
import 'bootstrap/dist/css/bootstrap.min.css';


import { Provider } from 'next-auth/client'

const Main =  ({ Component, pageProps }) => {
  return (
      <Provider session={pageProps.session} >
        <Component {...pageProps} />
      </Provider>
  )
}

export default Main;
