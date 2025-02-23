/* eslint-disable no-unused-vars */
import logo from '../assest/logo.svg'
import bgMap from '../assest/svg/bg-map.svg'
import divider from '../assest/divider.png'
import icon1 from '../assest/svg/icon1.svg'
import icon2 from '../assest/svg/icon2.svg'
import icon3 from '../assest/svg/icon3.svg'
import hourly from '../assest/svg/hourly.svg'
import calendar from '../assest/svg/calendar.svg'
import available from '../assest/svg/available.svg'
import avatar1 from '../assest/svg/avatar1.svg'
import appleStore from '../assest/svg/app-store.svg'
import googleStore from '../assest/svg/play-store.svg'
import trustpilot from '../assest/svg/trustpilot.svg'
import avatar2 from '../assest/svg/avatar2.svg'
import avatar3 from '../assest/svg/avatar3.svg'
import icon4 from '../assest/svg/icon4.svg'
import about1 from '../assest/svg/about-1.svg'
import about2 from '../assest/svg/about-2.svg'
import about3 from '../assest/svg/about-3.svg'
import img1 from '../assest/img-1.png'
import img2 from '../assest/img-2.png'
import img3 from '../assest/img-3.png'
import img4 from '../assest/img-4.png'
import img5 from '../assest/img-5.png'
import img6 from '../assest/img-6.png'
import img7 from '../assest/img-7.png'
import img8 from '../assest/img-8.png'
import img9 from '../assest/img-9.png'
import img10 from '../assest/img-10.png'
import img11 from '../assest/img-11.png'
import img12 from '../assest/img-12.png'
import img13 from '../assest/img-13.png'
import img14 from '../assest/img-14.jpeg'
import img15 from '../assest/img-15.jpeg'
import img16 from '../assest/img-16.jpeg'
import img17 from '../assest/img-17.jpeg'
import img18 from '../assest/img-18.jpeg'
import img19 from '../assest/img-19.png'
import img20 from '../assest/img-20.png'
import img21 from '../assest/img-21.png'
import img22 from '../assest/img-22.png'
import img23 from '../assest/img-23.png'
import img24 from '../assest/img-24.png'
import img25 from '../assest/img-25.png'
import img26 from '../assest/img-26.png'
import img27 from '../assest/img-27.png'
import img28 from '../assest/img-28.png'
import img29 from '../assest/img-29.png'
import client1 from '../assest/client1.png'
import client2 from '../assest/client2.png'
import client3 from '../assest/client3.png'
import client4 from '../assest/client4.png'
import client5 from '../assest/client5.png'
import avatar5 from '../assest/avatar5.png'
import imagess from '../assest/imagess.svg'
import { Box, Disc, Home, Layers } from 'react-feather'
import { RxDashboard } from 'react-icons/rx'
import { IoSettingsOutline } from 'react-icons/io5'
import { FiLogOut } from 'react-icons/fi'

const catList = [
  { img: img1, heading: 'construction' },
  { img: img2, heading: 'welding & tools' },
  { img: img3, heading: 'Cleaning' },
  { img: img4, heading: 'Plumbing' },
  { img: img4, heading: 'Plumbing' },
]
const blogList = [
  { img: img21, heading: 'Government and Municipalities', desc: 'From day-to-day maintenance and planned project support to the technical assistance needed in response to unplanned or emergency events.' },
  { img: img22, heading: 'Utilities', desc: 'Herc Rentals works behind the scenes by providing our partners in the utility industry with the solutions and gear they need in both day-to-day operations and…' },
  { img: img23, heading: 'Renewable Energy', desc: 'Our team of renewable energy experts are available 24/7, ready to provide customers with a wide selection of efficient, effective, and safe equipment.' },
]
const ratingList = [
  { img: avatar1, name: "Brent O'Reilly" },
  { img: avatar2, name: "Lloyd J. Ratke" },
  { img: avatar3, name: 'Eorine Homenick' },
  { img: avatar1, name: "Brent O'Reilly" },
  { img: avatar2, name: "Lloyd J. Ratke" },
  { img: avatar3, name: 'Eorine Homenick' },
]
const equipList = [
  { img: img14, label: 'Lighting', subHeading: 'Generac G4 ECO', heading: 'Engine Driven LED Light Towers' },
  { img: img15, label: 'Material Handling', subHeading: 'Toyota - 8FBCU25', heading: 'Electric Forklift' },
  { img: img16, label: 'MEWP', subHeading: 'JLG - 3246ES', heading: 'Electric Scissor Lifts' },
  { img: img17, label: 'Power Generation', subHeading: 'Multiquip - DCA125SS', heading: 'Towable Generators' },
  { img: img14, label: 'Lighting', subHeading: 'Generac G4 ECO', heading: 'Engine Driven LED Light Towers' },
  { img: img15, label: 'Material Handling', subHeading: 'Toyota - 8FBCU25', heading: 'Electric Forklift' },
  { img: img16, label: 'MEWP', subHeading: 'JLG - 3246ES', heading: 'Electric Scissor Lifts' },
  { img: img17, label: 'Power Generation', subHeading: 'Multiquip - DCA125SS', heading: 'Towable Generators' },
]
const toolList = [
  { img: img5, heading: 'Pressure Washer' },
  { img: img6, heading: 'Gas Pressure Washer' },
  { img: img7, heading: 'Electric Conduit Bender' },
  { img: img8, heading: 'Hydraulic Conduit' },
  { img: img9, heading: 'Electric Grainder' },
  { img: img10, heading: '35kv Genrator' },
  { img: img11, heading: 'Sewer Camera' },
  { img: img12, heading: 'Welding Machine' },
  { img: img13, heading: 'Drill Power Tools' },
  { img: img5, heading: 'Pressure Washer' },
  { img: img6, heading: 'Gas Pressure Washer' },
  { img: img7, heading: 'Electric Conduit Bender' },
  { img: img8, heading: 'Hydraulic Conduit' },
  { img: img9, heading: 'Electric Grainder' },
  { img: img10, heading: '35kv Genrator' },
  { img: img11, heading: 'Sewer Camera' },
  { img: img12, heading: 'Welding Machine' },
  { img: img13, heading: 'Drill Power Tools' },
]
const subCatList = [
  { img: img24, heading: 'Brushless Hammer Drill 1.2in' },
  { img: img25, heading: 'Brushless Hammer Drill 1.2in' },
  { img: img26, heading: 'Brushless Hammer Drill 1.2in' },
  { img: img27, heading: 'Brushless Hammer Drill 1.2in' },
  { img: img28, heading: 'Brushless Hammer Drill 1.2in' },
  { img: img29, heading: 'Brushless Hammer Drill 1.2in' },
]
const menuItems = [
  {
    icon: <RxDashboard size={20} />,
    label: "Reviews",
    path: "/admin/reviews",
    exact: true,
  },
  {
    label: "Products",
    icon: <Box size={20} />,
    path: "/admin/product",
    exact: true,
  },
  {
    label: "Setting",
    icon: <IoSettingsOutline size={20} />,
    path: "/admin/setting",
    exact: true,
  },
  {
    label: "Log out",
    icon: <FiLogOut size={20} />,
    path: "/logout",
    exact: true,
  },
];

export const searchP = () => {
  return <svg xmlns="http://www.w3.org/2000/svg" width="19" height="20" viewBox="0 0 19 20" fill="none">
    <path fill-rule="evenodd" clip-rule="evenodd" d="M14.319 13.8526C16.7628 10.7141 16.542 6.17347 13.6569 3.28829C10.5327 0.164097 5.46734 0.164097 2.34315 3.28829C-0.78105 6.41249 -0.78105 11.4778 2.34315 14.602C5.22833 17.4872 9.769 17.7079 12.9075 15.2642C12.921 15.2795 12.9351 15.2945 12.9497 15.3091L17.1924 19.5517C17.5829 19.9423 18.2161 19.9423 18.6066 19.5517C18.9971 19.1612 18.9971 18.5281 18.6066 18.1375L14.364 13.8949C14.3493 13.8803 14.3343 13.8662 14.319 13.8526ZM12.2426 4.70251C14.5858 7.04565 14.5858 10.8446 12.2426 13.1878C9.8995 15.5309 6.1005 15.5309 3.75736 13.1878C1.41421 10.8446 1.41421 7.04565 3.75736 4.70251C6.1005 2.35936 9.8995 2.35936 12.2426 4.70251Z" fill="#F5AB1A" />
  </svg>
}

export {
  logo, img1, img2, img3, img4, img5, img6, img7, img8, img9, img10, img11, img12, img13, img14, img15, img16, img17, img18,
  toolList, equipList, catList, bgMap, divider, icon1, about1, about2, about3, icon2, img19, icon4, icon3, avatar1, avatar2, avatar3, trustpilot,
  ratingList, img20, img21, img22, img23, blogList, img24, img25, img26, img27, img28, img29, subCatList,
  client1, client2, client3, client4, client5, avatar5, available, calendar, hourly, googleStore, appleStore, menuItems, imagess
}