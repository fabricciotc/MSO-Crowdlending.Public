using Microsoft.AspNetCore.Identity;

namespace MSO.Dominio
{
    public class Usuario : IdentityUser
    {
        public string Fullname{set;get;}
        public string Identificacion { set; get; }
        public string UserType { set; get; }
    }
}