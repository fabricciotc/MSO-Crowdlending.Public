using FluentValidation;
using MediatR;
using MSO.Aplicacion.Contratos;
using MSO.Dominio;
using MSO.Persistencia;
using System;
using System.Threading;
using System.Threading.Tasks;

namespace MSO.Aplicacion.Pagos
{
    public class Crear
    {
        public class Ejecuta : IRequest
        {
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
                RuleFor(d => d.FechaPago).NotEmpty();
                RuleFor(d => d.Beneficiario).NotEmpty();
            }
        }
        public class Manejador : IRequestHandler<Ejecuta>
        {
            private readonly CrowdlendingOnlineDbContext _context;
            private readonly IUsuarioSesion _usuarioSesion;

            public Manejador(CrowdlendingOnlineDbContext context, IUsuarioSesion usuarioSesion)
            {
                _context = context;
                _usuarioSesion = usuarioSesion;
            }

            public async Task<Unit> Handle(Ejecuta request, CancellationToken cancellationToken)
            {
                var pago = new Pago
                {
                    DateTime = DateTime.Now.SetKindUtc(),
                    Pagador = _usuarioSesion.ObtenerUsuarioSesion(),
                    Beneficiario = request.Beneficiario,
                    Descripcion = request.Descripcion,
                    FechaPago = request.FechaPago,
                    Monto = request.Monto
                };

                _context.Add(pago);
                var result = await _context.SaveChangesAsync();
                if (result >= 0)
                {
                    return Unit.Value;
                }

                throw new Exception("No se realizo ninguna insersion de un pago");
            }
        }
    }
}
