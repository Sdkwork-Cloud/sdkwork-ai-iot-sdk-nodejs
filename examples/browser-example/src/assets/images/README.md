# 图片资源目录

此目录用于存放项目所需的图片资源。

## 图片文件说明

- `device-sample.jpg` - 设备示例图片
- `default-avatar.png` - 默认用户头像
- `device-1.jpg` - 设备1展示图片
- `device-2.jpg` - 设备2展示图片  
- `device-3.jpg` - 设备3展示图片

## 图片规范

- 格式：JPG/PNG
- 尺寸：适配移动端显示
- 大小：建议不超过500KB
- 命名：使用英文小写和连字符

## 使用方式

在HTML中引用图片：

```html
<img src="./assets/images/device-sample.jpg" alt="设备示例">
```

在CSS中引用图片：

```css
.background {
    background-image: url('./assets/images/background.jpg');
}