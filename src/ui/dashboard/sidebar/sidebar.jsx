"use client";

import Image from 'next/image';
import MenuLink from './menuLink/menuLink';
import styles from './sidebar.module.css';
import { MdDashboard,MdSupervisedUserCircle,MdShoppingBag,MdLogout } from "react-icons/md";
import customLoader from '../../custom-loader';
import axios from 'axios';
  
const menuItems = [
  {
    title: "Pages",
    list: [
      {
        title: "Dashboard",
        path: "/dashboard",
        icon: <MdDashboard />,
      },
      {
        title: "Users",
        path: "/dashboard/users",
        icon: <MdSupervisedUserCircle />,
      },
      {
        title: "Products",
        path: "/dashboard/products",
        icon: <MdShoppingBag />,
      }
    ],
  },
];

const Sidebar = () => {
  const handleLogout = async (e) => {
    e.preventDefault();

    await axios.get("/api/logout");
    window.location.reload();
  }

  return (
    <div className={styles.container}>
        <div className={styles.user}>
            <Image loader={customLoader} className={styles.userImage} src={"/noavatar.png"} alt="" priority width="50" height="50" />
            <div className={styles.userDetail}>
                <span className={styles.username}></span>
                <span className={styles.userTitle}>HOMEDECOR ADMIN PANEL</span>
            </div>
        </div>
        <ul className={styles.list}>
            {menuItems.map(cat => (
                <li key={cat.title}>
                    <span className={styles.cat}>{cat.title}</span>
                    {cat.list.map((item) => (
                        <MenuLink item={item} key={item.title} />
                    ))}
                </li>
            ))}
        </ul>
        <form onSubmit={handleLogout}>
          <button className={styles.logout}>
            <MdLogout />
            Logout
          </button>
        </form>
    </div>
  );
};

export default Sidebar;