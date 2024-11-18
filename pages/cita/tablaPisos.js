import { DataTable } from 'primereact/datatable'
import { Column } from 'primereact/column'
import useSWR from 'swr'
import GQLCita from 'graphql/gestionCita'
import { useEffect, useState } from 'react'

const TablaPisos = ({ tokenQuery, fecha }) => {
  const [heightTable, setHeightTable] = useState('65vh')

  useEffect(() => {
    if (typeof window !== 'undefined') {
      if (window?.screen.height > 758) {
        setHeightTable('70vh')
      } else if (window?.screen.height <= 758) {
        setHeightTable('65vh')
      }
    }
  }, [])

  const { data: piso, mutate } = useSWR(
    tokenQuery
      ? [GQLCita.GET_TABLA_PISOS, { fechaHora: fecha }, tokenQuery]
      : null
  )

  useEffect(() => {
    mutate()
  }, [fecha])

  return (
    <>
      <DataTable
        value={piso?.getListPiso}
        size="small"
        emptyMessage="No se han encontrado pisos"
        showGridlines
        scrollable
        scrollHeight={heightTable}
      >
        <Column field="piso" header="Piso" />
        <Column field="departamento" header="Departamento" />
        <Column field="count" header="Cantidad" />
      </DataTable>
    </>
  )
}

export default TablaPisos
