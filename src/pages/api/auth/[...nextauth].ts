import { query as q } from 'faunadb'

import NextAuth from 'next-auth'
import Providers from 'next-auth/providers'

import { fauna } from '../../../services/fauna';

export default NextAuth({
    // Configure one or more authentication providers
    providers: [
        Providers.GitHub({
            clientId: process.env.GITHUB_CLIENT_ID,
            clientSecret: process.env.GITHUB_CLIENT_SECRET,
            scope: 'read:user'
        }),
    ],
    jwt: {
        signingKey: process.env.SIGNING_KEY,
    },
    callbacks: {
        async signIn(user, account, profile) {
            const { email } = user

            try {
                console.log('era pra funcionar');
                console.log(email);
                await fauna.query(
                    q.Create(
                        q.Collection('users'),
                        { data: { email } }
                    )
                )
                console.log(user.email);
                return true
            } catch (e) {
                console.log('deu merda');
                console.log(e);
                return false
            }
        },
    }
})