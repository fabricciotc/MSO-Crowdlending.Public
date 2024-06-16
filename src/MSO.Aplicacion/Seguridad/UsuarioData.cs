namespace MSO.Aplicacion.Seguridad
{
    public class UsuarioData
    {
        public string NombreCompleto{set;get;}
        public string Token{set;get;}
        public string Email{set;get;}
        public string Username { set; get; }
        public string NumeroDocumento { set; get; }
        public string Tipo { set; get; }
        public string Imagen{set;get;}
        public ImagenGeneral ImagenPerfil { get; set; }
    }
}