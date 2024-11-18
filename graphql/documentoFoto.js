import { gql } from 'graphql-request'

export default {
  GET_FOTO: gql`
    mutation obtenerFotoPerfilUsuario($idUser: Int!) {
      obtenerFotoPerfilUsuario(idUser: $idUser) {
        response {
          id
          archivo
        }
      }
    }
  `,
  SAVE_FOTO: gql`
    mutation crearFotoEstudiante($InputFotoEstudiante: InputFotoEstudiante!) {
      crearFotoEstudiante(input: $InputFotoEstudiante) {
        message
        status
        type
      }
    }
  `,
  ELIMINAR_FOTO: gql`
    mutation eliminarFotoEstudiante(
      $InputEliminarFotoPerfilUsuario: InputEliminarFotoPerfilUsuario!
    ) {
      eliminarFotoEstudiante(input: $InputEliminarFotoPerfilUsuario) {
        status
        message
        type
      }
    }
  `
}