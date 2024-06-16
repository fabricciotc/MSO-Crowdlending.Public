using System.Reflection.Metadata.Ecma335;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using MSO.Aplicacion.Contratos;
using MSO.Aplicacion.ManejadorError;
using MSO.Dominio;
using MediatR;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using MSO.Persistencia;
using FluentValidation;

namespace MSO.Aplicacion.Seguridad
{
    public class Registrar
    {
        public class Ejecuta : IRequest<UsuarioData>
        {
            public string Fullname { set; get; }
            public string Email { set; get; }
            public string Password { set; get; }
            public string UserType { set; get; }
            public string Identificacion { set; get; }
        }
        public class EjecutaValidador : AbstractValidator<Ejecuta>
        {
            public EjecutaValidador()
            {
                RuleFor(x => x.Fullname).NotEmpty();
                RuleFor(x => x.Email).NotEmpty();
                RuleFor(x => x.Password).NotEmpty();
                RuleFor(x => x.Identificacion).NotEmpty();
                RuleFor(x => x.UserType).NotEmpty();
            }
        }
        public class Manejador : IRequestHandler<Ejecuta, UsuarioData>
        {
            private readonly CrowdlendingOnlineDbContext _context;
            private readonly UserManager<Usuario> _usermManager;
            private readonly IJwtGenerador _jwtGenerador;
            private readonly SignInManager<Usuario> _signInManager;

            public Manejador(CrowdlendingOnlineDbContext context,
                             UserManager<Usuario> userManager,
                             IJwtGenerador jwtGenerador,
                             SignInManager<Usuario> signInManager)
            {
                this._context = context;
                this._usermManager = userManager;
                this._jwtGenerador = jwtGenerador;
                this._signInManager = signInManager;
            }
            public async Task<UsuarioData> Handle(Ejecuta request, CancellationToken cancellationToken)
            {
                var existe = await _context.Users.Where(user => user.Email == request.Email).AnyAsync();
                if (existe)
                {
                    throw new ManejadorExcepcion(System.Net.HttpStatusCode.BadRequest, new { mensaje = "Existe ya un usuario con este Email" });
                }
                var existeun = await _context.Users.Where(user => user.UserType == request.UserType && user.Identificacion == request.Identificacion).AnyAsync();
                if (existeun)
                {
                    throw new ManejadorExcepcion(System.Net.HttpStatusCode.BadRequest, new { mensaje = "Existe ya un usuario con este numero y tipo de documento" });
                }
                if(request.Fullname.Split(" ").Length <= 1 && request.UserType == "Inversionista") { throw new ManejadorExcepcion(System.Net.HttpStatusCode.BadRequest, new { mensaje = "El Nombre Completo debe incluir almenos un Apellido y Nombre" }); }
                if(request.UserType == "Inversionista")
                {
                    if (!ValidarDNI(request.Identificacion))
                    {
                        throw new ManejadorExcepcion(System.Net.HttpStatusCode.BadRequest, new { mensaje = "El DNI no tiene un formato valido" });
                    }
                }
                else
                {
                    if (!ValidarRUC(request.Identificacion))
                    {
                        throw new ManejadorExcepcion(System.Net.HttpStatusCode.BadRequest, new { mensaje = "El RUC no tiene un formato valido" });
                    }
                }
                var usuario = new Usuario
                {
                    Fullname = request.Fullname,
                    Email = request.Email,
                    UserName = request.Email,
                    UserType = request.UserType,
                    Identificacion = request.Identificacion
                };
                var result = await _usermManager.CreateAsync(usuario, request.Password);
                if (result.Succeeded)
                {
                    var usuarioResponse = new UsuarioData
                    {
                        NombreCompleto = usuario.Fullname,
                        Token = _jwtGenerador.CrearToken(usuario, null),
                        Username = usuario.UserName,
                        Email = usuario.Email,
                        Tipo = usuario.UserType,
                        NumeroDocumento = usuario.Identificacion
                    };
                    await _signInManager.CheckPasswordSignInAsync(usuario, request.Password, false);
                    return usuarioResponse;
                }
                throw new System.Exception("No se pudo agregar al nuevo usuario");
            }
        }

        public static bool ValidarDNI(string dni)
        {
            // Comprobar la longitud del DNI
            if (dni.Length != 8)
            {
                return false;
            }

            // Comprobar que todos los caracteres son dígitos
            foreach (char c in dni)
            {
                if (!char.IsDigit(c))
                {
                    return false;
                }
            }

            // Si pasó las validaciones anteriores, el DNI es válido
            return true;
        }
        public static bool ValidarRUC(string RUC)
        {
            // Comprobar la longitud del DNI
            if (RUC.Length != 11)
            {
                return false;
            }

            

            // Comprobar que todos los caracteres son dígitos
            foreach (char c in RUC)
            {
                if (!char.IsDigit(c))
                {
                    return false;
                }
            }
            if (RUC.StartsWith("10")|| RUC.StartsWith("20"))
            {
                return true;
            }
            return false;
            // Si pasó las validaciones anteriores, el DNI es válido
        }
    }
}