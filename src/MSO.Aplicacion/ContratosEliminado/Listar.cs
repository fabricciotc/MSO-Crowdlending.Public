using MediatR;
using Microsoft.EntityFrameworkCore;
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
    public class Listar
    {
        public class Ejecuta : IRequest<List<ContratosEliminados>> { }
        public class Manejador : IRequestHandler<Ejecuta, List<ContratosEliminados>>
        {
            private readonly CrowdlendingOnlineDbContext _context;
            public Manejador(CrowdlendingOnlineDbContext context)
            {
                _context = context;
            }
            public async Task<List<ContratosEliminados>> Handle(Ejecuta request, CancellationToken cancellationToken)
            {
                return await _context.ContratosEliminados.ToListAsync();
            }
        }
    }
}
