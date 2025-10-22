# SDKWork Video Player Component

A powerful, responsive video player built with Vue 3 and video.js that supports multiple display modes and advanced features.

## Features

- Multiple display modes (Card, Fullscreen, Mini, Theater)
- Responsive design
- Customizable control bar with auto-hide
- Cover/poster image support
- Buffering indicators
- Comprehensive API and events

## Installation

1. Install dependencies:
```bash
npm install video.js @videojs/http-streaming
```

2. Import component:
```js
import SdkworkVideoPlayer from '@/components/sdkwork-video-player/sdkwork-video-player.vue'
```

## Usage

```vue
<sdkwork-video-player
  src="video.mp4"
  poster="poster.jpg"
  :autoplay="false"
  mode="card"
/>
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| src | String | - | Video source URL |
| poster | String | - | Cover/poster image URL |
| mode | String | 'card' | Display mode (card/fullscreen/mini/theater) |
| autoplay | Boolean | false | Auto-play video |
| muted | Boolean | false | Start muted |
| loop | Boolean | false | Loop playback |

## Events

- `play` - Video started playing
- `pause` - Video paused
- `ended` - Video playback ended
- `error` - Playback error occurred

## Methods

- `play()` - Start playback
- `pause()` - Pause playback
- `toggleFullscreen()` - Toggle fullscreen mode
- `seekTo(time)` - Seek to specific time

## Demo

See `pages/video-player-demo.vue` for usage examples.