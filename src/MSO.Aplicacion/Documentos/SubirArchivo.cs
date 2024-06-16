using MSO.Aplicacion.Contratos;
using MSO.Aplicacion.Seguridad;
using MSO.Dominio;
using MediatR;
using Microsoft.EntityFrameworkCore;
using MSO.Persistencia;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading;
using System.Threading.Tasks;

namespace MSO.Aplicacion.Documentos
{
    public class SubirArchivo
    {
        public class Ejecuta : IRequest
        {
            public Guid? ObjetoReferencia { get; set; }
            public string Data { get; set; }
            public string Nombre { get; set; }
            public string Extension { get; set; }
        }
        public class Manejador : IRequestHandler<Ejecuta>
        {
            private readonly CrowdlendingOnlineDbContext _context;
            private readonly IUsuarioSesion _usuario;
            
            public Manejador(CrowdlendingOnlineDbContext context, IUsuarioSesion usuarioActual)
            {
                this._context = context;
                this._usuario = usuarioActual;
            }

            public async Task<Unit> Handle(Ejecuta request, CancellationToken cancellationToken)
            {
                var documento = await _context.Documento.FirstOrDefaultAsync(x => x.ObjetoReferencia == request.ObjetoReferencia);
                if (documento == null)
                {
                    var doc = new Documento
                    {
                        Contenido = Convert.FromBase64String(request.Data),
                        Nombre = request.Nombre,
                        Extension = request.Extension,
                        FechaCreacion = DateTime.UtcNow,
                        DocumentoId = Guid.NewGuid()
                    };
                    _context.Documento.Add(doc);
                }
                else
                {
                    documento.Contenido = Convert.FromBase64String(request.Data);
                    documento.Nombre = request.Nombre;
                    documento.Extension = request.Extension;
                    documento.FechaCreacion = DateTime.UtcNow;
                }
                var resultado = await _context.SaveChangesAsync();
                if (resultado > 0)
                {
                    return Unit.Value;
                }
                throw new Exception("No se pudo guardar el archivo");
            }
        }
    }
}
