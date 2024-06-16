using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MSO.Dominio
{
    public class Documento
    {
        public Guid DocumentoId { set; get; }
        public Guid ObjetoReferencia { set; get; }
        public string Nombre { set; get; }
        public string Extension { set; get; }
        public byte[] Contenido { set; get; }
        public DateTime FechaCreacion { set; get; }
    }
}
