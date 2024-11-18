import { DataTable } from 'primereact/datatable'
import { Column } from 'primereact/column'
import { Button } from 'primereact/button'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEye } from '@fortawesome/free-solid-svg-icons'
import useSWR from 'swr'
import GQLCita from 'graphql/gestionCita'
import { useEffect, useState } from 'react'
import { Dialog } from 'primereact/dialog'
import { InputText } from 'primereact/inputtext'
import usuario from 'public/images/usuario.png'
import Image from 'next/image'
import { format } from 'date-fns'
import request from 'graphql-request'

const TableVisitantes = ({ tokenQuery, fecha }) => {
  const [heightTable, setHeightTable] = useState(6)
  const [dialogVisitante, setDialogVisitante] = useState(false)
  const [dataVisitante, setDataVisitante] = useState(null)
  const [inputDialog, setInputDialog] = useState({
    telefono: '',
    carnet: '',
    motivo: '',
    foto1: null,
    foto2: null,
    fecha_registro: '',
    fecha_salida: ''
  })

  useEffect(() => {
    if (typeof window !== 'undefined') {
      if (window?.screen.height > 768) {
        setHeightTable(9)
      } else if (window?.screen.height <= 768) {
        setHeightTable(6)
      }
    }
  }, [])

  const consultImagenesVisitante = (varibles) => {
    return request(
      process.env.NEXT_PUBLIC_URL_BACKEND,
      GQLCita.GET_IMAGENES_VISITANTE,
      varibles,
      { authorization: `Bearer ${tokenQuery}` }
    )
  }

  const { data: visitantes, mutate } = useSWR(
    tokenQuery
      ? [GQLCita.GET_LIST_VISIT, { fechaHora: fecha }, tokenQuery]
      : null
  )

  useEffect(() => {
    mutate()
  }, [fecha])

  useEffect(() => {
    if (dataVisitante?.id) {
      consultImagenesVisitante({ id: dataVisitante?.id }).then(
        ({ getImagenesVisitante: { foto1, foto2 } }) => {
          setInputDialog({
            foto1,
            foto2
          })
        }
      )
    }

    setInputDialog({
      telefono: dataVisitante?.telefono || '',
      carnet: dataVisitante?.carnet || '',
      motivo: dataVisitante?.motivo || '',
      fecha_registro: dataVisitante?.fecha_registro
        ? format(
            new Date(parseInt(dataVisitante?.fecha_registro)),
            'dd-MM-yyyy hh:mm:ss'
          )
        : '',
      fecha_salida: dataVisitante?.fecha_salida
        ? format(
            new Date(parseInt(dataVisitante?.fecha_salida)),
            'dd-MM-yyyy hh:mm:ss'
          )
        : ''
    })
  }, [dataVisitante])

  const accionBodyTemplate = (rowData) => {
    return (
      <div className="w-full flex justify-center">
        <Button
          onClick={() => {
            setDialogVisitante(true)
            setDataVisitante(rowData)
          }}
          className="p-button-rounded p-button-warning p-button-sm"
          tooltip="Visualizar"
          tooltipOptions={{ position: 'top' }}
        >
          <FontAwesomeIcon icon={faEye} />
        </Button>
      </div>
    )
  }

  return (
    <>
      <Dialog
        visible={dialogVisitante}
        header="Visitante"
        headerStyle={{ bakcgroundColor: '#006993d3' }}
        onHide={() => {
          setDialogVisitante(false)
          setDataVisitante(null)
          setInputDialog({
            foto1: null,
            foto2: null
          })
        }}
        className="max-w-2xl"
        contentClassName="overflow-hidden"
        draggable={false}
        resizable={false}
      >
        <div className="grid grid-cols-2 gap-7 mt-8">
          <div className="field">
            <span className="p-float-label">
              <InputText
                id="feReg"
                value={inputDialog.fecha_registro}
                className="w-full"
              />
              <label htmlFor="feReg">Fecha y Hora de registro</label>
            </span>
          </div>
          <div className="field">
            <span className="p-float-label">
              <InputText
                id="feSal"
                value={inputDialog.fecha_salida}
                className="w-full"
              />
              <label htmlFor="feSal">Fecha y Hora de salida</label>
            </span>
          </div>
          <div className="field col-span-2">
            <span className="p-float-label">
              <InputText
                id="motivo"
                value={inputDialog.motivo}
                className="w-full"
              />
              <label htmlFor="motivo">Motivo</label>
            </span>
          </div>
          <div className="field">
            <span className="p-float-label">
              <InputText
                id="telefono"
                value={inputDialog.telefono}
                className="w-full"
              />
              <label htmlFor="telefono">Telefono</label>
            </span>
          </div>
          <div className="field">
            <span className="p-float-label">
              <InputText
                id="Carnet"
                value={inputDialog.carnet}
                className="w-full"
              />
              <label htmlFor="Carnet">Carnet</label>
            </span>
          </div>
        </div>
        <div className="mt-3 flex justify-around">
          <div className="card mr-5">
            <h5>Foto Persona</h5>
            {inputDialog.foto1 ? (
              <img
                src={`data:image/png;base64,${inputDialog.foto1}`}
                loading="eager"
                style={{
                  maxWidth: '18rem',
                  maxHeight: '10rem'
                }}
                className="rounded-lg"
              />
            ) : (
              <Image
                src={usuario}
                loading="eager"
                fill="true"
                sizes="(max-width: 10vw) 40%"
                priority={true}
                className="rounded-lg"
              />
            )}
          </div>
          <div className="card">
            <h5>Foto Cedula</h5>

            {inputDialog.foto2 ? (
              <img
                src={`data:image/png;base64,${inputDialog.foto2}`}
                loading="eager"
                style={{
                  maxWidth: '18rem',
                  maxHeight: '10rem'
                }}
                className="rounded-lg"
              />
            ) : (
              <Image
                src={usuario}
                loading="eager"
                fill="true"
                sizes="(max-width: 10vw) 40%"
                priority={true}
                className="rounded-lg"
              />
            )}
          </div>
        </div>
      </Dialog>
      <DataTable
        value={visitantes?.getListVisitantes}
        size="small"
        paginator
        emptyMessage="No se han encontrado usuarios"
        showGridlines
        paginatorTemplate="CurrentPageReport FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink RowsPerPageDropdown"
        currentPageReportTemplate="Mostrando {first} a {last} de {totalRecords}"
        rows={heightTable}
      >
        <Column field="cedula" header="Documento" />
        <Column field="nombres" header="Nombre Completo" />
        <Column field="piso" style={{ width: '5rem' }} header="Piso" />
        <Column field="departamento" header="Departamento" />
        <Column field="quien" header="A quien visita" />
        <Column body={accionBodyTemplate} style={{ width: '5%' }} />
      </DataTable>
    </>
  )
}

export default TableVisitantes
