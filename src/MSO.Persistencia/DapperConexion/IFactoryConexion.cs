using System.Data;
namespace MSO.Persistencia.DapperConexion
{
    public interface IFactoryConexion
    {
        void CloseConection();
        IDbConnection GetConnection();
    }
}