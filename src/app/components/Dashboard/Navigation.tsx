import Link from 'next/link'

const Navigation = () => {
  return (
    <nav className="fixed right-0 top-0 w-1/4 h-full p-4 bg-gray-100">
      <ul>
        <li className="my-2">
          <Link href="/dashboard">Users</Link>
        </li>
      </ul>
    </nav>
  )
}

export default Navigation
