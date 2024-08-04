import { getUsers } from "@/src/lib/data";
import UsersComponent from "@/src/ui/dashboard/users/UsersComponent"

const Users = async ({ searchParams }) => {
  const q = searchParams?.q || "";
  const page = searchParams?.page || 1;

  const { users, count } = await getUsers(q, page);

  return (
    <UsersComponent users={users} count={count} />
  )
}

export default Users