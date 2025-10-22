import DateUtils from '@/core/framework/utils/DateUtils';

export default class ShareUtils {
  /**
   *
   * @param share
   *
   * PERMANENT(1,"永久有效"),
   * DAY_1(2,"1天"),
   * DAY_7(3,"7天"),
   * WEEK_CURRENT(4,"本周有效"),
   * MONTH_CURRENT(5,"本月有效"),
   * SEASON_CURRENT(6,"本季度有效"),
   * YEAR_CURRENT(7,"本年有效");
   * @returns
   */
  static statusText(share: any): string { 
    if (share.expiresType === 'PERMANENT') {
      return '永久有效';
    }
    if (share.status === 'INACTIVE') {
      return '已取消';
    }
    if (share.status !== 'ACTIVE') {
      return '已取消';
    }
    let text = '-';
    if (!share.expires) {
      share.expires = ShareUtils.getExpires(share.createdTime, share.expiresType);
    }
    if (!share.expires) {
      return text;
    }
    const now = new Date();
    const expiresAtTime = DateUtils.addSeconds(share.createdTime, share.expires);
    const diff = DateUtils.diff(now, expiresAtTime, 'day');
    if (diff < 0) {
      return '已失效';
    } else {
      text = diff + '天后过期';
    }

    return text;
  }
  static endOfTime(createdTime: any, expiresType: any): Date | undefined {
    switch (expiresType) {
      case 'DAY_1':
        return DateUtils.addDays(createdTime, 1);
      case 'DAY_7':
        return DateUtils.addDays(createdTime, 7);
      case 'WEEK_CURRENT':
        return DateUtils.endOf(createdTime, 'week');
      case 'MONTH_CURRENT':
        return DateUtils.endOf(createdTime, 'month');
      case 'SEASON_CURRENT':
        return DateUtils.endOfQuarter(createdTime, 'day');
      case 'YEAR_CURRENT':
        return DateUtils.endOf(createdTime, 'year');
    }
  }
  static getExpires(createdTime: any, expiresType: any) {
    const endTime = ShareUtils.endOfTime(createdTime, expiresType);
    if (!endTime) {
      return;
    }
    const diff = DateUtils.diff(createdTime, endTime, 'seconds');
    return diff;
  }
}
