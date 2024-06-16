using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MSO.Dominio
{
    public class Pago
    {
        public int Id { set; get; }
        public DateTime DateTime { set; get; }
        public string Pagador { set; get; }
        public string Beneficiario { set; get; }
        public string Descripcion { set; get; }
        public DateTime FechaPago {  set; get; }
        public decimal Monto { set; get; }
    }
}
