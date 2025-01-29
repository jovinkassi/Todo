'use client';
import { useState } from 'react';
import { ethers } from 'ethers';

interface AuthenticationProps {
  setLoggedIn: (loggedIn: boolean) => void;
  setUserId: (userId: string) => void;
}

export default function Authentication({ setLoggedIn, setUserId }: AuthenticationProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  async function handleEmailLogin() {
    setIsLoading(true);
    try {
      const response = await fetch('/api/auth/email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();
      if (response.ok && data.token) {
        console.log('User ID:', data.userId);
        setLoggedIn(true);
        setUserId(data.userId); // Assuming the response includes the user ID
        alert('Logged in successfully!');
      } else {
        alert(data.error || 'Login failed');
      }
    } catch (error) {
      console.error('Error during email login:', error);
      alert('An error occurred during login.');
    } finally {
      setIsLoading(false);
    }
  }

  async function handleWeb3Login() {
    if (!window.ethereum) {
      alert('MetaMask is not installed');
      return;
    }

    setIsLoading(true);
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const address = await signer.getAddress();
      const message = `Sign this message to log in.`;

      const signature = await signer.signMessage(message);

      const response = await fetch('/api/auth/web3', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ address, signature, message }),
      });

      const data = await response.json();
      if (response.ok && data.user) {
        setLoggedIn(true);
        setUserId(data.user.id); // Assuming the response includes the user ID
        alert('Logged in with wallet successfully!');
      } else {
        alert(data.error || 'Login failed');
      }
    } catch (error) {
      console.error('Error during Web3 login:', error);
      alert('An error occurred during Web3 login.');
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">Login</h1>
      <div>
        <h2 className="text-lg mb-2">Email Login</h2>
        <input
          type="email"
          placeholder="Email"
          className="border p-2 mb-2"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          className="border p-2 mb-2"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button
          onClick={handleEmailLogin}
          className="bg-blue-500 text-white px-4 py-2 rounded"
          disabled={isLoading}
        >
          {isLoading ? 'Logging in...' : 'Login'}
        </button>
      </div>
      <div className="mt-4">
        <h2 className="text-lg mb-2">Web3 Wallet Login</h2>
        <button
          onClick={handleWeb3Login}
          className="bg-green-500 text-white px-4 py-2 rounded"
          disabled={isLoading}
        >
          {isLoading ? 'Logging in...' : 'Login with Wallet'}
        </button>
      </div>
    </div>
  );
}
