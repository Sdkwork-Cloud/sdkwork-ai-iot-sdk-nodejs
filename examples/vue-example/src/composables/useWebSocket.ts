import { ref, onUnmounted } from 'vue'

interface WebSocketOptions {
  url: string
  onMessage?: (data: any) => void
  onOpen?: () => void
  onClose?: () => void
  onError?: (error: Event) => void
  autoReconnect?: boolean
  reconnectInterval?: number
}

export function useWebSocket(options: WebSocketOptions) {
  const ws = ref<WebSocket | null>(null)
  const isConnected = ref(false)
  const reconnectTimer = ref<number | null>(null)
  
  const connect = () => {
    try {
      ws.value = new WebSocket(options.url)
      
      ws.value.onopen = () => {
        isConnected.value = true
        options.onOpen?.()
        console.log('WebSocket connected')
      }
      
      ws.value.onmessage = (event) => {
        try {
          const message = JSON.parse(event.data)
          options.onMessage?.(message)
        } catch (error) {
          console.error('WebSocket message parse error:', error)
        }
      }
      
      ws.value.onclose = () => {
        isConnected.value = false
        options.onClose?.()
        console.log('WebSocket disconnected')
        
        // 自动重连
        if (options.autoReconnect) {
          reconnectTimer.value = window.setTimeout(() => {
            connect()
          }, options.reconnectInterval || 3000)
        }
      }
      
      ws.value.onerror = (error) => {
        options.onError?.(error)
        console.error('WebSocket error:', error)
      }
    } catch (error) {
      console.error('WebSocket connect error:', error)
    }
  }
  
  const send = (data: any) => {
    if (ws.value && isConnected.value) {
      ws.value.send(JSON.stringify(data))
    } else {
      console.warn('WebSocket not connected')
    }
  }
  
  const disconnect = () => {
    if (reconnectTimer.value) {
      window.clearTimeout(reconnectTimer.value)
      reconnectTimer.value = null
    }
    
    if (ws.value) {
      ws.value.close()
      ws.value = null
    }
    
    isConnected.value = false
  }
  
  onUnmounted(() => {
    disconnect()
  })
  
  return {
    ws,
    isConnected,
    connect,
    send,
    disconnect
  }
}