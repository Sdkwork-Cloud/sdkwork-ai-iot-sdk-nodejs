import React, { useState, useEffect, useCallback } from 'react';
import { AIoTClient, DeviceInfo, SensorData, IoTEvent } from '../../../src';
import './App.css';

const App: React.FC = () => {
  const [aiotClient, setAiotClient] = useState<AIoTClient | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [devices, setDevices] = useState<DeviceInfo[]>([]);
  const [sensorData, setSensorData] = useState<SensorData[]>([]);
  const [events, setEvents] = useState<IoTEvent[]>([]);

  // 初始化AIoT客户端
  useEffect(() => {
    const client = new AIoTClient({
      apiKey: 'demo-api-key-react',
      debug: true
    });

    // 注册事件监听器
    client.on('command_completed', handleCommandCompleted);
    client.on('device_online', handleDeviceOnline);
    client.on('device_offline', handleDeviceOffline);

    // 订阅数据回调
    client.subscribeToDevice('device-001', handleSensorData);

    // 错误处理
    client.onError(handleError);

    // 启动模拟数据
    client.startMockData();

    setAiotClient(client);

    return () => {
      client.disconnect();
    };
  }, []);

  const handleSensorData = useCallback((data: SensorData) => {
    setSensorData(prev => [data, ...prev.slice(0, 9)]);
  }, []);

  const handleCommandCompleted = useCallback((event: IoTEvent) => {
    setEvents(prev => [event, ...prev.slice(0, 19)]);
  }, []);

  const handleDeviceOnline = useCallback((event: IoTEvent) => {
    setEvents(prev => [event, ...prev.slice(0, 19)]);
  }, []);

  const handleDeviceOffline = useCallback((event: IoTEvent) => {
    setEvents(prev => [event, ...prev.slice(0, 19)]);
  }, []);

  const handleError = useCallback((error: Error) => {
    console.error('AIoT SDK错误:', error);
    setEvents(prev => [
      {
        type: 'error',
        deviceId: 'system',
        data: { message: error.message },
        timestamp: new Date()
      },
      ...prev.slice(0, 19)
    ]);
  }, []);

  const toggleConnection = async () => {
    try {
      if (isConnected) {
        await aiotClient?.disconnect();
        setIsConnected(false);
      } else {
        await aiotClient?.connect();
        setIsConnected(true);
      }
    } catch (error) {
      console.error('连接操作失败:', error);
    }
  };

  const fetchDevices = async () => {
    try {
      if (aiotClient) {
        const deviceList = await aiotClient.getDevices();
        setDevices(deviceList);
      }
    } catch (error) {
      console.error('获取设备失败:', error);
    }
  };

  const sendControlCommand = async (deviceId: string) => {
    try {
      if (aiotClient) {
        await aiotClient.sendCommand({
          deviceId,
          command: 'toggle',
          parameters: { state: 'on' },
          timestamp: new Date()
        });
      }
    } catch (error) {
      console.error('发送命令失败:', error);
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('zh-CN');
  };

  return (
    <div className="app">
      <div className="container">
        <h1>React AIoT SDK 示例</h1>
        
        <div className="status">
          <p className={isConnected ? 'connected' : 'disconnected'}>
            连接状态: {isConnected ? '已连接' : '未连接'}
          </p>
          <button onClick={toggleConnection}>
            {isConnected ? '断开连接' : '连接'}
          </button>
        </div>

        <div className="devices-section">
          <h2>设备列表</h2>
          <button onClick={fetchDevices}>获取设备</button>
          
          {devices.length > 0 ? (
            <div className="devices-list">
              {devices.map(device => (
                <div key={device.id} className="device-card">
                  <h3>{device.name}</h3>
                  <p>设备ID: {device.id}</p>
                  <p>类型: {device.type}</p>
                  <p>状态: {device.status.online ? '在线' : '离线'}</p>
                  <p>电量: {device.status.batteryLevel}%</p>
                  
                  {device.type === 'controller' && (
                    <button 
                      onClick={() => sendControlCommand(device.id)}
                      disabled={!device.status.online}
                    >
                      发送控制命令
                    </button>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <p>暂无设备数据</p>
          )}
        </div>

        <div className="data-section">
          <h2>实时数据</h2>
          {sensorData.length > 0 ? (
            sensorData.map((data, index) => (
              <div key={index} className="data-item">
                <p>时间: {formatTime(data.timestamp)}</p>
                <p>数值: {data.value} {data.unit}</p>
                <p>类型: {data.sensorType}</p>
              </div>
            ))
          ) : (
            <p>等待传感器数据...</p>
          )}
        </div>

        <div className="events-section">
          <h2>事件日志</h2>
          <div className="events-list">
            {events.map((event, index) => (
              <div key={index} className="event-item">
                <p>[{formatTime(event.timestamp)}] {event.type} - {event.deviceId}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;