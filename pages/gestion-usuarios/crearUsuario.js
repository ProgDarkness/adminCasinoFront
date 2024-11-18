import { Dialog } from 'primereact/dialog'
import { InputText } from 'primereact/inputtext'
import { useState, useRef } from 'react'
import { Button } from 'primereact/button'
import request from 'graphql-request'
import { Toast } from 'primereact/toast'
import { motion } from 'framer-motion'
import CryptoJS from 'crypto-js'
import GQLLogin from 'graphql/login'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUser, faKey, faCheck } from '@fortawesome/free-solid-svg-icons'
import { Password } from 'primereact/password'
import { Dropdown } from 'primereact/dropdown'
import { InputMask } from 'primereact/inputmask'
import GQLGestionUsuarios from 'graphql/gestionUsuarios'
import useSWR from 'swr'

function CrearUsuario({ tokenQuery, visibled, setVisibled, refresUser }) {
  const toast = useRef(null)
  const [classValidCedula, setClassValidCedula] = useState(false)
  const [classValidCorreo, setClassValidCorreo] = useState(false)
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

  const { data: roles } = useSWR(
    tokenQuery ? [GQLGestionUsuarios.GET_ROLES, {}, tokenQuery] : null
  )

  const emailRegex = RegExp(
    /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
  )

  function animation(input) {
    // eslint-disable-next-line prefer-const
    let container = {
      hidden: { opacity: 1, scale: 0 },
      visible: {
        opacity: 1,
        scale: [0, 1],
        transition: { delay: 0.02 }
      }
    }

    for (let i = 0; i < input; i++) {
      container.visible.transition.delay += 0.3
    }

    return container
  }

  const header = (
    <motion.div
      variants={animation(1)}
      initial="hidden"
      animate="visible"
      style={{ fontSize: '22px', fontWeight: '600', textAlign: 'center' }}
      className="bg-[#006993d3] text-white w-80 redondeo-xl"
    >
      <h1>CREAR USUARIO</h1>
    </motion.div>
  )

  const insertNewUser = (variables) => {
    return (
      request(
        process.env.NEXT_PUBLIC_URL_BACKEND,
        GQLLogin.INSERT_NEW_USER,
        variables,
        { authorization: `Bearer ${tokenQuery}` }
      ) || null
    )
  }

  const validarContraseña = () => {
    if (confirClave === state.clave) {
      const validCedula = state.cedula.split('-')

      if (
        validCedula[0].toUpperCase() !== 'V' &&
        validCedula[0].toUpperCase() !== 'E'
      ) {
        setClassValidCedula(true)
        toast.current.show({
          severity: 'warn',
          summary: 'Info',
          detail: 'La nacionalidad no es valida',
          life: 3000
        })
      }

      if (!emailRegex.test(state.correo)) {
        setClassValidCorreo(true)
        toast.current.show({
          severity: 'warn',
          summary: 'Info',
          detail: 'El correo no es valido',
          life: 3000
        })
      }

      const inputNewUser = {
        pri_nombre: state.nombre.toUpperCase(),
        seg_nombre: state.segundoNombre.toUpperCase(),
        pri_apellido: state.primerApellido.toUpperCase(),
        seg_apellido: state.segundoApellido.toUpperCase(),
        gerencia: state.gerencia.toUpperCase(),
        cedula_usr: validCedula[0].toUpperCase() + validCedula[1],
        usuario: state.usuario,
        correo: state.correo.toLowerCase(),
        rol: state.rol,
        clave:
          state.clave !== ''
            ? CryptoJS.AES.encrypt(
                state.clave,
                process.env.NEXT_PUBLIC_SECRET_KEY
              ).toString()
            : ''
      }

      insertNewUser({ inputNewUser }).then(
        ({ inserNewUser: { status, message, type } }) => {
          refresUser()
          toast.current.show({
            severity: type,
            summary: 'Atención',
            detail: message,
            life: 4000
          })
          setState({
            nombre: '',
            primerApellido: '',
            segundoNombre: '',
            segundoApellido: '',
            cedula: null,
            rol: null,
            gerencia: '',
            usuario: '',
            correo: '',
            clave: ''
          })
          setConfirClave('')
        }
      )
    } else {
      setConfirClave('')
      toast.current.show({
        severity: 'warn',
        summary: 'Info',
        detail: 'La confirmacion no coincide con la contraseña',
        life: 4000
      })
    }
  }

  const closeDialog = () => {
    setState({
      nombre: '',
      primerApellido: '',
      segundoNombre: '',
      segundoApellido: '',
      cedula: null,
      gerencia: '',
      rol: null,
      usuario: '',
      correo: '',
      clave: ''
    })

    setVisibled(false)
    setClassValidCedula(false)
    setClassValidCorreo(false)
  }

  const onEnterR = (e) => {
    if (e.keyCode === 13 || e.charCode === 13) {
      document.querySelector('#btn-registrar').click()
    }
  }

  return (
    <Dialog
      header={header}
      visible={visibled}
      className="w-[53rem]"
      onHide={closeDialog}
      resizable={false}
      draggable={false}
      contentClassName="redondeo-dialog-content"
      headerClassName="redondeo-dialog-header"
      position="top-left"
    >
      <Toast ref={toast} />
      <div className="grid grid-cols-4 gap-4">
        <div className="p-inputgroup col-span-2">
          <span className="p-inputgroup-addon span-sesion">
            <FontAwesomeIcon icon={faUser} />
          </span>
          <InputMask
            mask="a-99999999"
            id="cedula"
            value={state.cedula}
            autoComplete="off"
            placeholder="Cedula"
            className={`rounded-xl p-inputtext-sm ${
              classValidCedula === true ? 'border-red-400' : ''
            }`}
            onChange={({ target: { value } }) => {
              setState((ps) => ({ ...ps, cedula: value }))
              setClassValidCedula(false)
            }}
          />
        </div>
        <div className="col-span-2"></div>
        <div className="p-inputgroup col-span-2">
          <span className="p-inputgroup-addon span-sesion">
            <FontAwesomeIcon icon={faUser} />
          </span>
          <InputText
            id="usuario"
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
        <div className="p-inputgroup">
          <span className="p-inputgroup-addon span-sesion">
            <FontAwesomeIcon icon={faUser} />
          </span>
          <InputText
            id="nombre"
            keyfilter="alpha"
            value={state.nombre}
            autoComplete="off"
            placeholder="Nombre"
            className="rounded-xl p-inputtext-sm"
            onChange={({ target: { value } }) =>
              setState((ps) => ({ ...ps, nombre: value }))
            }
          />
        </div>
        <div className="p-inputgroup">
          <span className="p-inputgroup-addon span-sesion">
            <FontAwesomeIcon icon={faUser} />
          </span>
          <InputText
            id="segundo_nombre"
            keyfilter="alpha"
            value={state.segundoNombre}
            autoComplete="off"
            placeholder="Segundo Nombre"
            className="rounded-xl p-inputtext-sm"
            onChange={({ target: { value } }) =>
              setState((ps) => ({ ...ps, segundoNombre: value }))
            }
          />
        </div>
        <div className="p-inputgroup">
          <span className="p-inputgroup-addon span-sesion">
            <FontAwesomeIcon icon={faUser} />
          </span>
          <InputText
            id="primer_apellido"
            keyfilter="alpha"
            value={state.primerApellido}
            autoComplete="off"
            placeholder="Apellido"
            className="rounded-xl p-inputtext-sm"
            onChange={({ target: { value } }) =>
              setState((ps) => ({ ...ps, primerApellido: value }))
            }
          />
        </div>
        <div className="p-inputgroup">
          <span className="p-inputgroup-addon span-sesion">
            <FontAwesomeIcon icon={faUser} />
          </span>
          <InputText
            id="segundo_apellido"
            keyfilter="alpha"
            value={state.segundoApellido}
            autoComplete="off"
            placeholder="Segundo Apellido"
            className="rounded-xl p-inputtext-sm"
            onChange={({ target: { value } }) =>
              setState((ps) => ({ ...ps, segundoApellido: value }))
            }
          />
        </div>
        <div className="p-inputgroup col-span-2">
          <span className="p-inputgroup-addon span-sesion">
            <FontAwesomeIcon icon={faUser} />
          </span>
          <InputText
            id="gerencia"
            keyfilter="alpha"
            value={state.gerencia}
            autoComplete="off"
            placeholder="Gerencia"
            className="rounded-xl p-inputtext-sm"
            onChange={({ target: { value } }) =>
              setState((ps) => ({ ...ps, gerencia: value }))
            }
          />
        </div>
        <div className="p-inputgroup col-span-2">
          <span className="p-inputgroup-addon span-sesion">
            <FontAwesomeIcon icon={faUser} />
          </span>
          <InputText
            id="correo"
            value={state.correo}
            autoComplete="off"
            placeholder="Correo"
            keyfilter="email"
            className={`rounded-xl p-inputtext-sm ${
              classValidCorreo === true ? 'border-red-400' : ''
            }`}
            onChange={({ target: { value } }) => {
              setState((ps) => ({ ...ps, correo: value }))
              setClassValidCorreo(false)
            }}
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
            onKeyPress={onEnterR}
            onChange={(e) => setConfirClave(e.target.value)}
          />
        </div>
        <div className="flex justify-center col-span-4">
          <Button
            id="btn-registrar"
            icon="pi pi-sign-in"
            className="rounded-xl w-40 h-6"
            label="Registrate"
            disabled={
              state.correo === null ||
              state.clave === null ||
              state.clave?.length < 6 ||
              confirClave === null ||
              confirClave?.length < 6
            }
            onClick={validarContraseña}
          />
        </div>
      </div>
      {/* eslint-disable-next-line react/no-unknown-property */}
      <style jsx global>{`
        .nacionalidad .p-button {
          min-width: 1rem !important;
        }
        .p-button:disabled {
          background: #3f51b5 !important;
          color: #ffffff !important;
          opacity: 1;
        }
        .nacionalidad .p-button.p-highlight {
          background: #3f51b5 !important;
          border-color: #3f51b5 !important;
          color: white !important;
        }
        .p-disabled .p-component:disabled {
          opacity: 0.5;
        }
        #DropDown .p-disabled,
        .p-component:disabled {
          opacity: 1;
        }
        .p-selectbutton .p-button.p-highlight {
          background: #006993d3;
          border-color: #006993d3;
          color: white;
        }
        button:not(button):not(a):not(.p-disabled):active {
          background: #006993d3;
          border-color: #006993d3;
          color: white;
        }
        .p-selectbutton .p-button:focus.p-highlight {
          background: #006993d3;
          border-color: #006993d3;
          color: white;
        }
        .redondeo-dialog-header {
          border-top-left-radius: 0.75rem !important;
          border-top-right-radius: 0px !important;
        }
        .redondeo-dialog-content {
          border-bottom-left-radius: 0.75rem !important;
          border-bottom-right-radius: 0.75rem !important;
        }
      `}</style>
    </Dialog>
  )
}

export default CrearUsuario
