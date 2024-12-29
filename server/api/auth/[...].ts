import { jwtDecode } from 'jwt-decode'
import CredentialsProvider from 'next-auth/providers/credentials'
import { z } from 'zod'
import { NuxtAuthHandler } from '#auth'

/**
 * Takes a token, and returns a new token with updated
 * `accessToken` and `accessTokenExpires`. If an error occurs,
 * returns the old token and an error property
 */
async function refreshAccessToken(refreshToken: any) {
  try {
    const refreshedTokens = await $fetch<{
      data: {
        'scope': string
        'access_token': string
        'expires_in': number
        'refresh_expires_in': number
        'refresh_token': string
        'token_type': string
        'not-before-policy': number
        'session_state': string
      }
    } | null>(`${process.env.VITE_APP_BASE_URL}/identity/api/auth/refresh-token`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: {
        refreshToken: refreshToken.refresh_token,
      },
    })
    if (!refreshedTokens || !refreshedTokens.data) {
      throw refreshedTokens
    }

    console.debug('Refreshed tokens', refreshToken.refresh_token !== refreshedTokens.data.refresh_token)

    return {
      ...refreshToken,
      access_token: refreshedTokens.data.access_token,
      accessTokenExpires: Date.now() + 1000 * refreshedTokens.data.expires_in,
      refresh_token: refreshedTokens.data.refresh_token,
      refreshTokenExpires: Date.now() + 1000 * refreshedTokens.data.refresh_expires_in,
    }
  }
  catch (error) {
    return {
      ...refreshToken,
      error: 'RefreshAccessTokenError',
    }
  }
}

async function autoLogin() {
  const username = process.env.CLIENT_USER;
  const password = process.env.CLIENT_PASS;

  const userResponse = await $fetch<{
    scope: string;
    access_token: string;
    expires_in: number;
    refresh_expires_in: number;
    refresh_token: string;
    token_type: string;
    session_state: string;
  }>(`${process.env.VITE_APP_BASE_URL}/identity/api/auth/authenticate`, {
    method: 'POST',
    body: {
      username,
      password,
    },
  });

  const { access_token, expires_in, refresh_token, refresh_expires_in } = userResponse;

  return {
    access_token,
    accessTokenExpires: Date.now() + 1000 * expires_in,
    refresh_token,
    refreshTokenExpires: Date.now() + 1000 * refresh_expires_in,
  };
}

let isAttemptingAutoLogin = false // Control global para evitar múltiples autoLogin

export default NuxtAuthHandler({
  secret: process.env.AUTH_SECRET,
  providers: [
    // @ts-expect-error You need to use .default here for it to work during SSR. May be fixed via Vite at some point
    CredentialsProvider.default({
      name: 'Credentials',
      credentials: {
        username: { label: 'Username', type: 'text' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials: any) {
        return await autoLogin();
      },

    }),
  ],
  session: {
    strategy: 'jwt'
  },
  callbacks: {
    // Callback when the JWT is created / updated, see https://next-auth.js.org/configuration/callbacks#jwt-callback
    jwt: async ({ token, user, account }) => {
      if (account && user) {
        return {
          ...token,
          access_token: (user as any).access_token,
          refresh_token: (user as any).refresh_token,
          accessTokenExpires: (user as any).accessTokenExpires,
          refreshTokenExpires: (user as any).refreshTokenExpires,
        }
      }

      // Handle token refresh before it expires of 15 minutes
      /*if (token.refreshTokenExpires && Date.now() > (token as any).refreshTokenExpires) {
        console.error('Refresh token expired')
        return null
      }

      if (token.accessTokenExpires && Date.now() > (token as any).accessTokenExpires) {
        return refreshAccessToken(token)
      }*/

      // Si el access_token está por expirar, intentamos refrescar
      if (token.accessTokenExpires && Date.now() > (token as any).accessTokenExpires) {
        console.debug('Access token expiring. Attempting to refresh...')
        const refreshedToken = await refreshAccessToken(token)
        if (refreshedToken.error) {
          console.error('Token refresh failed:', refreshedToken.error)
          if (!isAttemptingAutoLogin) {
            isAttemptingAutoLogin = true
            try {
              const newToken = await autoLogin() // Intentamos restaurar sesión
              isAttemptingAutoLogin = false
              return newToken
            }
            catch (error) {
              console.error('AutoLogin failed:', error)
              isAttemptingAutoLogin = false
              return null // Forzar logout
            }
          }
          return null
        }
        return refreshedToken
      }

      return token
    },
    // Callback whenever session is checked, see https://next-auth.js.org/configuration/callbacks#session-callback
    session: async ({ session, token }) => {
      session.user = {
        ...session.user,
      }
      return session
    },
  },
})
