using System.Linq;
using System.Threading.Tasks;
using MSO.Dominio;
using Microsoft.AspNetCore.Identity;

namespace MSO.Persistencia
{
    public class DataPrueba
    {
        public static async Task InsertarData(CrowdlendingOnlineDbContext context, UserManager<Usuario> userManager)
        {
            if (!userManager.Users.Any())
            {
                var usuario = new Usuario()
                {
                    Fullname = "Fabriccio Tornero",
                    UserName = "fabriccio.tcortes@gmail.com",
                    Email = "fabriccio.tcortes@gmail.com"
                };
                await userManager.CreateAsync(usuario, "Password123!");
            }
        }
    }
}