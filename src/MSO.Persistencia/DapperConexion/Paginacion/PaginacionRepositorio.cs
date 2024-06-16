using System.Data;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Dapper;
using System.Linq;

namespace MSO.Persistencia.DapperConexion.Paginacion
{
    public class PaginacionRepositorio : IPaginacion
    {
        private readonly IFactoryConexion _factoryConexion;
        public PaginacionRepositorio(IFactoryConexion factoryConexion){
            _factoryConexion=factoryConexion;
        }
        public async Task<PaginacionModel> devolverPaginacion(string storeProcedure, int numeroPagina, int cantidadElementos, IDictionary<string, object> parametrosFiltro, string ordenamientoColumna)
        {
            PaginacionModel paginacionModel = new PaginacionModel();
            List<IDictionary<string,object>> listaReporte = null;
            int totalRecords = 0; 
            int totalPaginas = 0; 
                try
                {
                    var connection = _factoryConexion.GetConnection();
                    DynamicParameters parametros = new DynamicParameters();

                    foreach (var item in parametrosFiltro)
                    {
                        parametros.Add("@"+item.Key,item.Value);
                    }

                    parametros.Add("@NumeroPagina",numeroPagina);
                    parametros.Add("@CantidadElementos",cantidadElementos);
                    parametros.Add("@Ordenamiento",ordenamientoColumna);

                    parametros.Add("@TotalRecords",totalRecords,DbType.Int32,ParameterDirection.Output);
                    parametros.Add("@TotalPaginas",totalPaginas,DbType.Int32,ParameterDirection.Output);

                    var result = await connection.QueryAsync(storeProcedure,parametros,commandType:CommandType.StoredProcedure);
                    listaReporte = result.Select(x=>(IDictionary<string,object>)x).ToList();
                    paginacionModel.ListaRecords=listaReporte;
                    paginacionModel.NumeroPaginas=parametros.Get<int>("@TotalPaginas");
                    paginacionModel.TotalRecords=parametros.Get<int>("@TotalRecords");
                }
                catch(Exception e)
                {
                    throw new System.Exception("No se pudo ejecutar el procedimiento almacenado: "+e.Message,e);
                }
                finally
                {
                    _factoryConexion.CloseConection();
                }
                    return paginacionModel;
        }
    }
}