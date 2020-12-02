import NextAuth from 'next-auth'
import Providers from 'next-auth/providers'

import {ApolloClient, InMemoryCache, gql} from '@apollo/client';
import { initializeApollo } from '../../../lib/apolloClient'


const options = {
    // Configure one or more authentication providers
    // providers: [
    //     Providers.GitHub({
    //         clientId: process.env.GITHUB_ID,
    //         clientSecret: process.env.GITHUB_SECRET
    //     }),
    //     // ...add more providers here
    // ],
    providers: [
        Providers.Credentials({
                // The name to display on the sign in form (e.g. 'Sign in with...')
                name: 'Credentials',
                // The credentials is used to generate a suitable form on the sign in page.
                // You can specify whatever fields you are expecting to be submitted.
                // e.g. domain, username, password, 2FA token, etc.
                credentials: {
                    username: {label: "Username", type: "text", placeholder: "jsmith"},
                    password: {label: "Password", type: "password"}
                },
                authorize: async (credentials) => {
                    // Add logic here to look up the user from the credentials supplied
                    const user = {id: 1, name: 'J Smith', email: 'jsmith@example.com'}

                    const client = initializeApollo()

                    return client.query({
                        query: gql`query AuthUser($email:String, $passHash:String){
                        authUser(email:$email, passHash:$passHash) {
                            user_uuid,
                            email
                      }
                    }`,
                        variables: {
                            email: credentials.username,
                            passHash: credentials.password
                        }
                    }).then(
                        (res) => {
                            console.log(res)
                            return Promise.resolve(res.data.authUser)
                        }
                    ).catch((err) => {
                        Promise.reject(new Error('error message'))
                    })}

        })]

                //
                // if (user) {
                //         // Any object returned will be saved in `user` property of the JWT
                //         return Promise.resolve(user)
                //     } else {
                //         // If you return null or false then the credentials will be rejected
                //         return Promise.resolve(null)
                //         // You can also Reject this callback with an Error or with a URL:
                //         // return Promise.reject(new Error('error message')) // Redirect to error page
                //         // return Promise.reject('/path/to/redirect')        // Redirect to a URL
                //     }
                // }
                // })

    ,
    // A database is optional, but required to persist accounts in a database
    database: 'sqlite://localhost/:memory:',
    session: { jwt: true, maxAge: 30 * 24 * 60 * 60, },
    debug: true
}

export default (req, res) => NextAuth(req, res, options)
