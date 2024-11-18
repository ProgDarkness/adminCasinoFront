/* eslint-disable react/no-unknown-property */
import { useRef, useState } from 'react'
import AppLayout from 'components/AppLayout'
import { useRouter } from 'next/router'
import { request } from 'graphql-request'
import GQLLogin from 'graphql/login'
import { Toast } from 'primereact/toast'
import { Button } from 'primereact/button'
import { InputText } from 'primereact/inputtext'
import { Card } from 'primereact/card'
import CryptoJS from 'crypto-js'
import { Password } from 'primereact/password'
import Logo from 'public/favicon.ico'

import DialogRegister from './register'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

// import the icons you need
import { faUser, faKey } from '@fortawesome/free-solid-svg-icons'
import Image from 'next/image'

export default function Index() {
  const router = useRouter()
  const toast = useRef(null)
  const [state, setState] = useState({
    usuario: '',
    clave: ''
  })

  const [visiblebDialogNewUser, setVisiblebDialogNewUser] = useState(false)

  const login = (variables) => {
    return (
      request(process.env.NEXT_PUBLIC_URL_BACKEND, GQLLogin.LOGIN, variables) ||
      null
    )
  }

  const iniciarSesion = () => {
    const input = {
      usuario: state.usuario,
      clave: CryptoJS.AES.encrypt(
        state.clave,
        process.env.NEXT_PUBLIC_SECRET_KEY
      ).toString()
    }

    login({ input }).then(({ login }) => {
      const loginJson = JSON.parse(
        CryptoJS.AES.decrypt(
          login,
          process.env.NEXT_PUBLIC_SECRET_KEY
        ).toString(CryptoJS.enc.Utf8)
      )
      const { status, message, response } = loginJson
      if (status === 200) {
        const { token, nameRuta } = response
        toast.current.show({
          severity: 'success',
          summary: 'Info',
          detail: message,
          life: 8000
        })

        sessionStorage.clear()
        sessionStorage.setItem('token', token)
        router.push(nameRuta)
      } else {
        toast.current.show({
          severity: 'error',
          summary: 'Error',
          detail: message,
          life: 1000
        })
        sessionStorage.clear()
      }
    })
  }

  const onEnter = (e) => {
    if (e.keyCode === 13 || e.charCode === 13) {
      document.querySelector('#btn-loguear').click()
    }
  }

  return (
    <AppLayout marca={false}>
      <Toast ref={toast} />
      <DialogRegister
        visiblebDialogNewUser={visiblebDialogNewUser}
        setVisiblebDialogNewUser={setVisiblebDialogNewUser}
      />
      <div className="w-full grid grid-cols-1">
        <div className="grid items-center">
          <div>
            {!visiblebDialogNewUser && (
              <Card
                className="w-[25%] text-center bg-[#006993d3] text-white rounded-xl mb-[4%]"
                style={{ marginLeft: 'auto', marginRight: 'auto' }}
              >
                <div className="grid grid-cols-1 gap-6 w-4/5 mx-auto">
                  <div className="w-full flex justify-center">
                    <div className="w-[40%] -mb-5 -mt-5">
                      <Image src={Logo} />
                    </div>
                  </div>
                  <h6
                    style={{
                      fontWeight: 'bold',
                      fontSize: 30,
                      fontFamily: 'Arial'
                    }}
                  >
                    Inicio de Sesión
                  </h6>
                  <div className="p-inputgroup h-8">
                    <span className="p-inputgroup-addon span-sesion">
                      <FontAwesomeIcon icon={faUser} />
                    </span>
                    <InputText
                      id="user"
                      value={state.usuario}
                      autoComplete="off"
                      placeholder="Usuario"
                      className="rounded-xl"
                      onChange={({ target: { value } }) =>
                        setState((ps) => ({ ...ps, usuario: value }))
                      }
                    />
                  </div>
                  <div className="p-inputgroup h-8">
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
                      onKeyPress={onEnter}
                      onChange={({ target }) =>
                        setState((ps) => ({ ...ps, clave: target.value }))
                      }
                    />
                  </div>

                  <div className="grid grid-cols-1 justify-items-center">
                    <Button
                      id="btn-loguear"
                      icon="pi pi-sign-in"
                      className="rounded-xl w-40 h-6"
                      label="Entrar"
                      disabled={state.usuario === '' || state.clave === ''}
                      onClick={iniciarSesion}
                    />
                    {/* <Button
                      id="btn-register"
                      icon="pi pi-user-plus"
                      className="rounded-xl w-40 h-6 mt-3"
                      label="Registrate"
                      onClick={() => setVisiblebDialogNewUser(true)}
                    /> */}
                  </div>
                </div>
              </Card>
            )}
          </div>
        </div>
      </div>

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
    </AppLayout>
  )
}
