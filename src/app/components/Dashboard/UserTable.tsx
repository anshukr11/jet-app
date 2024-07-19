import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table'
import { useMemo, useState } from 'react'

interface User {
  id?: number
  first_name: string
  last_name: string
  email: string
  alternate_email?: string
  age: number
}

interface UserTableProps {
  users: User[]
  onEdit: any
  onDelete: (id: number) => void
}

const UserTable = ({ users, onEdit, onDelete }: UserTableProps) => {
  const [editingRow, setEditingRow] = useState<number | null>(null)
  const [editedData, setEditedData] = useState<User | null>(null)

  const data = useMemo(() => users, [users])

  const columns = useMemo<ColumnDef<User>[]>(
    () => [
      {
        header: 'First Name',
        accessorKey: 'first_name',
        cell: ({ row }) =>
          editingRow === row.index ? (
            <input
              value={editedData?.first_name || row.original.first_name}
              onChange={(e) =>
                handleEdit(row.index, 'first_name', e.target.value)
              }
            />
          ) : (
            row.original.first_name
          ),
      },
      {
        header: 'Last Name',
        accessorKey: 'last_name',
        cell: ({ row }) =>
          editingRow === row.index ? (
            <input
              value={editedData?.last_name || row.original.last_name}
              onChange={(e) =>
                handleEdit(row.index, 'last_name', e.target.value)
              }
            />
          ) : (
            row.original.last_name
          ),
      },
      {
        header: 'Email',
        accessorKey: 'email',
        cell: ({ row }) =>
          editingRow === row.index ? (
            <input
              value={editedData?.email || row.original.email}
              onChange={(e) => handleEdit(row.index, 'email', e.target.value)}
            />
          ) : (
            row.original.email
          ),
      },
      {
        header: 'Alternate Email',
        accessorKey: 'alternate_email',
        cell: ({ row }) =>
          editingRow === row.index ? (
            <input
              value={
                editedData?.alternate_email ||
                row.original.alternate_email ||
                ''
              }
              onChange={(e) =>
                handleEdit(row.index, 'alternate_email', e.target.value)
              }
            />
          ) : (
            row.original.alternate_email
          ),
      },
      {
        header: 'Age',
        accessorKey: 'age',
        cell: ({ row }) =>
          editingRow === row.index ? (
            <input
              type="number"
              value={editedData?.age || row.original.age}
              onChange={(e) =>
                handleEdit(row.index, 'age', parseInt(e.target.value))
              }
            />
          ) : (
            row.original.age
          ),
      },
      {
        header: 'Actions',
        cell: ({ row }) => (
          <div>
            {editingRow === row.index ? (
              <>
                <button onClick={() => handleSave(row.original)}>Save</button>
                <button onClick={() => handleCancel()}>Cancel</button>
              </>
            ) : (
              <>
                <button
                  onClick={() => handleEditClick(row.index, row.original)}
                  className="mr-2 px-3 py-1 text-sm text-white bg-blue-500 rounded hover:bg-blue-600"
                >
                  Edit
                </button>
                <button
                  onClick={() => onDelete(row.original.id!)}
                  className="px-3 py-1 text-sm text-white bg-red-500 rounded hover:bg-red-600"
                >
                  Delete
                </button>
              </>
            )}
          </div>
        ),
      },
    ],
    [editingRow, editedData, onDelete],
  )

  const handleEditClick = (index: number, user: User) => {
    setEditingRow(index)
    setEditedData(user)
  }

  const handleEdit = (index: number, field: keyof User, value: any) => {
    setEditedData((prev) => ({ ...prev!, [field]: value }))
  }

  const handleSave = (originalUser: User) => {
    if (editedData) {
      onEdit({ ...originalUser, ...editedData })
      setEditingRow(null)
      setEditedData(null)
    }
  }

  const handleCancel = () => {
    setEditingRow(null)
    setEditedData(null)
  }

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
  })

  return (
    <>
      <table className="min-w-full bg-white border border-gray-300">
        <thead>
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <th
                  key={header.id}
                  onClick={header.column.getToggleSortingHandler()}
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-200"
                >
                  {flexRender(
                    header.column.columnDef.header,
                    header.getContext(),
                  )}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody>
          {table.getRowModel().rows.map((row) => (
            <tr key={row.id} className="hover:bg-gray-50">
              {row.getVisibleCells().map((cell) => (
                <td key={cell.id} className="px-6 py-4 whitespace-nowrap">
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>

      <div className="mt-4 flex items-center justify-between">
        <button
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
          Previous
        </button>
        <span>
          Page{' '}
          <strong>
            {table.getState().pagination.pageIndex + 1} of{' '}
            {table.getPageCount()}
          </strong>{' '}
        </span>
        <button
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
        >
          Next
        </button>
        <select
          value={table.getState().pagination.pageSize}
          onChange={(e) => {
            table.setPageSize(Number(e.target.value))
          }}
          className="ml-2 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
        >
          {[10, 20, 30, 40, 50].map((pageSize) => (
            <option key={pageSize} value={pageSize}>
              Show {pageSize}
            </option>
          ))}
        </select>
      </div>
    </>
  )
}

export default UserTable
