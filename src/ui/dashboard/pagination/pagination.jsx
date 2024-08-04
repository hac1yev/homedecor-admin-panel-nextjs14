"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import styles from "./pagination.module.css";

const Pagination = ({ count }) => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const params = new URLSearchParams(searchParams);
  const page = searchParams.get("page") || 1;

  let hasPrev = parseInt(page) > 1;
  let hasNext = count / 5 > page;

  const handlePagination = (arg) => {
    if(arg === "prev") {
      params.set("page", parseInt(page) - 1);
      router.push("")
    }else{
      params.set("page", parseInt(page) + 1);
    }
    router.push(`${pathname}?${params}`);
  }

  return (
    <div className={styles.container}>
      <button
        className={styles.button}
        disabled={!hasPrev}
        onClick={() => handlePagination("prev")}
      >
        Previous
      </button>
      <button
        className={styles.button}
        onClick={() => handlePagination("next")}
        disabled={!hasNext}
      >
        Next
      </button>
    </div>
  );
};

export default Pagination;