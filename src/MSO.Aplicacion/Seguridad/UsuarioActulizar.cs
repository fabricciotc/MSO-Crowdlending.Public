using System;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using MSO.Aplicacion.Contratos;
using MSO.Dominio;
using FluentValidation;
using MediatR;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using MSO.Persistencia;
using MSO.Aplicacion.ManejadorError;
using System.Text.RegularExpressions;

namespace MSO.Aplicacion.Seguridad
{
    public class UsuarioActulizar
    {
        public class Ejecuta : IRequest<UsuarioData>{
                public string NombreCompleto {set;get;}
                public string Email {set;get;}
                public string Password {set;get;}
                public string Username {set;get;}   
                public string NumeroDocumento { set; get; }
                public ImagenGeneral ImagenPerfil { get; set;}
        }
        public class EjecutaValidador: AbstractValidator<Ejecuta>{
            public EjecutaValidador(){
                RuleFor(x=>x.Email).EmailAddress().NotEmpty();
                RuleFor(x=>x.Password).NotEmpty();
                RuleFor(x=>x.NombreCompleto).NotEmpty();
                RuleFor(x=>x.Username).NotEmpty();
            }
        }
        public class Manejador : IRequestHandler<Ejecuta, UsuarioData>
        {
            private readonly CrowdlendingOnlineDbContext _context;
            private readonly UserManager<Usuario> _userManager;
            private readonly IJwtGenerador _jwtGenerador;

            public Manejador(UserManager<Usuario> userManager,CrowdlendingOnlineDbContext context,IJwtGenerador jwtGenerador){
                _userManager=userManager;
                _context=context;
                _jwtGenerador=jwtGenerador;
            }
            
            public async Task<UsuarioData> Handle(Ejecuta request, CancellationToken cancellationToken)
            {
                var usuarioIden= await _userManager.FindByNameAsync(request.Username);
                if(usuarioIden==null){
                    throw new System.Exception("Usuario por editar no encontrado");
                }
                if (usuarioIden.UserType == "Inversionista")
                {
                    if (!ValidarDNI(usuarioIden.Identificacion))
                    {
                        throw new ManejadorExcepcion(System.Net.HttpStatusCode.BadRequest, new { mensaje = "El DNI no tiene un formato valido" });
                    }
                }
                else
                {
                    if (!ValidarRUC(usuarioIden.Identificacion))
                    {
                        throw new ManejadorExcepcion(System.Net.HttpStatusCode.BadRequest, new { mensaje = "El RUC no tiene un formato valido" });
                    }
                }
                var passwordresult = await _userManager.CheckPasswordAsync(usuarioIden,request.Password);
                if(!passwordresult){
                    throw new System.Exception("La clave ingresada no concuerda con la del usuario");
                }
                var resultado = await _context.Users.Where(x=>x.Email==request.Email&&x.UserName!=request.Username).AnyAsync();
                if(resultado){
                    throw new System.Exception("No se puede usar ese email, porque ya se encuentra en uso");
                }

                var resultadoDocumento = await _context.Users.Where(x => x.Identificacion != request.NumeroDocumento).AnyAsync();

                if (resultado)
                {
                    throw new System.Exception("No se puede usar ese numero de documento, porque ya se encuentra en uso");
                }
                if (!request.Email.Contains("@"))
                {
                    throw new System.Exception("No se puede usar ese email ya que no tiene un @ dentro de su campo");
                }
                Regex regex = new Regex(@"^([\w\.\-]+)@([\w\-]+)((\.(\w){2,3})+)$");
                Match match = regex.Match(request.Email);
                if (!match.Success)
                {

                    throw new System.Exception("No se puede usar ese email ya que no tiene un formato valido");
                }

                if (request.ImagenPerfil != null) { 
                var resuladoImagen = await _context.Documento.Where(documento => documento.ObjetoReferencia == new Guid(usuarioIden.Id)).FirstOrDefaultAsync();
                    if (resuladoImagen == null)
                    {
                        var imagen = new Documento
                        {
                            Contenido = System.Convert.FromBase64String(request.ImagenPerfil.Data),
                            Nombre = request.ImagenPerfil.Nombre,
                            Extension = request.ImagenPerfil.Extension,
                            ObjetoReferencia = new Guid(usuarioIden.Id),
                            DocumentoId = Guid.NewGuid(),
                            FechaCreacion = DateTime.UtcNow
                        };
                        _context.Documento.Add(imagen);
                    }
                    else
                    {
                        resuladoImagen.Contenido = System.Convert.FromBase64String(request.ImagenPerfil.Data);
                        resuladoImagen.Nombre = request.ImagenPerfil.Nombre;
                        resuladoImagen.Extension = request.ImagenPerfil.Extension;
                    }
                }
                var imagenPerfil = await _context.Documento.FirstOrDefaultAsync(x => x.ObjetoReferencia == new Guid(usuarioIden.Id));
                usuarioIden.Fullname = request.NombreCompleto;
                usuarioIden.Email=request.Email;
                var updated = await _userManager.UpdateAsync(usuarioIden);
                if(updated.Succeeded){
                var roles= await _userManager.GetRolesAsync(usuarioIden);

                var usuarioResponse = new UsuarioData{
                    NombreCompleto = usuarioIden.Fullname,
                    Username = usuarioIden.UserName,
                    Email = usuarioIden.Email,
                    Token = _jwtGenerador.CrearToken(usuarioIden, roles.ToList()),
                    Tipo = usuarioIden.UserType,
                    NumeroDocumento = usuarioIden.Identificacion
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
                    return usuarioResponse;
                }
                throw new System.Exception("No se pudo actualizar la información de esta usuario");
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
            if (RUC.StartsWith("10") || RUC.StartsWith("20"))
            {
                return true;
            }
            return false;
            // Si pasó las validaciones anteriores, el DNI es válido
        }
    }
}