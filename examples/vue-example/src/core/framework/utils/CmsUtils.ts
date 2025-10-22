const BASE62 = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';

export default class CmsUtils {
  static getContentByType(type: string) {
    switch (type) {
      case 'VIDEO':
        return '视频';
      case 'ARTICLE':
        return '文章';
      case 'MUSIC':
        return '音乐';
      case 'AUDIO':
        return '音频';
      case 'IMAGE':
        return '图片';
      case 'IMAGE_SET':
        return '图集';
      case 'NEWS':
        return '新闻';
      case 'FILE':
      case 'FILE_SET':
      case 'DISK_FILE':
        return '文件';
      case 'PRODUCT':
        return '商品';
      case 'COMMUNITY':
        return '社群';
      case 'COUPON':
        return '优惠券';
      case 'VOTE':
        return '投票';
      case 'SHARE':
        return '分享';
      case 'COLLECTION':
        return '合集';
      default:
        break;
    }
    return '-';
  }

  static contentTypeText(type: string) {
    return CmsUtils.getContentByType(type);
  }

  static statusText(status: string) {
    switch (status) {
      case 'ACTIVE':
        return '已发布';
      case 'INACTIVE':
        return '已下线';
      case 'PROCESSING':
        return '处理中';
      case 'WAIT_AUDIT':
        return '审核中';
      case 'INIT':
        return '审核中';
      case 'REJECTED':
        return '审核未通过';
      case 'CLOSED':
        return '已关闭';
      default:
        break;
    }
    return '-';
  }

  static open(item: any, _target?: string) {
    let url = '';
    if (!item.contentType) {
      item.contentType = 'ARTICLE';
    }
    switch (item.contentType) {
      case 'VIDEO':
        url = `/${item.contentType.toLowerCase()}/detail`;
        break;
      case 'ARTICLE':
        url = `/${item.contentType.toLowerCase()}/detail`;
        break;
      case 'NEWS':
        url = `/${item.contentType.toLowerCase()}/detail`;
        break;
      case 'AUDIO':
        url = `/${item.contentType.toLowerCase()}/detail`;
        break;
      case 'IMAGE':
        url = `/${item.contentType.toLowerCase()}/detail`;
        break;
      case 'IMAGE_SET':
        url = `/${item.contentType.toLowerCase()}/detail`;
        break;

      default:
        url = `/${item.contentType.toLowerCase()}/detail`;
        break;
    }
    if (_target && _target.toLowerCase().indexOf('blank') >= 0) {
      url = `${url}?id=${item.id}`;
      window.open(url, _target);
    } else {
      // @ts-ignore
      window.$router.push({ path: url, query: { id: item.id } });
    }
  }

  static getCoverUrl(item: any) {
    let coverUrl = item.coverUrl;
    if (coverUrl && typeof coverUrl === 'object' && Object.keys(coverUrl).length <= 0) {
      return '';
    }
    if (!coverUrl && item.imageUrls && item.imageUrls.length > 0) {
      coverUrl = item.imageUrls[0];
    }
    if (!coverUrl && item.coverUrls && item.coverUrls.length > 0) {
      coverUrl = item.coverUrls[0];
    }
    if (!coverUrl && item.posterUrl) {
      coverUrl = item.posterUrl;
    }
    return coverUrl;
  }

  static fileToPublishItem(file: any) {
    // @ts-ignore
    const { $fileUtils } = window.$framework;
    const result = {
      id: file.id,
      title: file.name,
      feedsId: undefined,
      contentType: 'DISK_FILE',
      contentId: file.id,
      coverUrl: $fileUtils.getIconUrl(file),
      author: file.author,
      sourceUrl: file.sourceUrl || file.webUrl,
      digest: undefined,
      content: undefined,
      playUrl: undefined,
      url: undefined
    };
    return result;
  }

  // eslint-disable-next-line complexity
  static buildPublishItem(feeds: any) {
    const result = {
      id: feeds.id,
      title: feeds.title,
      feedsId: feeds.id,
      contentType: feeds.contentType,
      contentId: feeds.contentId,
      coverUrl: undefined,
      author: feeds.author,
      sourceUrl: feeds.sourceUrl || feeds.webUrl,
      digest: undefined,
      content: undefined,
      playUrl: undefined,
      url: undefined
    };
    const article = feeds.article || {};
    const video = feeds.video || {};
    const audio = feeds.audio || {};
    const image = feeds.image || {};
    const music = feeds.music || {};
    switch (feeds.contentType) {
      case 'NEWS':
      case 'ARTICLE':
        result.coverUrl = CmsUtils.getCoverUrl(article);
        result.digest = feeds.summary || article.summary;
        result.content = article.content || feeds.content;
        result.sourceUrl = result.sourceUrl || article.webUrl;
        result.title = article.title || feeds.title;
        break;
      case 'VIDEO':
        result.coverUrl = CmsUtils.getCoverUrl(video);
        result.digest = feeds.summary || video.summary;
        result.content = video.content || feeds.content;
        result.sourceUrl = result.sourceUrl || video.webUrl;
        result.playUrl = result.sourceUrl || video.playUrl;
        break;
      case 'AUDIO':
        result.coverUrl = CmsUtils.getCoverUrl(audio);
        result.digest = feeds.summary || audio.summary;
        result.content = audio.content || feeds.content;
        result.sourceUrl = result.sourceUrl || audio.webUrl;
        result.playUrl = result.sourceUrl || audio.playUrl;
        break;
      case 'IMAGE':
        result.coverUrl = image.url;
        result.digest = feeds.description || image.description;
        result.content = image.content || feeds.content;
        result.sourceUrl = result.sourceUrl || image.webUrl;
        result.url = result.sourceUrl || image.url;
        break;
      case 'MUSIC':
        result.coverUrl = CmsUtils.getCoverUrl(music);
        result.digest = feeds.summary || music.summary;
        result.content = music.content || feeds.content;
        result.sourceUrl = result.sourceUrl || music.webUrl;
        result.playUrl = result.sourceUrl || music.playUrl;
        break;
      default:
        break;
    }
    return result;
  }

  static buildCommonPublishItem(item: any) {
    const result = {
      id: item.id,
      title: item.title || item.name,
      contentType: '',
      contentId: item.id,
      coverUrl: undefined,
      author: item.author || item.nickname,
      sourceUrl: item.sourceUrl || item.webUrl,
      digest: undefined,
      content: undefined,
      playUrl: undefined,
      url: undefined
    };
    result.coverUrl = CmsUtils.getCoverUrl(item);
    result.digest = item.summary || item.summary;
    result.content = item.content || item.description;
    result.sourceUrl = item.sourceUrl;
    return result;
  }

  static buildFilePublishItem(item: any) {
    // @ts-ignore
    const { $fileUtils } = window.$framework;
    const result = CmsUtils.buildCommonPublishItem(item);
    result.contentType = 'DISK_FILE';
    if (!result.coverUrl) {
      result.coverUrl = $fileUtils.getIconUrl(item);
    }

    return result;
  }

  static buildCommunityPublishItem(item: any) {
    const result = CmsUtils.buildCommonPublishItem(item);
    result.contentType = 'COMMUNITY';
    return result;
  }

  static buildActivityPublishItem(item: any) {
    const result = CmsUtils.buildCommonPublishItem(item);
    result.contentType = 'ACTIVITY';
    return result;
  }

  static buildSharePublishItem(item: any) {
    const result = CmsUtils.buildCommonPublishItem(item);
    result.contentType = 'SHARE';
    return result;
  }

  static buildCouponPublishItem(item: any) {
    const result = CmsUtils.buildCommonPublishItem(item);
    result.contentType = 'COUPON';
    return result;
  }

  static buildProductPublishItem(item: any) {
    const result = CmsUtils.buildCommonPublishItem(item);
    result.contentType = 'PRODUCT';
    return result;
  }

  static buildCollectionPublishItem(item: any) {
    const result = CmsUtils.buildCommonPublishItem(item);
    result.contentType = 'COLLECTION';
    return result;
  }

  static buildVotePublishItem(item: any) {
    const result = CmsUtils.buildCommonPublishItem(item);
    result.contentType = 'VOTE';
    return result;
  }

  static encodeBase62(num: number): string {
    if (num === 0) return BASE62[0];
    let result = '';
    while (num > 0) {
      result = BASE62[num % 62] + result;
      num = Math.floor(num / 62);
    }
    return result;
  }

  static decodeBase62(str: string): number {
    let result = 0;
    for (let i = 0; i < str.length; i += 1) {
      const power = str.length - (i + 1);
      const index = BASE62.indexOf(str[i]);
      result += index * 62 ** power;
    }
    return result;
  }

  static getPlatformOptions() {
    const options = [
      {
        value: 'H5_WEIXIN',
        label: '微信公众号'
      },
      {
        value: 'MP_WEIXIN',
        label: '微信小程序'
      },
      {
        value: 'MP_DOUYIN',
        label: '抖音小程序'
      },
      {
        value: 'MP_BAIDU',
        label: '百度小程序'
      }
    ];
    return options;
  }

  static getPlatformName(platform: any) {
    const options = CmsUtils.getPlatformOptions();
    const platformOption = options.find(item => {
      return platform === item.value;
    });
    return platformOption?.label || '-';
  }

  static getPlayUrl(item: any) {
    const url = item.playUrl;
    // @ts-ignore
    const { $urlUtils } = window.$framework;
    return $urlUtils.toFullUrl(url, 'https');
  }

  /**
   * 将视频时长（以秒为单位）转换为格式为“时:分:秒”的字符串。
   * @param durationInSeconds 视频时长（以秒为单位）
   * @returns 格式化后的时长字符串
   */
  static durationText(durationInSeconds: number): string {
    if (!durationInSeconds) {
      return '';
    }
    if (durationInSeconds < 60) {
      return `${durationInSeconds} s`;
    }
    const hours = Math.floor(durationInSeconds / 3600);
    const minutes = Math.floor((durationInSeconds % 3600) / 60);
    const seconds = durationInSeconds % 60;

    // 使用 padStart() 方法确保时、分、秒都是两位数
    const formattedHours = hours.toString().padStart(2, '0');
    const formattedMinutes = minutes.toString().padStart(2, '0');
    const formattedSeconds = seconds.toString().padStart(2, '0');

    // 构建格式化的字符串
    let formattedDuration = `${formattedHours}:${formattedMinutes}:${formattedSeconds}`;

    // 如果小时为零，只显示分钟和秒数
    if (hours === 0) {
      formattedDuration = `${formattedMinutes}:${formattedSeconds}`;
    }

    // 如果分钟为零，只显示秒数
    if (minutes === 0) {
      formattedDuration = `${formattedSeconds}`;
    }

    return formattedDuration;
  }
}
