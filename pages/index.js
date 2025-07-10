import { useState, useEffect } from 'react';
import Head from 'next/head';

export default function Home() {
  const [users, setUsers] = useState([]);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // 加载用户数据
  const loadUsers = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await fetch('/api/users');
      const data = await response.json();
      if (response.ok) {
        setUsers(data);
      } else {
        setError(data.error || 'Failed to load users');
      }
    } catch (err) {
      setError('Network error: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  // 添加新用户
  const addUser = async () => {
    if (!name || !email) {
      setError('Name and email are required');
      return;
    }
    
    setLoading(true);
    setError('');
    setSuccess('');
    try {
      const response = await fetch('/api/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ name, email })
      });
      
      const data = await response.json();
      if (response.ok) {
        // 重置表单并刷新列表
        setName('');
        setEmail('');
        setSuccess('User added successfully!');
        await loadUsers();
      } else {
        setError(data.error || 'Failed to add user');
      }
    } catch (err) {
      setError('Network error: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  // 初始化加载数据
  useEffect(() => {
    loadUsers();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-100 py-12 px-4">
      <Head>
        <title>Vercel + SQLPub MySQL Demo</title>
        <meta name="description" content="Demo app showing Vercel with SQLPub MySQL 8.4" />
      </Head>

      <div className="max-w-4xl mx-auto">
        <header className="text-center mb-16">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">
            <span className="text-blue-600">Vercel</span> + <span className="text-green-600">SQLPub</span> MySQL 8.4 Demo
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            This application demonstrates how to deploy a Next.js app on Vercel that connects to a SQLPub MySQL 8.4 database.
          </p>
        </header>

        <div className="bg-white rounded-xl shadow-lg p-8 mb-12">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h2 className="text-2xl font-bold text-gray-800 mb-6">Add New User</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-gray-700 mb-2">Name</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter name"
                  />
                </div>
                
                <div>
                  <label className="block text-gray-700 mb-2">Email</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter email"
                  />
                </div>
                
                <button
                  onClick={addUser}
                  disabled={loading}
                  className={`w-full py-3 px-6 rounded-lg font-medium text-white ${
                    loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
                  } transition-colors duration-200 flex items-center justify-center`}
                >
                  {loading ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Processing...
                    </>
                  ) : (
                    'Add User'
                  )}
                </button>
                
                {error && (
                  <div className="mt-4 p-3 bg-red-50 text-red-700 rounded-lg border border-red-200">
                    {error}
                  </div>
                )}
                
                {success && (
                  <div className="mt-4 p-3 bg-green-50 text-green-700 rounded-lg border border-green-200">
                    {success}
                  </div>
                )}
              </div>
            </div>
            
            <div>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800">User List</h2>
                <button 
                  onClick={loadUsers}
                  disabled={loading}
                  className="px-4 py-2 text-blue-600 hover:text-blue-800 font-medium flex items-center"
                >
                  {loading ? (
                    <svg className="animate-spin h-5 w-5 mr-2 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                  ) : null}
                  Refresh
                </button>
              </div>
              
              {loading ? (
                <div className="flex justify-center items-center h-40">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
                </div>
              ) : users.length === 0 ? (
                <div className="text-center py-12">
                  <div className="text-gray-400 mb-4">No users found</div>
                  <p className="text-gray-600">Add a new user using the form on the left</p>
                </div>
              ) : (
                <div className="bg-gray-50 rounded-lg border border-gray-200 max-h-[400px] overflow-y-auto">
                  {users.map(user => (
                    <div key={user.id} className="p-4 border-b border-gray-200 last:border-b-0 flex items-center hover:bg-white transition-colors">
                      <div className="bg-gray-200 border-2 border-dashed rounded-xl w-12 h-12 mr-4 flex-shrink-0" />
                      <div className="min-w-0">
                        <h3 className="font-medium text-gray-900 truncate">{user.name}</h3>
                        <p className="text-gray-600 truncate">{user.email}</p>
                        <div className="mt-1 text-xs text-gray-500">
                          ID: {user.id} • Joined: {new Date(user.created_at).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Deployment Guide</h2>
          
          <div className="space-y-6">
            <div>
              <h3 className="text-xl font-semibold text-gray-700 mb-2">1. Create SQLPub Database</h3>
              <p className="text-gray-600 mb-3">Sign up for SQLPub and create a MySQL 8.4 database:</p>
              <ol className="list-decimal pl-5 space-y-2 text-gray-600 mb-4">
                <li>Go to <a href="https://sqlpub.com" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">sqlpub.com</a></li>
                <li>Create a new MySQL 8.4 instance</li>
                <li>Note your database credentials:
                  <ul className="list-disc pl-5 mt-2">
                    <li>Host</li>
                    <li>Port</li>
                    <li>Database name</li>
                    <li>Username</li>
                    <li>Password</li>
                  </ul>
                </li>
              </ol>
            </div>
            
            <div>
              <h3 className="text-xl font-semibold text-gray-700 mb-2">2. Deploy to Vercel</h3>
              <p className="text-gray-600 mb-3">Click the deploy button below and set your SQLPub credentials as environment variables:</p>
              
              <a 
                href="https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fvercel%2Fnext.js%2Ftree%2Fcanary%2Fexamples%2Fhello-world&env=DB_HOST,DB_PORT,DB_USER,DB_PASSWORD,DB_NAME&envDescription=Your%20SQLPub%20MySQL%20credentials&project-name=sqlpub-vercel-demo&repository-name=sqlpub-vercel-demo" 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-block bg-black text-white px-6 py-3 rounded-lg font-medium hover:bg-gray-800 transition-colors"
              >
                <img src="https://vercel.com/button" alt="Deploy with Vercel" />
              </a>
              
              <p className="mt-4 text-gray-600">Required environment variables:</p>
              <div className="bg-gray-800 text-gray-100 p-4 rounded-lg font-mono text-sm mt-2">
                DB_HOST=your-sqlpub-host<br />
                DB_PORT=3306<br />
                DB_USER=your-db-username<br />
                DB_PASSWORD=your-db-password<br />
                DB_NAME=your-db-name
              </div>
            </div>
            
            <div>
              <h3 className="text-xl font-semibold text-gray-700 mb-2">3. Initialize Database</h3>
              <p className="text-gray-600 mb-3">After deployment, visit your app URL to automatically initialize the database.</p>
            </div>
          </div>
        </div>
        
        <footer className="mt-16 text-center text-gray-500 text-sm">
          <p>Built with Next.js, Vercel, and SQLPub MySQL 8.4</p>
        </footer>
      </div>
    </div>
  );
}