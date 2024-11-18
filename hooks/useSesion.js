import { useEffect, useState } from 'react'
import useSWR, { useSWRConfig } from 'swr'
import GQLLogin from '../graphql/login'
import { useRouter } from 'next/router'
import CryptoJS from 'crypto-js'

export const useSesion = () => {
  const router = useRouter()
  const { cache } = useSWRConfig()
  const [token, setToken] = useState()
  const [user, setUser] = useState()
  const rutasNoProtegidas = ['/']

  const { data, error } = useSWR(
    token && !rutasNoProtegidas.includes(router.route)
      ? [GQLLogin.USER, {}, token]
      : null
  )

  useEffect(() => {
    !sessionStorage.getItem('token') &&
    !rutasNoProtegidas.includes(router.route)
      ? router?.push('/')
      : setToken(sessionStorage.getItem('token'))
  }, [])

  useEffect(() => {
    if (data?.user) {
      const userJson = JSON.parse(
        CryptoJS.AES.decrypt(
          data.user,
          process.env.NEXT_PUBLIC_SECRET_KEY
        ).toString(CryptoJS.enc.Utf8)
      )
      sessionStorage.setItem('token', userJson.token)
      setUser(userJson)
    }
  }, [data])

  const cerrarSesion = () => {
    if (typeof sessionStorage !== 'undefined') {
      sessionStorage.clear()
      router.push('/')
    }
    cache.clear()
  }

  if (error?.toString()?.includes('Sesión no válida')) cerrarSesion()

  return {
    co_usuario: user?.co_usuario,
    usuario: user?.usuario,
    nb_usuario: user?.nb_usuario,
    nb2_usuario: user?.nb2_usuario || '',
    ap_usuario: user?.ap_usuario,
    ap2_usuario: user?.ap2_usuario || '',
    cedula_usr: user?.cedula_usr,
    gerencia: user?.gerencia,
    tx_correo: user?.tx_correo,
    co_rol: user?.co_rol,
    loading: !data && !error,
    token: user?.token,
    cerrarSesion: () => cerrarSesion(),
    error
  }
}
