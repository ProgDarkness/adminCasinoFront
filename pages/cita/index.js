import { AppLayoutMenus } from 'components/AppLayoutMenus/AppLayoutMenus'
import { useSesion } from 'hooks/useSesion'
import { useRouter } from 'next/router'
import { useEffect, useRef, useState } from 'react'
import GQLLogin from 'graphql/login'
import useSWR from 'swr'
import { ProgressSpinner } from 'primereact/progressspinner'
import { Toast } from 'primereact/toast'
import TableVisitantes from './tableVisitantes'
import { Calendar } from 'primereact/calendar'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSearch } from '@fortawesome/free-solid-svg-icons'
import TablaPisos from './tablaPisos'

export default function cita() {
  const router = useRouter()
  const rutaActive = router?.route
  const toast = useRef(null)
  const [fechaConsult, setFechaConsult] = useState(null)
  const [date, setDate] = useState(null)
  const { token, co_rol, cerrarSesion } = useSesion()
  const [items, setItems] = useState(null)

  const { data: menu } = useSWR(
    token && co_rol
      ? [GQLLogin.GET_MENU, { idRol: parseInt(co_rol) }, token]
      : null
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

  useEffect(() => {
    const fechaSelect =
      date?.getFullYear() + '-' + (date?.getMonth() + 1) + '-' + date?.getDate()

    setFechaConsult(fechaSelect)
  }, [date])

  useEffect(() => {
    setDate(new Date())
  }, [])

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
      <Toast ref={toast} />
      <div className="w-full h-[3rem] mb-3">
        <div className="w-[20%]">
          <div className="p-inputgroup">
            <span className="p-inputgroup-addon span-sesion">
              <FontAwesomeIcon icon={faSearch} />
            </span>
            <span className="p-float-label">
              <Calendar
                id="basic"
                value={date}
                onChange={(e) => setDate(e.value)}
                dateFormat="dd/mm/yy"
                locale="es"
              />
              <label htmlFor="basic">Ingrese una Fecha</label>
            </span>
          </div>
        </div>
      </div>
      <div className="flex flex-row w-full">
        <div className="basis-[30%] mr-[1%]">
          <TablaPisos tokenQuery={token} fecha={fechaConsult} />
        </div>
        <div className="basis-full">
          <TableVisitantes tokenQuery={token} fecha={fechaConsult} />
        </div>
      </div>
      <style>{`
        .p-inputgroup-addon {
          display: flex;
          align-items: center;
          justify-content: center;
          background-color: #006993d3;
          color: white;
        }

        .p-datatable.p-datatable-sm .p-datatable-thead > tr > th {
          padding: 0.5rem 0.5rem;
          background-color: #006993d3;
        }

        .p-datatable.p-datatable-sm .p-datatable-tbody > tr > td {
          padding: 0.1rem 0.1rem;
          
        }

        .p-dialog .p-dialog-header {
          border-bottom: 0 none;
          background: #006993;
          color: #fff;
          padding: 1.5rem;
          border-top-right-radius: 6px;
          border-top-left-radius: 6px;
        }
      `}</style>
    </AppLayoutMenus>
  )
}
