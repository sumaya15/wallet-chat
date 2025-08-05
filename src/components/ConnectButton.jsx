import { useAccount, useConnect, useDisconnect } from 'wagmi'
import { injected } from 'wagmi/connectors'
import { useEffect, useState } from 'react'
import ChatInterface from './ChatInterface'

export function ConnectButton() {
  const [errorMessage, setErrorMessage] = useState('')
  const [isEdge, setIsEdge] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const { connect } = useConnect({
    connector: injected(),
    onError: (error) => {
      setErrorMessage(error.message)
    }
  })
  const { disconnect } = useDisconnect()
  const { address, isConnected } = useAccount()

  // Edge detection + connection sync
  useEffect(() => {
    setIsEdge(/Edg\/\d+/i.test(navigator.userAgent))
    
    if (window.ethereum?.selectedAddress && !isConnected) {
      console.log('Force-syncing with MetaMask...')
      connect()
    }
  }, [isConnected, connect])

  const handleConnect = async () => {
    setErrorMessage('')
    setIsLoading(true)
    try {
      await connect()
      
      if (isEdge && !isConnected) {
        setTimeout(async () => {
          const accounts = await window.ethereum.request({
            method: 'eth_requestAccounts'
          })
          if (accounts.length > 0) connect()
        }, 1500)
      }
    } catch (error) {
      setErrorMessage(
        error.message.includes('user rejected') 
          ? 'You cancelled the connection' 
          : 'Please check MetaMask extension'
      )
    } finally {
      setIsLoading(false)
    }
  }

  // Secure address display
  const truncateAddress = (addr) => {
    if (!addr) return ''
    return `${addr.substring(0, 6)}...${addr.substring(addr.length - 4)}`
  }

  return (
  <div style={{ 
    maxWidth: '400px', 
    margin: '0 auto',
    padding: '20px',
    fontFamily: 'Arial, sans-serif'
  }}>
    {isConnected ? (
      <div>
        {/* Wallet Connection Info */}
        <div style={{ textAlign: 'center' }}>
          <div style={{ 
            marginBottom: '20px',
            padding: '15px',
            background: '#F3F4F6',
            borderRadius: '8px'
          }}>
            <p style={{ 
              fontSize: '18px',
              fontWeight: 'bold',
              marginBottom: '8px',
              color: '#111827'
            }}>
              🔗 Connected Wallet
            </p>
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              flexWrap: 'wrap'
            }}>
              <p style={{ 
                fontSize: '14px',
                color: '#4B5563',
                marginRight: '8px',
                marginBottom: '4px'
              }}>
                {truncateAddress(address)}
              </p>
              <button 
                onClick={() => {
                  navigator.clipboard.writeText(address)
                  alert('Address copied to clipboard!')
                }}
                style={{
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  color: '#3B82F6',
                  fontSize: '14px',
                  display: 'flex',
                  alignItems: 'center',
                  padding: '4px 8px'
                }}
              >
                <span style={{ marginRight: '4px' }}>📋</span>
                Copy
              </button>
            </div>
          </div>

          <button 
            onClick={disconnect}
            style={{
              padding: '12px 24px',
              background: '#EF4444',
              color: 'white',
              borderRadius: '8px',
              border: 'none',
              cursor: 'pointer',
              fontSize: '16px',
              fontWeight: 'bold',
              width: '100%',
              transition: 'background 0.2s',
              ':hover': {
                background: '#DC2626'
              }
            }}
          >
            Disconnect Wallet
          </button>
        </div>

        {/* Chat Interface - Added Here */}
        <div style={{   marginTop: '30px', 
          border: '1px solid #e2e8f0',
          borderRadius: '12px',
          padding: '16px' }}>
          <ChatInterface isConnected={isConnected} />
        </div>
      </div>
    ) : (
      <div>
        <button
          onClick={handleConnect}
          disabled={isLoading}
          style={{
            padding: '12px 24px',
            background: isLoading ? '#9CA3AF' : 
                      errorMessage ? '#EF4444' : '#3B82F6',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            cursor: isLoading ? 'wait' : 'pointer',
            width: '100%',
            fontSize: '16px',
            fontWeight: 'bold',
            transition: 'background 0.2s'
          }}
        >
          {isLoading ? 'Connecting...' : 
          errorMessage ? 'Retry Connection' : 'Connect Wallet'}
        </button>
        
        {errorMessage && (
          <div style={{
            marginTop: '16px',
            padding: '12px',
            background: '#FEE2E2',
            borderRadius: '6px',
            color: '#B91C1C',
            fontSize: '14px'
          }}>
            <p style={{ margin: 0 }}>⚠️ {errorMessage}</p>
            {isEdge && (
              <p style={{ 
                margin: '8px 0 0 0',
                fontSize: '12px'
              }}>
                <strong>Edge Users:</strong> Ensure MetaMask is pinned (🧩 icon)
              </p>
            )}
          </div>
        )}
      </div>
    )}
  </div>
)
}