using System.Diagnostics.Tracing;
using System.Threading.Tasks;
using MSO.Aplicacion.Seguridad;
using MSO.Dominio;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace MSO.BFF.Controllers
{
    [AllowAnonymous]
    public class UsuarioController : MiControllerBase
    {
        [HttpPost("login")]
        public async Task<ActionResult<UsuarioData>> Login(Login.Ejecuta parametros)
        {
            return await mediator.Send(parametros);
        }
        [HttpPost("registrar")]
        public async Task<ActionResult<UsuarioData>> Registrar(Registrar.Ejecuta parametros)
        {
            return await mediator.Send(parametros);
        }
        [Authorize]
        [HttpPost("password")]
        public async Task<ActionResult<UsuarioData>> Password(UsuarioPassword.Ejecuta parametros)
        {
            return await mediator.Send(parametros);
        }
        [Authorize]
        [HttpGet]
        public async Task<ActionResult<UsuarioData>> ObtenerUsuario()
        {
            return await mediator.Send(new UsuarioActual.Ejecutar());
        }
        [Authorize]
        [HttpPut]
        public async Task<ActionResult<UsuarioData>> ActualizarUsuario(UsuarioActulizar.Ejecuta parametros)
        {
            return await mediator.Send(parametros);
        }
    }
}