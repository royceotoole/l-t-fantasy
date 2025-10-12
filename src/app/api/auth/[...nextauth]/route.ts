import NextAuth from 'next-auth';
import { NextAuthOptions } from 'next-auth';

const authOptions: NextAuthOptions = {
  providers: [
    {
      id: 'yahoo',
      name: 'Yahoo',
      type: 'oauth',
      authorization: {
        url: 'https://api.login.yahoo.com/oauth2/request_auth',
        params: {
          scope: 'fspt-r',
          response_type: 'code',
        },
      },
      token: 'https://api.login.yahoo.com/oauth2/get_token',
      userinfo: 'https://api.login.yahoo.com/openid/v1/userinfo',
      clientId: process.env.YAHOO_CLIENT_ID,
      clientSecret: process.env.YAHOO_CLIENT_SECRET,
      profile(profile) {
        return {
          id: profile.sub,
          name: profile.name,
          email: profile.email,
        };
      },
    },
  ],
  callbacks: {
    async jwt({ token, account }) {
      if (account) {
        token.accessToken = account.access_token;
      }
      return token;
    },
    async session({ session, token }) {
      session.accessToken = token.accessToken;
      return session;
    },
  },
  pages: {
    signIn: '/auth/signin',
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
