import DeleteDialog from "@/components/shared/delete-dialog";
import Pagination from "@/components/shared/Product/pagination";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { deleteUser, getAllUsers } from "@/lib/actions/user.actions";
import { formatId } from "@/lib/utils";
import Link from "next/link";
import { Metadata } from "next";
import { Badge } from "@/components/ui/badge";



export const metadata: Metadata = {
    title: 'Admin Users'
}

const AdmimUserPage = async (props: {
    searchParams: Promise<{
        page: string,
    }>
}) => {
    const {page = '1'} = await props.searchParams

    const users = await getAllUsers({page: Number(page)})

    console.log('Users:',users)

    return (
    <div className="space-y-2">
      <h2 className="h2-hold">Users</h2>
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>NAME</TableHead>
              <TableHead>EMAIL</TableHead>
              <TableHead>ROLE</TableHead>
              <TableHead>ACTIONS</TableHead>

            </TableRow>
          </TableHeader>
          <TableBody>
            {users.data.map((user) => (
              <TableRow key={user.id}>
                <TableCell>{formatId(user.id)}</TableCell>
                <TableCell>
                  {user.name}
                </TableCell>
                <TableCell>
                  {user.email}
                </TableCell>
                <TableCell>
                    <Badge variant={user.role === 'admin' ? 'destructive' : 'secondary'}>{user.role || 'user'}</Badge>
                </TableCell>
                <TableCell>
                  <Button asChild variant='outline' size='sm'>
                    <Link href={`/admin/users/${user.id}`}>
                    <span className="px-2">Edit</span>
                  </Link>
                  </Button>
                  <DeleteDialog id={user.id} action={deleteUser}/>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        {users.totalPages > 1 && (
          <Pagination
            page={Number(page) || 1}
            totalPages={users?.totalPages}
          />
        )}
      </div>
    </div>
  );
}
 
export default AdmimUserPage;