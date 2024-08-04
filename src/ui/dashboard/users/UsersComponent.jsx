"use client";

import Pagination from "../../../ui/dashboard/pagination/pagination";
import Search from "../../../ui/dashboard/search/search";
import styles from "../../../ui/dashboard/users/users.module.css";
import Image from "next/image";
import customLoader from "@/src/ui/custom-loader";

const UsersComponent = ({ users,count }) => {    
  return (
    <div className={styles.container}>
      <div className={styles.top}>
        <Search placeholder="Search for a user..." />
      </div>
      <table className={styles.table}>
        <thead>
          <tr>
            <td>
              <b>Fullname</b>
            </td>
            <td>
              <b>Email</b>
            </td>
            <td>
              <b>Username</b>
            </td>
            <td>
              <b>Role</b>
            </td>
            <td>
              <b>Status</b>
            </td>
            <td>
              <b>Action</b>
            </td>
          </tr>
        </thead>
        <tbody>
            {users.map((user) => (
              <tr key={user._id}>
                <td>
                  <div className={styles.user}>
                    <Image
                      loader={customLoader}
                      src={user.img || "/noavatar.png"}
                      priority
                      alt=""
                      width={40}
                      height={40}
                      className={styles.userImage}
                    />
                    {user.firstName} {user.lastName}
                  </div>
                </td>
                <td>{user.email}</td>
                <td>{user.username}</td>
                <td>{user.isAdmin ? "Admin" : "Client"}</td>
                <td>{user.isActive ? "active" : "passive"}</td>
                <td style={{ display: 'flex' }}>
                  <div className={styles.buttons}>
                    <form>
                      <input type="hidden" name="id" value={user.id} />
                      <button className={`${styles.button} ${styles.delete}`}>
                        Delete
                      </button>
                    </form>
                  </div>
                </td>
              </tr>
            ))}
        </tbody>
      </table>
      <Pagination count={count} />
    </div>
  );
};

export default UsersComponent;