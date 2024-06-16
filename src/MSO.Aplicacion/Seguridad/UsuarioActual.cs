using System;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using MSO.Aplicacion.Contratos;
using MSO.Dominio;
using MediatR;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using MSO.Persistencia;

namespace MSO.Aplicacion.Seguridad
{
    public class UsuarioActual
    {
        public class Ejecutar : IRequest<UsuarioData> {}
        public class Manejador : IRequestHandler<Ejecutar, UsuarioData>
        {
            private readonly UserManager<Usuario> _userManager;
            private readonly IJwtGenerador _jwtGenerador;
            private readonly IUsuarioSesion _usuarioSesion;
            private readonly CrowdlendingOnlineDbContext _context;
            public Manejador(UserManager<Usuario> userManager, IJwtGenerador jwtGenerador, IUsuarioSesion usuarioSesion, CrowdlendingOnlineDbContext context){
             this._jwtGenerador=jwtGenerador;
             this._userManager=userManager;
             this._usuarioSesion=usuarioSesion;   
             this._context=context;
            }
            public async Task<UsuarioData> Handle(Ejecutar request, CancellationToken cancellationToken)
            {
                var usuario =await _userManager.FindByNameAsync(_usuarioSesion.ObtenerUsuarioSesion());
                var roles = await _userManager.GetRolesAsync(usuario);
                var imagenPerfil = await _context.Documento.FirstOrDefaultAsync(x => x.ObjetoReferencia == new Guid(usuario.Id));
                if (imagenPerfil != null) {
                    var imagenCliente = new ImagenGeneral
                    {
                        Data = Convert.ToBase64String(imagenPerfil.Contenido),
                        Extension = imagenPerfil.Extension,
                        Nombre = imagenPerfil.Nombre
                    };
                    return new UsuarioData
                    {
                        Email = usuario.Email,
                        NombreCompleto = usuario.Fullname,
                        Username = usuario.UserName,
                        Token = _jwtGenerador.CrearToken(usuario, roles.ToList()),
                        ImagenPerfil = imagenCliente,
                        Imagen = null,
                        Tipo = usuario.UserType,
                        NumeroDocumento = usuario.Identificacion
                    };
                }
                return new UsuarioData {
                    Email=usuario.Email,
                    NombreCompleto = usuario.Fullname,
                    Username = usuario.UserName,
                    Token = _jwtGenerador.CrearToken(usuario,roles.ToList()),
                    Imagen = null,
                    Tipo = usuario.UserType,
                    NumeroDocumento = usuario.Identificacion
                };
            }
        }
    }
}