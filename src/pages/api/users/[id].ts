import bcrypt from 'bcryptjs'
import fs from 'fs'
import { NextApiRequest, NextApiResponse } from 'next'
import path from 'path'

interface User {
  id: number
  first_name: string
  last_name: string
  email: string
  alternate_email?: string
  password: string
  age: number
}

const dataFilePath = path.join(process.cwd(), 'data', 'users.json')

const getUsers = (): User[] => {
  const jsonData = fs.readFileSync(dataFilePath, 'utf8')
  return JSON.parse(jsonData) as User[]
}

const saveUsers = (users: User[]) => {
  fs.writeFileSync(dataFilePath, JSON.stringify(users, null, 2), 'utf8')
}

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const users = getUsers()
  const { id } = req.query

  if (req.method === 'PUT') {
    const index = users.findIndex((user) => user.id === parseInt(id as string))
    if (index !== -1) {
      users[index] = {
        ...users[index],
        ...req.body,
        password: req.body.password
          ? bcrypt.hashSync(req.body.password, 8)
          : users[index].password,
      }
      saveUsers(users)
      res.status(200).json(users[index])
    } else {
      res.status(404).json({ message: 'User not found' })
    }
  } else if (req.method === 'DELETE') {
    const newUsers = users.filter((user) => user.id !== parseInt(id as string))
    saveUsers(newUsers)
    res.status(204).end()
  } else {
    res.status(405).json({ message: 'Method Not Allowed' })
  }
}
