import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, Button, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { AIoTClient, DeviceInfo, SensorData, IoTEvent } from '../../src';

const App: React.FC = () => {
  const [aiotClient, setAiotClient] = useState<AIoTClient | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [devices, setDevices] = useState<DeviceInfo[]>([]);
  const [sensorData, setSensorData] = useState<SensorData[]>([]);
  const [events, setEvents] = useState<IoTEvent[]>([]);

  // 初始化AIoT客户端
  useEffect(() => {
    const client = new AIoTClient({
      apiKey: 'demo-api-key-react-native',
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
    setSensorData(prev => [data, ...prev.slice(0, 4)]);
  }, []);

  const handleCommandCompleted = useCallback((event: IoTEvent) => {
    setEvents(prev => [event, ...prev.slice(0, 9)]);
  }, []);

  const handleDeviceOnline = useCallback((event: IoTEvent) => {
    setEvents(prev => [event, ...prev.slice(0, 9)]);
  }, []);

  const handleDeviceOffline = useCallback((event: IoTEvent) => {
    setEvents(prev => [event, ...prev.slice(0, 9)]);
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
      ...prev.slice(0, 9)
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
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>React Native AIoT SDK 示例</Text>
      </View>

      <View style={styles.section}>
        <Text style={isConnected ? styles.connected : styles.disconnected}>
          连接状态: {isConnected ? '已连接' : '未连接'}
        </Text>
        <Button
          title={isConnected ? '断开连接' : '连接'}
          onPress={toggleConnection}
          color="#007AFF"
        />
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>设备列表</Text>
        <Button title="获取设备" onPress={fetchDevices} color="#007AFF" />
        
        {devices.length > 0 ? (
          devices.map(device => (
            <View key={device.id} style={styles.deviceCard}>
              <Text style={styles.deviceName}>{device.name}</Text>
              <Text>设备ID: {device.id}</Text>
              <Text>类型: {device.type}</Text>
              <Text>状态: {device.status.online ? '在线' : '离线'}</Text>
              <Text>电量: {device.status.batteryLevel}%</Text>
              
              {device.type === 'controller' && (
                <TouchableOpacity
                  style={[styles.button, !device.status.online && styles.buttonDisabled]}
                  onPress={() => sendControlCommand(device.id)}
                  disabled={!device.status.online}
                >
                  <Text style={styles.buttonText}>发送控制命令</Text>
                </TouchableOpacity>
              )}
            </View>
          ))
        ) : (
          <Text>暂无设备数据</Text>
        )}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>实时数据</Text>
        {sensorData.length > 0 ? (
          sensorData.map((data, index) => (
            <View key={index} style={styles.dataItem}>
              <Text>时间: {formatTime(data.timestamp)}</Text>
              <Text>数值: {data.value} {data.unit}</Text>
              <Text>类型: {data.sensorType}</Text>
            </View>
          ))
        ) : (
          <Text>等待传感器数据...</Text>
        )}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>事件日志</Text>
        {events.map((event, index) => (
          <View key={index} style={styles.eventItem}>
            <Text>[{formatTime(event.timestamp)}] {event.type} - {event.deviceId}</Text>
          </View>
        ))}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 16,
  },
  header: {
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  section: {
    marginBottom: 20,
    padding: 16,
    backgroundColor: 'white',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  connected: {
    color: 'green',
    marginBottom: 10,
  },
  disconnected: {
    color: 'red',
    marginBottom: 10,
  },
  deviceCard: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 12,
    marginBottom: 10,
    borderRadius: 6,
  },
  deviceName: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  dataItem: {
    padding: 8,
    marginBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  eventItem: {
    padding: 8,
    marginBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  button: {
    backgroundColor: '#007AFF',
    padding: 10,
    borderRadius: 6,
    marginTop: 10,
  },
  buttonDisabled: {
    backgroundColor: '#6c757d',
  },
  buttonText: {
    color: 'white',
    textAlign: 'center',
    fontWeight: 'bold',
  },
});

export default App;