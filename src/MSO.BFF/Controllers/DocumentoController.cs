using MSO.Aplicacion.Documentos;
using MediatR;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Threading.Tasks;

namespace MSO.BFF.Controllers
{
    public class DocumentoController : MiControllerBase
    {
        [HttpPost]
        public async Task<ActionResult<Unit>> SubirArchivo(SubirArchivo.Ejecuta parametros)
        {
            return await mediator.Send(parametros);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<ArchivoGenerico>> ObtenerDocumento(ObtenerArchivo.Ejecuta parametros)
        {
            return await mediator.Send(parametros);
        }
    }
}
