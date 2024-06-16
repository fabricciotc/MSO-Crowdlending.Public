using FluentValidation;
using MediatR;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using MSO.Aplicacion.Contratos;
using MSO.Aplicacion.ManejadorError;
using MSO.Dominio;
using MSO.Persistencia;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading;
using System.Threading.Tasks;

namespace MSO.Aplicacion.Seguridad
{
    public class UsuarioPassword
    {
        public class Ejecuta : IRequest<UsuarioData>
        {
            public string NewPassword { set; get; }
            public string Password { set; get; }
        }
        public class EjecutaValidador : AbstractValidator<Ejecuta>
        {
            public EjecutaValidador()
            {
                RuleFor(x => x.Password).NotEmpty();
                RuleFor(x => x.NewPassword).NotEmpty();
            }
        }
        public class Manejador : IRequestHandler<Ejecuta, UsuarioData>
        {
            private readonly CrowdlendingOnlineDbContext _context;
            private readonly UserManager<Usuario> _userManager;
            private readonly IJwtGenerador _jwtGenerador;
            private readonly IUsuarioSesion _usuarioSesion;

            public Manejador(UserManager<Usuario> userManager, CrowdlendingOnlineDbContext context, IJwtGenerador jwtGenerador, IUsuarioSesion usuarioSesion)
            {
                _userManager = userManager;
                _context = context;
                _jwtGenerador = jwtGenerador;
                _usuarioSesion = usuarioSesion;
            }

            public async Task<UsuarioData> Handle(Ejecuta request, CancellationToken cancellationToken)
            {

                var usuarioIden = await _userManager.FindByNameAsync(_usuarioSesion.ObtenerUsuarioSesion());
                if (usuarioIden == null)
                {
                    throw new System.Exception("Usuario por actualizar no encontrado");
                }
                
                var passwordresult = await _userManager.ChangePasswordAsync(usuarioIden, request.Password, request.NewPassword);
                if (!passwordresult.Succeeded)
                {
                    throw new System.Exception(string.Concat(passwordresult.Errors.First().Description));
                }
                var imagenPerfil = await _context.Documento.FirstOrDefaultAsync(x => x.ObjetoReferencia == new Guid(usuarioIden.Id));
                var roles = await _userManager.GetRolesAsync(usuarioIden);
                var imagenCliente = new ImagenGeneral();
                if (imagenPerfil != null)
                {
                    imagenCliente = new ImagenGeneral
                    {
                        Data = Convert.ToBase64String(imagenPerfil.Contenido),
                        Nombre = imagenPerfil.Nombre,
                        Extension = imagenPerfil.Extension
                    };
                }
                return new UsuarioData
                {
                    NombreCompleto = usuarioIden.Fullname,
                    Username = usuarioIden.UserName,
                    Email = usuarioIden.Email,
                    Token = _jwtGenerador.CrearToken(usuarioIden, roles.ToList()),
                    Tipo = usuarioIden.UserType,
                    NumeroDocumento = usuarioIden.Identificacion,
                    ImagenPerfil = imagenCliente.Data !=null ? imagenCliente:null
                };
            }
        }
    }
}
