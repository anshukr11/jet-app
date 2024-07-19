import Navigation from '@/app/components/Dashboard/Navigation'
import UserForm from '@/app/components/Dashboard/UserForm'
import UserTable from '@/app/components/Dashboard/UserTable'
import { useEffect, useState } from 'react'

interface User {
  id?: number
  first_name: string
  last_name: string
  email: string
  alternate_email?: string
  password: string
  age: number
}

const Dashboard = () => {
  const [users, setUsers] = useState<User[]>([])
  const [editingUser, setEditingUser] = useState<User | null>(null)

  const fetchUsers = async () => {
    const res = await fetch('/api/users')
    const data = await res.json()
    setUsers(data)
  }

  useEffect(() => {
    fetchUsers()
  }, [])

  const addUser = async (user: User) => {
    const res = await fetch('/api/users', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(user),
    })
    const newUser = await res.json()
    setUsers([...users, newUser])
  }

  const editUser = async (user: User) => {
    const res = await fetch(`/api/users/${user.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(user),
    })
    const updatedUser = await res.json()
    setUsers(users.map((u) => (u.id === updatedUser.id ? updatedUser : u)))
  }

  const deleteUser = async (id: number) => {
    await fetch(`/api/users/${id}`, {
      method: 'DELETE',
    })
    setUsers(users.filter((user) => user.id !== id))
  }

  return (
    <div className="flex">
      <Navigation />
      <div className="flex-grow p-4">
        <UserForm
          onSubmit={editingUser ? editUser : addUser}
          user={editingUser}
        />
        <UserTable
          users={users}
          onEdit={(updatedUser: User) => editUser(updatedUser)}
          onDelete={deleteUser}
        />
      </div>
    </div>
  )
}

export default Dashboard
