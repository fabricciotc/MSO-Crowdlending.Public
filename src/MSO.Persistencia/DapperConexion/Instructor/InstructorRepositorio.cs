using System.Data;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Dapper;

namespace MSO.Persistencia.DapperConexion.Instructor
{
    public class InstructorRepositorio : IInstructor
    {
        private readonly IFactoryConexion _factoryConection;
        public InstructorRepositorio(IFactoryConexion factoryConexion)
        {
            this._factoryConection = factoryConexion;
        }
        public async Task<int> Actualizar(InstructorModel parametros)
        {
                 var storeProcedure = "usp_Instructor_Actualizar";
                 var resultado=0;
                   try
            {
                var conection = _factoryConection.GetConnection();
                resultado = await conection.ExecuteAsync(storeProcedure,
                new
                {
                    InstructorId = parametros.InstructorId,
                    Nombre = parametros.Nombre,
                    Apellidos = parametros.Apellidos,
                    Grado = parametros.Grado
                },
                commandType: CommandType.StoredProcedure
                );
            }
            catch (Exception e)
            {
                throw new Exception("No se pudo actualizar el nuevo instructor", e);
            }
            finally
            {
                _factoryConection.CloseConection();
            }
            return resultado;
        }

        public async Task<int> Eliminar(Guid Id)
        {
               var storeProcedure = "usp_Instructor_Eliminar";
                 var resultado=0;
                   try
            {
                var conection = _factoryConection.GetConnection();
                resultado = await conection.ExecuteAsync(storeProcedure,
                new
                {
                    InstructorId = Id
                },
                commandType: CommandType.StoredProcedure
                );
            }
            catch (Exception e)
            {
                throw new Exception("No se pudo eliminar el nuevo instructor", e);
            }
            finally
            {
                _factoryConection.CloseConection();
            }
            return resultado;            
        }

        public async Task<int> Nuevo(InstructorModel parametros)
        {
            var storeProcedure = "usp_Instructor_Nuevo";
            var resultado = 0;
            try
            {
                var conection = _factoryConection.GetConnection();
                resultado = await conection.ExecuteAsync(storeProcedure,
                new
                {
                    InstructorId = Guid.NewGuid(),
                    Nombre = parametros.Nombre,
                    Apellidos = parametros.Apellidos,
                    Grado = parametros.Grado,
                },
                commandType: CommandType.StoredProcedure
                );
            }
            catch (Exception e)
            {
                throw new Exception("No se pudo insertar el nuevo instructor", e);
            }
            finally
            {
                _factoryConection.CloseConection();
            }
            return resultado;
        }

        public async Task<IEnumerable<InstructorModel>> obtenerLista()
        {
            IEnumerable<InstructorModel> instructorList = null;
            var storeProcedure = "usp_Obtener_Instructores";
            try
            {
                var conection = _factoryConection.GetConnection();
                instructorList = await conection.QueryAsync<InstructorModel>(storeProcedure, null, commandType: System.Data.CommandType.StoredProcedure);
            }
            catch (Exception e)
            {
                throw new Exception("Error en la consulta de datos", e);
            }
            finally
            {
                _factoryConection.CloseConection();
            }
            return instructorList;
        }

        public async Task<InstructorModel> obtenerPorId(Guid Id)
        {
            InstructorModel instructor = null;
            var storeProcedure = "usp_Instructor_Buscar";
            try
            {
                var conection = _factoryConection.GetConnection();
                instructor = await conection.QueryFirstAsync<InstructorModel>(storeProcedure, 
                new
                {
                    InstructorId = Id,
                }
                , commandType: System.Data.CommandType.StoredProcedure);
            }
            catch (Exception e)
            {
                throw new Exception("Error en la consulta de datos", e);
            }
            finally
            {
                _factoryConection.CloseConection();
            }
            return instructor;
        }
    }
}