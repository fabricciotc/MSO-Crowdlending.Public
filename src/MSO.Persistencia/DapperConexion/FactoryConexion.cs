using System.Data;
using Microsoft.Data.SqlClient;
using Microsoft.Extensions.Options;

namespace MSO.Persistencia.DapperConexion
{
    public class FactoryConexion : IFactoryConexion
    {
        private IDbConnection _connection;
        private readonly IOptions<conexionConfiguracion> _configs;
        public FactoryConexion(IOptions<conexionConfiguracion> configs){
            _configs=configs;
        }
        public void CloseConection()
        {
           if(_connection!=null&&_connection.State==ConnectionState.Open){
               _connection.Close();
           }
        }

        public IDbConnection GetConnection()
        {
           if(_connection==null){
               _connection=new SqlConnection(_configs.Value.PostgreSql);
           }
           if(_connection.State!= ConnectionState.Open){
               _connection.Open();
           }
           return _connection;
        }
    }
}