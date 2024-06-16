using FluentValidation;
using MediatR;
using MSO.Aplicacion.Contratos;
using MSO.Dominio;
using MSO.Persistencia;
using System.Threading.Tasks;
using System.Threading;
using System;
using System.Linq;
using Microsoft.EntityFrameworkCore;

namespace MSO.Aplicacion.Pagos
{
    public class Editar
    {
        public class Ejecuta : IRequest
        {
            public int Id { get; set; }
            public string Beneficiario { set; get; }
            public DateTime FechaPago { set; get; }
            public decimal Monto { set; get; }
            public string Descripcion { set; get; }
        }
        public class EjecutaValidacion : AbstractValidator<Ejecuta>
        {
            public EjecutaValidacion()
            {
                RuleFor(d => d.Descripcion).NotEmpty();
                RuleFor(d => d.Monto).NotEmpty();
                RuleFor(d => d.Id).NotEmpty();
                RuleFor(d => d.FechaPago).NotEmpty();
                RuleFor(d => d.Beneficiario).NotEmpty();
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
                pago.Descripcion = request.Descripcion;
                pago.Monto = request.Monto;
                pago.FechaPago = request.FechaPago;
                pago.DateTime = DateTime.Now.SetKindUtc();
                pago.Beneficiario = request.Beneficiario;

                _context.Update(pago);
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
