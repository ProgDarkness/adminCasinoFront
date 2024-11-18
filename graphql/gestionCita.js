import { gql } from 'graphql-request'

export default {
  GET_LIST_VISIT: gql`
    query getListVisitantes($fechaHora: String!) {
      getListVisitantes(fechaHora: $fechaHora) {
        id
        cedula
        nombres
        apellidos
        piso
        departamento
        quien
        telefono
        carnet
        motivo
        fecha_registro
        fecha_salida
      }
    }
  `,
  GET_TABLA_PISOS: gql`
    query getListPiso($fechaHora: String!) {
      getListPiso(fechaHora: $fechaHora) {
        piso
        count
        departamento
      }
    }
  `,
  GET_IMAGENES_VISITANTE: gql`
    mutation getImagenesVisitante($id: Int!) {
      getImagenesVisitante(id: $id) {
        foto1
        foto2
      }
    }
  `
}
