import NextAuth from 'next-auth'

import CredentialsProvider from "next-auth/providers/credentials"

import {ApolloClient, InMemoryCache, gql} from '@apollo/client';
import { initializeApollo } from '../../../lib/apolloClient'
import {Router} from 'next/router'

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
        CredentialsProvider({
            // The name to display on the sign in form (e.g. 'Sign in with...')
            name: 'Credentials',
            // The credentials is used to generate a suitable form on the sign in page.
            // You can specify whatever fields you are expecting to be submitted.
            // e.g. domain, username, password, 2FA token, etc.
            credentials: {
                username: {label: "Username", type: "text", placeholder: "jsmith"},
                password: {label: "Password", type: "password"}
            },
            authorize: async (credentials, req) => {
                console.log("Entered Authorize")
                console.log("Credentials", credentials)
                // Add logic here to look up the user from the credentials supplied
                const user = {id: 1, name: 'J Smith', email: 'jsmith@example.com'}

                const client = initializeApollo()

                return client.query({
                    query: gql`query AuthUser($email:String, $passHash:String){
                        authUser(email:$email, passHash:$passHash) {
                            user_uuid,
                            email,
                            token
                      }
                    }`,
                    variables: {
                        email: credentials.username,
                        passHash: credentials.password
                    }
                }).then(
                    (res) => {
                        console.log("Resolved user", res)
                        return Promise.resolve(res.data.authUser)
                    }
                ).catch((err) => {
                    console.log("Auth error")
                    console.log(err)

                    return Promise.reject('/errors/505')
                })
            }

        })]
    ,
    // A database is optional, but required to persist accounts in a database
    database: 'sqlite://localhost/:memory:',
    session: {jwt: true, maxAge: 30 * 24 * 60 * 60,},
    debug: true,
    pages: {
        signIn: '/auth/credentials-signin',},
    callbacks: {
        session: async ({session, user, token}) => {
            //session.foo = 'bar' // Add property to session
            console.log("Entered Callbacks session")
            console.log("Session's user", user)
            console.log("Session's token", token)
            session.user = {}
            session.user.uuid = token.user_uuid
            session.user.apiToken = token.apiToken
            console.log("Session " , session)
            // console.log("User " , user)
            return Promise.resolve(session)
        },
         jwt: async ({token, user, account, profile, isNewUser}) => {
        //
        //       console.log("context", context)
            // const user = token.user
            console.log("JWT Check") 
            console.log("JWT User", user)
            console.log("JWT Token", token)
            console.log("JWT Profile", profile)
             if (user) {
                 token.user_uuid = user.user_uuid || {}
                 token.apiToken = user.token || {}
             }

             if (token  && !user){
                 // refresh token from gateway
                 console.log("Going to refresh api token....", token.apiToken)
                 const client = initializeApollo()

                 return client.query({
                     query: gql`query refreshToken{
                                refreshToken                                                    
                    }`,
                     context:{token: "Bearer " + token.apiToken}
                 }).then(
                     (res) => {
                         console.log("New apiToken", res.data)
                         if (res.data.refreshToken)
                            {token.apiToken = res.data.refreshToken
                            return Promise.resolve(token)}
                         else {
                             console.log('Api key expired')
                             token.apiToken = null
                             return Promise.reject('Session expired')
                         }

                     }
                 ).catch((err) => {
                     console.log("Error updating session")
                     console.log(err)

                     token.apiToken = null
                     return Promise.reject('Session expired')
                 })

             }

            return Promise.resolve(token)
        //
        }
    }
}

export default  NextAuth(options)
