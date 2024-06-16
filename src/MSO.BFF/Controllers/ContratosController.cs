using MediatR;
using Microsoft.AspNetCore.Mvc;
using MSO.Aplicacion.ContratosEliminado;
using MSO.Dominio;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace MSO.BFF.Controllers
{
    public class ContratosController : MiControllerBase
    {
        [HttpPost]
        public async Task<ActionResult<Unit>> SubirContratoEliminado(Crear.Ejecuta parametros)
        {
            return await mediator.Send(parametros);
        }

        [HttpGet]
        public async Task<ActionResult<List<ContratosEliminados>>> ObtenerDocumento()
        {
            return await mediator.Send(new Listar.Ejecuta());
        }
    }
}
