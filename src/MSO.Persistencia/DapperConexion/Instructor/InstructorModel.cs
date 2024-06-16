using System;

namespace MSO.Persistencia.DapperConexion.Instructor
{
    public class InstructorModel
    {
        public Guid InstructorId {set;get;}
        public string Nombre {set;get;}
        public string Apellidos {set;get;}
        public string Grado{set;get;}
        public DateTime? fechaCreacion{set;get;}
        
    }
}