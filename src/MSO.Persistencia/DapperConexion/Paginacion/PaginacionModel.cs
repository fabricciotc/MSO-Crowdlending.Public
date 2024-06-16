using System.Collections.Generic;
namespace MSO.Persistencia.DapperConexion.Paginacion
{
    public class PaginacionModel
    {
        public List<IDictionary<string,object>> ListaRecords{set;get;}
        //IDICTIONARY es un tipo JSON lo que nos crea con un string como Key y un objecto como el valor que tendra
        public int TotalRecords{set;get;}
        public int NumeroPaginas{set;get;}
    }
}