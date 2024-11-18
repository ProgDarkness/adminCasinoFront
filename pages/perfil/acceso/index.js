import { AppLayoutMenus } from 'components/AppLayoutMenus/AppLayoutMenus'
import { useState, useEffect } from 'react'
import { useSesion } from 'hooks/useSesion'
import GQLLogin from 'graphql/login'
import useSWR from 'swr'
import GQLGestionUsuarios from 'graphql/gestionUsuarios'
import { useRouter } from 'next/router'
import { ProgressSpinner } from 'primereact/progressspinner'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCheck, faKey, faUser } from '@fortawesome/free-solid-svg-icons'
import { Password } from 'primereact/password'
import { InputText } from 'primereact/inputtext'
import { Dropdown } from 'primereact/dropdown'

export default function cambioContrasena() {
  const router = useRouter()
  const rutaActive = router?.route
  const { token, co_rol, cerrarSesion } = useSesion()
  const [state, setState] = useState({
    nombre: '',
    primerApellido: '',
    segundoNombre: '',
    segundoApellido: '',
    cedula: null,
    gerencia: '',
    usuario: '',
    rol: null,
    correo: '',
    clave: ''
  })
  const [confirClave, setConfirClave] = useState('')
  const { data: menu } = useSWR(
    token && co_rol
      ? [GQLLogin.GET_MENU, { idRol: parseInt(co_rol) }, token]
      : null
  )

  const { data: roles } = useSWR(
    token ? [GQLGestionUsuarios.GET_ROLES, {}, token] : null
  )

  const { data: Acceso } = useSWR(
    rutaActive && co_rol
      ? [
          GQLLogin.GET_ACCESOS_ROL,
          { ruta: rutaActive, idRol: parseInt(co_rol) },
          token
        ]
      : null
  )

  /* [leer, crear, modificar, eliminar] */
  /* console.log(Acceso?.getRolAcceso.response.tx_permisos) */
  /* const permisos = Acceso?.getRolAcceso.response */

  const [items, setItems] = useState(null)

  useEffect(() => {
    setItems(JSON.stringify(menu?.getMenu))
  }, [menu])

  if (!Acceso) {
    return (
      <AppLayoutMenus items={items}>
        <div className="flex justify-center items-center">
          <div className=" text-[#006993d3] text-2xl xl:text-4xl font-extrabold tracking-widest">
            <h1>Cargando...</h1>
            <ProgressSpinner
              className="w-[50px] h-[50px] mt-[10px] ml-[80px]"
              strokeWidth="8"
              fill="var(--surface-ground)"
              animationDuration=".5s"
            />
          </div>
        </div>
      </AppLayoutMenus>
    )
  }
  if (
    Acceso?.getRolAcceso.status !== 200 &&
    typeof Acceso?.getRolAcceso.status !== 'undefined'
  ) {
    cerrarSesion()
  }
  return (
    <AppLayoutMenus items={items}>
      <div className="grid grid-cols-4 gap-4 mx-[3%] my-[10%]">
        <div className="text-center col-span-4 w-full h-max bg-yellow-300 border-2 border-yellow-500">
          <p className="font-bold text-yellow-600">
            Los datos que seran modificados tienen que ser siempre recordados
            por el usuario.
            <br></br>
            El acceso a este modulo solo es permisado por un administrador.
          </p>
        </div>
        <div className="p-inputgroup col-span-2">
          <span className="p-inputgroup-addon span-sesion">
            <FontAwesomeIcon icon={faUser} />
          </span>
          <InputText
            id="usuario"
            disabled
            value={state.usuario}
            autoComplete="off"
            placeholder="Usuario"
            keyfilter="alphanum"
            className="rounded-xl p-inputtext-sm"
            onChange={({ target: { value } }) =>
              setState((ps) => ({ ...ps, usuario: value }))
            }
          />
        </div>
        <div className="p-inputgroup col-span-2">
          <span className="p-inputgroup-addon span-sesion">
            <FontAwesomeIcon icon={faUser} />
          </span>
          <Dropdown
            disabled
            value={state.rol}
            options={roles?.getRoles}
            onChange={({ target: { value } }) =>
              setState((ps) => ({ ...ps, rol: value }))
            }
            className="p-inputtext-sm"
            optionLabel="name"
            optionValue="code"
            placeholder="Roles"
          />
        </div>
        <div className="p-inputgroup col-span-2">
          <span className="p-inputgroup-addon span-sesion">
            <FontAwesomeIcon icon={faKey} />
          </span>
          <Password
            id="password"
            placeholder="Contraseña"
            className="redondeo-input-addon p-inputtext-sm"
            toggleMask
            value={state.clave}
            feedback={false}
            onChange={({ target: { value } }) =>
              setState((ps) => ({ ...ps, clave: value }))
            }
          />
        </div>
        <div className="p-inputgroup col-span-2">
          <span className="p-inputgroup-addon span-sesion">
            <FontAwesomeIcon icon={faCheck} />
          </span>
          <Password
            id="password"
            toggleMask
            placeholder="Confirmar Contraseña"
            className="redondeo-input-addon p-inputtext-sm"
            value={confirClave}
            feedback={false}
            onChange={(e) => setConfirClave(e.target.value)}
          />
        </div>
        <div className="text-center col-span-4 w-full h-max bg-green-300 border-2 border-green-500">
          <p className="font-bold text-green-600">
            Debe Ingresar una contraseña segura, con los siguientes requisitos:
            <br></br>- Debe contener al menos 6 caracteres.
            <br></br>- Debe usar al menos una mayuscula.
            <br></br>- Debe contener al menos dos numeros.
            <br></br>- Debe contener al menos un caracter especial. ( + . = $ )
          </p>
        </div>
      </div>
    </AppLayoutMenus>
  )
}
