using System;
using System.Linq;
using System.Net;
using System.Threading;
using System.Threading.Tasks;
using MSO.Aplicacion.Contratos;
using MSO.Aplicacion.ManejadorError;
using MSO.Dominio;
using FluentValidation;
using MediatR;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using MSO.Persistencia;

namespace MSO.Aplicacion.Seguridad
{
    public class Login
    {
        public class Ejecuta : IRequest<UsuarioData>
        {
            public string Email { set; get; }
            public string Password { set; get; }
        }
        public class EjecutaValidacion : AbstractValidator<Ejecuta>
        {
            public EjecutaValidacion()
            {
                RuleFor(x => x.Email).NotEmpty();
                RuleFor(x => x.Password).NotEmpty();
            }
        }
        public class Manejador : IRequestHandler<Ejecuta, UsuarioData>
        {
            private readonly UserManager<Usuario> _userManager;
            private readonly SignInManager<Usuario> _signInManager;
            private readonly IJwtGenerador _jwtGenerador;
            private readonly CrowdlendingOnlineDbContext _context;

            public Manejador(UserManager<Usuario> userManager, SignInManager<Usuario> signInManager, IJwtGenerador jwtGenerador, CrowdlendingOnlineDbContext context)
            {
                this._signInManager = signInManager;
                this._userManager = userManager;
                this._jwtGenerador = jwtGenerador;
                this._context = context;

            }
            public async Task<UsuarioData> Handle(Ejecuta request, CancellationToken cancellationToken)
            {
                var usuario = await _userManager.FindByEmailAsync(request.Email);
                if (usuario == null)
                {
                    throw new ManejadorExcepcion(HttpStatusCode.Unauthorized, new { mensaje = "Crendenciales Incorrectas" });
                }
                var roles = await _userManager.GetRolesAsync(usuario);
                var result = await _signInManager.CheckPasswordSignInAsync(usuario, request.Password, false);

                var imagenPerfil = await _context.Documento.FirstOrDefaultAsync(x => x.ObjetoReferencia == new Guid(usuario.Id));
                var usuarioResponse = new UsuarioData
                {
                    NombreCompleto = usuario.Fullname,
                    Username = usuario.UserName,
                    Token = _jwtGenerador.CrearToken(usuario, roles.ToList()),
                    Email = usuario.Email,
                    Imagen = null,
                    Tipo = usuario.UserType,
                    NumeroDocumento = usuario.Identificacion
                };

                if (imagenPerfil != null)
                {
                    var imagenCliente = new ImagenGeneral
                    {
                        Data = Convert.ToBase64String(imagenPerfil.Contenido),
                        Nombre = imagenPerfil.Nombre,
                        Extension = imagenPerfil.Extension
                    };
                    usuarioResponse.ImagenPerfil = imagenCliente;
                }

                return result == SignInResult.Success ? usuarioResponse : throw new ManejadorExcepcion(System.Net.HttpStatusCode.Unauthorized, new { mensaje = "Crendenciales Incorrectas" });
            }
        }
    }
}