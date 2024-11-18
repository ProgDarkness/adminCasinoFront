import styles from 'styles/Header.module.css'
import logo from 'public/favicon.ico'
import Image from 'next/image'
import useSWR from 'swr'
import GQLdocumentoFoto from 'graphql/documentoFoto'
import { useSesion } from 'hooks/useSesion'
import usuario from 'public/images/usuario.png'
import { useEffect, useRef, useState } from 'react'
import { Menu } from 'primereact/menu'
import { useRouter } from 'next/router'

export default function Header({ verMenu }) {
  const { co_usuario } = useSesion()
  const router = useRouter()
  const menu = useRef(null)
  const [imagenPerfil, setImagenPerfil] = useState(null)
  const items = [
    {
      label: 'Options',
      items: [
        {
          label: 'Cambio de Contraseña',
          icon: 'pi pi-key',
          command: () => {
            router.push('/perfil/acceso')
          }
        },
        {
          label: 'Perfil',
          icon: 'pi pi-user',
          command: () => {
            router.push('/perfil')
          }
        }
      ]
    }
  ]

  const { data: fotoPerfil } = useSWR(
    co_usuario
      ? [GQLdocumentoFoto.GET_FOTO, { idUser: parseInt(co_usuario) }]
      : null
  )

  useEffect(() => {
    if (fotoPerfil?.obtenerFotoPerfilUsuario.response) {
      setImagenPerfil(fotoPerfil?.obtenerFotoPerfilUsuario.response.archivo)
    }
  }, [fotoPerfil])

  return (
    <header id="header-principal" className={styles.header}>
      <Menu model={items} popup ref={menu} id="popup_menu" />
      <div className="w-full bg-[#006993d3] h-[3rem] flex bg-opacity-90">
        <div className="w-14 h-full flex items-center p-2">
          <div className="w-full">
            <Image
              src={logo}
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              alt="Logo"
            />
          </div>
        </div>
        <div className="h-full flex items-center">
          <p className="text-xl text-white drop-shadow-lg font-semibold font-serif">
            Conectate
          </p>
        </div>
        <div className="w-full flex justify-end p-1 mr-4">
          {imagenPerfil ? (
            <img
              src={`data:image/png;base64,${imagenPerfil}`}
              width={44}
              className="rounded-full"
              onClick={(event) => menu.current.toggle(event)}
              aria-controls="popup_menu"
              aria-haspopup
            />
          ) : router?.route !== '/' ? (
            <Image
              src={usuario}
              width={44}
              className="rounded-full"
              onClick={(event) => menu.current.toggle(event)}
              aria-controls="popup_menu"
              aria-haspopup
            />
          ) : (
            <></>
          )}
        </div>
      </div>
    </header>
  )
}


/* 10.11.104.221

*/
