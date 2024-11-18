import React, { useState, useEffect, Fragment, useRef } from 'react'
import { DataTable } from 'primereact/datatable'
import { Column } from 'primereact/column'
import useSWR from 'swr'
import GQLUsuarios from 'graphql/gestionUsuarios'
import { Toolbar } from 'primereact/toolbar'
import { InputText } from 'primereact/inputtext'
import { FilterMatchMode } from 'primereact/api'
import { Button } from 'primereact/button'
import CrearUsuario from './crearUsuario'
import CrearRoles from './crearRoles'
import { ConfirmDialog } from 'primereact/confirmdialog'
import request from 'graphql-request'
import { Toast } from 'primereact/toast'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faXmark } from '@fortawesome/free-solid-svg-icons'

function Tabla({ tokenQuery, permiso }) {
  const [rows, setRows] = useState(6)
  const [visiblebCrearUsuario, setVisiblebCrearUsuario] = useState(false)
  const [visiblebCrearRol, setVisiblebCrearRol] = useState(false)
  const [heightWindow, setHeightWindow] = useState(null)
  const [widthWindow, setWitdhWindow] = useState(null)
  const [filters1, setFilters1] = useState(null)
  const [globalFilterValue1, setGlobalFilterValue1] = useState('')
  const [visible, setVisible] = useState(false)
  const [rowDataEliminar, setRowDataEliminar] = useState(null)
  const toast = useRef(null)

  const { data: usuarios, mutate } = useSWR(
    tokenQuery ? [GQLUsuarios.GET_USUARIOS, {}, tokenQuery] : null
  )

  const mutateEliminarUsuario = (variables) => {
    return request(
      process.env.NEXT_PUBLIC_URL_BACKEND,
      GQLUsuarios.ELIMINAR_USUARIO,
      variables,
      { authorization: `Bearer ${tokenQuery}` }
    )
  }

  const rolBody = (rowData) => {
    return (
      <span
        className={`text-white bg-[#1e74cb] p-1 font-extrabold redondeo-lg`}
      >
        {rowData.nb_rol}
      </span>
    )
  }

  const correoBody = (rowData) => {
    return <>{rowData.tx_correo?.toLowerCase()}</>
  }

  function deleteUser(rowData) {
    setVisible(true)
    setRowDataEliminar(rowData)
  }

  const accept = () => {
    mutateEliminarUsuario({
      co_usuario: parseInt(rowDataEliminar.co_usuario)
    }).then(({ eliminarUsuario: { status, message, type } }) => {
      toast.current.show({
        severity: type,
        summary: 'Atención',
        detail: message,
        life: 3000
      })
      mutate()
    })
  }

  const reject = () => {
    setVisible(false)
  }

  const accionBodyTemplate = (rowData) => {
    return (
      <div>
        {permiso?.tx_permisos[3] && (
          <Button
            onClick={() => deleteUser(rowData)}
            className="p-button-rounded p-button-danger p-button-sm"
            tooltip="Eliminar"
          >
            <FontAwesomeIcon icon={faXmark} />
          </Button>
        )}
      </div>
    )
  }

  const screenRows = () => {
    if (heightWindow >= 1080) {
      setRows(14)
    } else if (heightWindow >= 900 && widthWindow > 740) {
      setRows(10)
    } else if (heightWindow <= 900) {
      setRows(8)
    }
  }

  useEffect(() => {
    initFilters1()
  }, [])

  useEffect(() => {
    screenRows()
  }, [heightWindow])

  setTimeout(() => {
    if (typeof window !== 'undefined') {
      setHeightWindow(screen?.height)
      setWitdhWindow(screen?.width)
    }
  }, 5)

  const onGlobalFilterChange1 = (e) => {
    const value = e.target.value
    // eslint-disable-next-line prefer-const
    let _filters1 = { ...filters1 }

    // eslint-disable-next-line dot-notation
    _filters1['global'].value = value

    setFilters1(_filters1)
    setGlobalFilterValue1(value)
  }

  const leftContents = (
    <Fragment>
      <div className="text-white text-2xl font-extrabold ml-5">
        <p>Usuarios</p>
      </div>
    </Fragment>
  )

  const rightContents = (
    <Fragment>
      <div className="flex flex-wrap">
        <span className="p-input-icon-left">
          <i className="pi pi-search" />
          <InputText
            value={globalFilterValue1}
            onChange={onGlobalFilterChange1}
            placeholder="Buscar"
            autoComplete="off"
            className="redondeo-lg mt-2 sm:mt-0 p-inputtext-sm"
          />
        </span>
        <Button
          icon="pi pi-plus-circle"
          iconPos="right"
          label="Ver Roles"
          className="p-button-info redondeo-lg ml-2 p-button-sm"
          onClick={() => setVisiblebCrearRol(true)}
        />
        {permiso?.tx_permisos[1] && (
          <Button
            icon="pi pi-plus-circle"
            iconPos="right"
            label="Crear Usuarios"
            className="p-button-success redondeo-lg ml-2 p-button-sm"
            onClick={() => setVisiblebCrearUsuario(true)}
          />
        )}
      </div>
    </Fragment>
  )

  const header = (
    <Toolbar
      left={leftContents}
      right={rightContents}
      className="bg-[#006993d3] p-3 redondeo-xl"
    />
  )

  const initFilters1 = () => {
    setFilters1({
      global: { value: null, matchMode: FilterMatchMode.CONTAINS }
    })
    setGlobalFilterValue1('')
  }

  return (
    <>
      <Toast ref={toast} />
      <ConfirmDialog
        visible={visible}
        onHide={() => setVisible(false)}
        message="¿Deseas eliminar este usuario?"
        header="Confirmación"
        icon="pi pi-exclamation-triangle"
        accept={accept}
        reject={reject}
        rejectLabel="No"
        acceptLabel="Si"
      />

      <CrearUsuario
        setVisibled={setVisiblebCrearUsuario}
        visibled={visiblebCrearUsuario}
        tokenQuery={tokenQuery}
        refresUser={mutate}
      />
      <CrearRoles
        setVisibled={setVisiblebCrearRol}
        visibled={visiblebCrearRol}
        tokenQuery={tokenQuery}
        permisos={permiso}
      />
      <DataTable
        value={usuarios?.getUsuarios}
        paginator
        size="small"
        autoLayout={true}
        stripedRows={true}
        paginatorTemplate="CurrentPageReport FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink RowsPerPageDropdown"
        currentPageReportTemplate="Mostrando {first} a {last} de {totalRecords}"
        alwaysShowPaginator={false}
        rows={rows}
        style={{ margin: '-2% -1.3% -2% -1%' }}
        className="w-[101.6%]"
        filterDisplay="row"
        filters={filters1}
        header={header}
        globalFilterFields={['usuario']}
        emptyMessage="No se han encontrado usuarios"
      >
        <Column field="usuario" header="Nombre Usuario" />
        <Column field="nb_rol" header="Rol" body={rolBody} />
        <Column field="correo" body={correoBody} header="Correo" />
        <Column body={accionBodyTemplate} header="Acciones" />
      </DataTable>
    </>
  )
}

export default Tabla
