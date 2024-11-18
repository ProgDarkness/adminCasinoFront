/* eslint-disable react/no-unknown-property */
import { useRef, useState } from 'react'
import { request } from 'graphql-request'
import GQLLogin from 'graphql/login'
import { Toast } from 'primereact/toast'
import { Button } from 'primereact/button'
import { InputText } from 'primereact/inputtext'
import CryptoJS from 'crypto-js'
import { Password } from 'primereact/password'
import { Dialog } from 'primereact/dialog'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

// import the icons you need
import { faUser, faKey, faCheck } from '@fortawesome/free-solid-svg-icons'

function DialogRegister({ visiblebDialogNewUser, setVisiblebDialogNewUser }) {
  const toast = useRef(null)
  const [state, setState] = useState({
    nombre: '',
    primerApellido: '',
    segundoNombre: '',
    segundoApellido: '',
    cedula: '',
    lugardetrabajo: '',
    usuario: '',
    correo: '',
    clave: ''
  })
  const [confirClave, setConfirClave] = useState(null)

  const insertNewUser = (variables) => {
    return (
      request(
        process.env.NEXT_PUBLIC_URL_BACKEND,
        GQLLogin.INSERT_NEW_USER,
        variables
      ) || null
    )
  }

  const validarContraseña = () => {
    if (confirClave === state.clave) {
      insertNewUser({
        usuario: state.usuario,
        correo: state.correo,
        clave: CryptoJS.AES.encrypt(
          state.clave,
          process.env.NEXT_PUBLIC_SECRET_KEY
        ).toString()
      }).then(({ inserNewUser: { status, message, type } }) => {
        setVisiblebDialogNewUser(false)
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
          cedula: '',
          lugardetrabajo: '',
          usuario: '',
          correo: '',
          clave: ''
        })
        setConfirClave('')
      })
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

  const onEnterR = (e) => {
    if (e.keyCode === 13 || e.charCode === 13) {
      document.querySelector('#btn-registrar').click()
    }
  }

  return (
    <>
      <Toast ref={toast} />
      <Dialog
        visible={visiblebDialogNewUser}
        resizable={false}
        draggable={false}
        showHeader={false}
        modal={false}
        contentClassName="rounded-xl"
        contentStyle={{ backgroundColor: '#006993d3' }}
        onHide={() => {}}
        className="mb-[10%] w-[25%] rounded-xl"
      >
        <div className="flex justify-center">
          <div className="flex flex-col text-white w-[26rem] rounded-xl mt-2 text-center">
            <h1 style={{ fontSize: '30px', fontWeight: '600' }}>USUARIO</h1>
            <div>
              <p>Debe Registrar su correo y contraseña </p>
            </div>
            <div>
              <p>para ingresar al sistema</p>
            </div>
            <div className="p-inputgroup h-8 mt-3">
              <span className="p-inputgroup-addon span-sesion">
                <FontAwesomeIcon icon={faUser} />
              </span>
              <InputText
                id="user"
                value={state.usuario}
                maxLength={8}
                autoComplete="off"
                placeholder="Usuario"
                className="rounded-xl"
                onChange={({ target: { value } }) =>
                  setState((ps) => ({ ...ps, usuario: value }))
                }
              />
            </div>
            <div className="p-inputgroup h-8 mt-5">
              <span className="p-inputgroup-addon span-sesion">
                <FontAwesomeIcon icon={faUser} />
              </span>
              <InputText
                id="user"
                value={state.lugardetrabajo}
                autoComplete="off"
                placeholder="Lugar De Trabajo"
                className="rounded-xl"
                onChange={({ target: { value } }) =>
                  setState((ps) => ({ ...ps, lugardetrabajo: value }))
                }
              />
            </div>
            <div className="p-inputgroup h-8 mt-5">
              <span className="p-inputgroup-addon span-sesion">
                <FontAwesomeIcon icon={faUser} />
              </span>
              <InputText
                id="user"
                value={state.correo}
                autoComplete="off"
                placeholder="Correo electrónico"
                className="rounded-xl"
                onChange={({ target: { value } }) =>
                  setState((ps) => ({ ...ps, correo: value }))
                }
              />
            </div>
            <div className="p-inputgroup h-8 mt-5">
              <span className="p-inputgroup-addon span-sesion">
                <FontAwesomeIcon icon={faKey} />
              </span>
              <Password
                id="password"
                placeholder="Contraseña"
                className="redondeo-input-addon"
                toggleMask
                value={state.clave}
                feedback={false}
                onChange={({ target: { value } }) =>
                  setState((ps) => ({ ...ps, clave: value }))
                }
              />
            </div>
            <div className="p-inputgroup h-8 mt-5">
              <span className="p-inputgroup-addon span-sesion">
                <FontAwesomeIcon icon={faCheck} />
              </span>
              <Password
                id="password"
                toggleMask
                placeholder="Confirmar Contraseña"
                className="redondeo-input-addon"
                value={confirClave}
                feedback={false}
                onKeyPress={onEnterR}
                onChange={(e) => setConfirClave(e.target.value)}
              />
            </div>
            <div className="grid grid-cols-2 justify-items-center mt-4">
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
              <Button
                id="btn-registrar-cancel"
                icon="pi pi-sign-in"
                className="rounded-xl w-40 h-6"
                label="Cancelar"
                onClick={() => setVisiblebDialogNewUser(false)}
              />
            </div>
          </div>
        </div>
      </Dialog>

      <style jsx global>{`
        .item {
          width: 56%;
          overflow: visible;
          stroke: #fff;
          stroke-width: 2;
          stroke-linejoin: round;
          stroke-linecap: round;
        }

        circle,
        rect,
        line {
          stroke-width: 10px;
          stroke-linecap: round;
          fill: transparent;
        }
        #user,
        #password {
          /* border-top-right-radius: 0;
          border-bottom-right-radius: 0.5rem;
        border-top-right-radius: 9999px;*/
          /* border-bottom-right-radius: 9999px;*/
        }
        .span-sesion {
          border-top-left-radius: 0.5rem !important;
          border-bottom-left-radius: 0.5rem !important;
        }
      `}</style>
    </>
  )
}

export default DialogRegister
