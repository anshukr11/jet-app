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

  if (req.method === 'GET') {
    res.status(200).json(users)
  } else if (req.method === 'POST') {
    const newUser: User = {
      id: Date.now(),
      ...req.body,
      password: bcrypt.hashSync(req.body.password, 8),
    }
    users.push(newUser)
    saveUsers(users)
    res.status(201).json(newUser)
  } else {
    res.status(405).json({ message: 'Method Not Allowed' })
  }
}
