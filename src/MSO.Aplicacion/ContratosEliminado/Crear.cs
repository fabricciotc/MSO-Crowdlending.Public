using FluentValidation;
using MediatR;
using MSO.Dominio;
using MSO.Persistencia;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading;
using System.Threading.Tasks;

namespace MSO.Aplicacion.ContratosEliminado
{
    public class Crear
    {
        public class Ejecuta : IRequest
        {
            public string ContratoId { set; get; }
        }
        public class EjecutaValidacion : AbstractValidator<Ejecuta>
        {
            public EjecutaValidacion()
            {
                RuleFor(d => d.ContratoId).NotEmpty();
            }
        }
        public class Manejador : IRequestHandler<Ejecuta>
        {
            private readonly CrowdlendingOnlineDbContext _context;
            public Manejador(CrowdlendingOnlineDbContext context)
            {
                _context = context;
            }
            public async Task<Unit> Handle(Ejecuta request, CancellationToken cancellationToken)
            {
                var contrato = new ContratosEliminados
                {
                    ContratoId = request.ContratoId,
                    DateTime = DateTime.UtcNow
                };
                _context.Add(contrato);
                var result = await _context.SaveChangesAsync();
                if (result >= 0)
                {
                    return Unit.Value;
                }
                throw new Exception("No se realizo ninguna insersion de un contrato eliminado");
            }
        }
    }
}
