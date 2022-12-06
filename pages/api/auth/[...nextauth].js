import NextAuth from 'next-auth'

import CredentialsProvider from "next-auth/providers/credentials"

import { ApolloClient, InMemoryCache, gql } from '@apollo/client';
import { initializeApollo } from '../../../lib/apolloClient'
import { Router } from 'next/router'

const options = {
    providers: [
        CredentialsProvider({
            name: 'Credentials',
            credentials: {
                username: { label: "Username", type: "text", placeholder: "jsmith" },
                password: { label: "Password", type: "password" }
            },
            authorize: async (credentials, req) => {
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
        })],
    // A database is optional, but required to persist accounts in a database
    database: 'sqlite://localhost/:memory:',
    session: { jwt: true, maxAge: 30 * 24 * 60 * 60, },
    debug: true,
    pages: {
        signIn: '/auth/credentials-signin',
    },
    callbacks: {
        session: async ({ session, token }) => {
            session.user = {}
            session.user.uuid = token.user_uuid
            session.user.apiToken = token.apiToken
            session.user.email = token.email
            return Promise.resolve(session)
        },
        jwt: async ({ token, user, account, profile, isNewUser }) => {
            if (user) {
                token.user_uuid = user.user_uuid || ""
                token.apiToken = user.token || ""
                token.email = user.email || ""
            }
            if (token && !user) {
                // refresh token from gateway
                console.log("Going to refresh api token....", token.apiToken)
                const client = initializeApollo()
                return client.query({
                    query: gql`query refreshToken{
                                refreshToken                                                    
                    }`,
                    context: { token: "Bearer " + token.apiToken }
                }).then(
                    (res) => {
                        console.log("New apiToken", res.data)
                        if (res.data.refreshToken) {
                            token.apiToken = res.data.refreshToken
                            return Promise.resolve(token)
                        }
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

export default NextAuth(options)
