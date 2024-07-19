import { useState } from 'react'

interface User {
  id?: number
  first_name: string
  last_name: string
  email: string
  alternate_email?: string
  password: string
  age: number
}

interface UserFormProps {
  onSubmit: (user: User) => void
  user: User | null
}

const UserForm = ({ onSubmit, user }: UserFormProps) => {
  const [formData, setFormData] = useState(
    user || {
      first_name: '',
      last_name: '',
      email: '',
      alternate_email: '',
      password: '',
      age: 18,
    },
  )

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData({ ...formData, [name]: value })
  }

  const handleSubmit = (e: React.ChangeEvent<HTMLFormElement>) => {
    e.preventDefault()
    onSubmit(formData)
  }

  return (
    <form onSubmit={handleSubmit}>
      <input
        name="first_name"
        value={formData.first_name}
        onChange={handleChange}
        placeholder="First Name"
        required
      />
      <input
        name="last_name"
        value={formData.last_name}
        onChange={handleChange}
        placeholder="Last Name"
        required
      />
      <input
        name="email"
        value={formData.email}
        onChange={handleChange}
        placeholder="Email"
        required
      />
      <input
        name="alternate_email"
        value={formData.alternate_email}
        onChange={handleChange}
        placeholder="Alternate Email"
      />
      <input
        name="password"
        type="password"
        value={formData.password}
        onChange={handleChange}
        placeholder="Password"
        required
      />
      <input
        name="age"
        type="number"
        value={formData.age}
        onChange={handleChange}
        placeholder="Age"
        min="18"
        required
      />
      <button type="submit">Submit</button>
    </form>
  )
}

export default UserForm
