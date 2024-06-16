using FluentValidation;
using MediatR;
using Microsoft.EntityFrameworkCore;
using MSO.Aplicacion.Contratos;
using MSO.Dominio;
using MSO.Persistencia;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace MSO.Aplicacion.Pagos
{
    public class Listar
    {
        public class Ejecuta : IRequest<List<Pago>>{}
        public class Manejador : IRequestHandler<Ejecuta, List<Pago>>
        {
            private readonly CrowdlendingOnlineDbContext _context;
            private readonly IUsuarioSesion _usuarioSesion;

            public Manejador(CrowdlendingOnlineDbContext context, IUsuarioSesion usuarioSesion)
            {
                _context = context;
                _usuarioSesion = usuarioSesion;
            }

            public async Task<List<Pago>> Handle(Ejecuta request, CancellationToken cancellationToken)
            {
                return await _context.Pagos.Where(x=> x.Pagador == _usuarioSesion.ObtenerUsuarioSesion()).ToListAsync();
            }
        }
    }
}
