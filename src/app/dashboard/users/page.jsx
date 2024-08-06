import UsersComponent from "@/src/ui/dashboard/users/UsersComponent"

const Users = async ({ searchParams }) => {
  const q = searchParams?.q || "";
  const page = searchParams?.page || 1;

  return (
    <UsersComponent q={q} page={page} />
  )
}

export default Users