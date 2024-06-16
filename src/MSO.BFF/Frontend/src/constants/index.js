import {
  createCampaign,
  dashboard,
  logout,
  payment,
  profile,
  withdraw,
  faq,
  whatsapp,
  book,
} from "../assets";

export const navlinksEmpresa = [
  {
    name: "inicio",
    imgUrl: dashboard,
    link: "/",
  },
  {
    name: "prestamo",
    imgUrl: createCampaign,
    link: "/solicitar-prestamo",
  },
  {
    name: "Mis Solicitudes",
    imgUrl: withdraw,
    link: "/mis-solicitudes",
  },
  {
    name: "Mis Pagos",
    imgUrl: payment,
    link: "/mis-pagos",
  },
  {
    name: "perfil",
    imgUrl: profile,
    link: "/perfil",
  },
  {
    name: "Logout",
    imgUrl: logout,
    link: "/",
  },
  {
    name: "Orientacion",
    imgUrl: faq,
    link: "/orientacion",
  },
];

export const navlinksInversionista = [
  {
    name: "inicio",
    imgUrl: dashboard,
    link: "/",
  },
  {
    name: "Mis Inversiones",
    imgUrl: withdraw,
    link: "/mis-inversiones",
  },
  {
    name: "Mis Retornos",
    imgUrl: payment,
    link: "/mis-retornos",
  },
  {
    name: "Perfil",
    imgUrl: profile,
    link: "/perfil",
  },
  {
    name: "Logout",
    imgUrl: logout,
    link: "/",
  },
  {
    name: "Orientacion",
    imgUrl: faq,
    link: "/orientacion",
  },
];
