using System;
using System.Collections;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace MSO.Persistencia.DapperConexion.Instructor
{
    public interface IInstructor
    {
         Task<IEnumerable<InstructorModel>> obtenerLista();
         Task<InstructorModel> obtenerPorId(Guid Id);
         Task<int> Nuevo(InstructorModel parametros);
         Task<int> Actualizar(InstructorModel parametros);
         Task<int> Eliminar(Guid Id);
         
    }
}