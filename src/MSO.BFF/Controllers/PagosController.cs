using MediatR;
using Microsoft.AspNetCore.Mvc;
using MSO.Aplicacion.Pagos;
using MSO.Dominio;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace MSO.BFF.Controllers
{
    public class PagosController : MiControllerBase
    {
        [HttpPost]
        public async Task<ActionResult<Unit>> SubirPago(Crear.Ejecuta parametros)
        {
            return await mediator.Send(parametros);
        }

        [HttpPut("{id}")]
        public async Task<ActionResult<Unit>> SubirPago(Editar.Ejecuta parametros)
        {
            return await mediator.Send(parametros);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<Pago>> ObtenerPago([FromRoute]int id)
        {
            var parametros = new ObtenerId.Ejecuta { Id = id };
            return await mediator.Send(parametros);
        }

        [HttpGet]
        public async Task<ActionResult<List<Pago>>> GetPagos()
        {
            return await mediator.Send(new Listar.Ejecuta());
        }

        [HttpDelete("{id}")]
        public async Task<ActionResult<Unit>> EliminarPago([FromRoute] int id)
        {
            var parametros = new Eliminar.Ejecuta { Id = id };
            return await mediator.Send(parametros);
        }
    }
}
