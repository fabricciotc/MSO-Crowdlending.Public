using FluentValidation;
using MediatR;
using Microsoft.EntityFrameworkCore;
using MSO.Persistencia;
using System;
using System.Threading;
using System.Threading.Tasks;

namespace MSO.Aplicacion.Pagos
{
    public class Eliminar
    {

    public class Ejecuta : IRequest
    {
        public int Id { get; set; }
    }
    public class EjecutaValidacion : AbstractValidator<Ejecuta>
    {
        public EjecutaValidacion()
        {
            RuleFor(d => d.Id).NotEmpty();
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
            var pago = await _context.Pagos.FirstOrDefaultAsync(x => x.Id == request.Id);

            _context.Remove(pago);
            var result = await _context.SaveChangesAsync();
            if (result >= 0)
            {
                return Unit.Value;
            }

            throw new Exception("No se realizo ninguna actualizacion del Pago");
        }
    }
    }
}
