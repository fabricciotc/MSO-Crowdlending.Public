using System.Collections.Generic;
using MSO.Dominio;

namespace MSO.Aplicacion.Contratos
{
    public interface IJwtGenerador
    {
        string CrearToken(Usuario usuario, List<string> roles);
    }
}