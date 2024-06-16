using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using MSO.Dominio;
using System;

namespace MSO.Persistencia
{
    public class CrowdlendingOnlineDbContext : IdentityDbContext<Usuario>
    {
        public CrowdlendingOnlineDbContext(DbContextOptions options) : base(options)
        {
            AppContext.SetSwitch("Npgsql.EnableLegacyTimestampBehavior", true);

        }
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            //ARCHIVO DE MIGRACION
            base.OnModelCreating(modelBuilder);
            //CREACION DE 2 LLAVES FORANEAS COMO PRIMARIA
        }
        public DbSet<Usuario> Usuario { set; get; }
        public DbSet<Documento> Documento { set; get; }
        public DbSet<ContratosEliminados> ContratosEliminados { set; get; }
        public DbSet<Pago> Pagos { set; get; }
    }
}