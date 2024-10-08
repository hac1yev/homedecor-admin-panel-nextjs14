"use client";

import Pagination from "../../../ui/dashboard/pagination/pagination";
import Search from "../../../ui/dashboard/search/search";
import styles from "../../../ui/dashboard/users/users.module.css";
import Image from "next/image";
import customLoader from "@/src/ui/custom-loader";
import { useEffect, useState } from "react";
import useAxiosPrivate from "@/src/hooks/useAxiosPrivate";

const UsersComponent = ({ q, page }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [users, setUsers] = useState([]);
  const [count, setCount] = useState(0);
  const axiosPrivate = useAxiosPrivate();

  useEffect(() => {
    (async function () {
      setIsLoading(true);
      try {
        const response = await axiosPrivate.get("/api/user", {
          params: { q, page },
        });

        setUsers(response.data.users);
        setCount(response.data.count);
      } catch (error) {
        console.log(error);
      }
      setIsLoading(false);
    })();
  }, [axiosPrivate, q, page]);

  const handleDelete = async (id) => {
    try {
      await axiosPrivate.delete(`/api/user?id=${id}`);

      const filteredProducts = users.filter((user) => user._id !== id);

      setUsers(filteredProducts);
      
    } catch (error) {
      console.log(error);
    }
  };

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
        {!isLoading && (
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
                <td style={{ display: "flex" }}>
                  <button className={`${styles.button} ${styles.delete}`} onClick={() => handleDelete(user._id)}>
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        )}
      </table>
      {isLoading && (
        <div className="flex-center" style={{ margin: "20px 0" }}>
          Loading...
        </div>
      )}
      {!isLoading && users.length === 0 && (
        <div className="flex-center" style={{ margin: "20px 0" }}>
          There is no user!
        </div>
      )}
      <Pagination count={count} />
    </div>
  );
};

export default UsersComponent;
