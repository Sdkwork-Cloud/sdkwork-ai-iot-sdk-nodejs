import type { ManipulateType, OpUnitType, QUnitType } from "dayjs";
import dayjs from "dayjs";
import duration from "dayjs/plugin/duration";
import quarterOfYear from "dayjs/plugin/quarterOfYear";
import weekday from "dayjs/plugin/weekday";
import localeData from "dayjs/plugin/localeData";
dayjs.extend(quarterOfYear);
dayjs.extend(duration);
dayjs.extend(weekday);
dayjs.extend(localeData);
import "dayjs/locale/zh-cn";
const CN_WEEK_DAYS = ["周日", "周一", "周二", "周三", "周四", "周五", "周六"];
export default class DateUtils {
  static getDaysOfMonth(year: number, month: number): number {
    const d = new Date(year, month, 0);
    return d.getDate();
  }
  static getFirstDayOfMonth(year: number, month: number): Date {
    // month 是 0-11 范围内的数值（0 代表 1 月，11 代表 12 月）
    return new Date(year, month, 1);
  }
  static getDayOfWeek(year: number, month: number, day: number): number {
    // 创建指定日期的 Date 对象
    const date = new Date(year, month, day);

    // 返回星期几（0 表示周日，1 表示周一，以此类推）
    return date.getDay();
  }

  static daysInMonth(date: Date | string): number {
    return dayjs(date).daysInMonth();
  }

  static addDays(date: Date | string, days: number): Date {
    return dayjs(date).add(days, "days").toDate();
  }

  static addSeconds(date: Date | string, seconds: number): Date {
    return dayjs(date).add(seconds, "seconds").toDate();
  }

  static addMinutes(date: Date | string, minutes: number): Date {
    return dayjs(date).add(minutes, "minutes").toDate();
  }

  static addHours(date: Date | string, hours: number): Date {
    return dayjs(date).add(hours, "hours").toDate();
  }

  static addYears(date: Date | string, years: number): Date {
    return dayjs(date).add(years, "years").toDate();
  }

  static addWeeks(date: Date | string, weeks: number): Date {
    return dayjs(date).add(weeks, "weeks").toDate();
  }

  static addMonths(date: Date | string, months: number): Date {
    return dayjs(date).add(months, "months").toDate();
  }

  static add(date: Date | string, n: number, unit: ManipulateType): Date {
    return dayjs(date).add(n, unit).toDate();
  }

  static subtract(date: Date | string, n: number, unit: ManipulateType): Date {
    return dayjs(date).subtract(n, unit).toDate();
  }

  static isToday(date: Date): boolean {
    return dayjs().isSame(date, "day");
  }

  static isExpired(date: Date | string, seconds: number): boolean {
    const expiredTime = DateUtils.addSeconds(date, seconds);
    const now = new Date();
    return DateUtils.isBefore(expiredTime, now);
  }

  static isSameMonth(date: Date): boolean {
    return dayjs().isSame(date, "month");
  }

  static isSameWeek(date: Date): boolean {
    return dayjs().isSame(date, "week");
  }

  static diff(
    date1: Date | string,
    date2: Date | string,
    unit: QUnitType | OpUnitType
  ) {
    return dayjs(date2).diff(dayjs(date1), unit);
  }

  static isYesterday(date: Date): boolean {
    const now = new Date();
    const lastDay = DateUtils.addDays(now, -1);
    return (
      lastDay.getFullYear() === date.getFullYear() &&
      lastDay.getMonth() === date.getMonth() &&
      lastDay.getDate() === date.getDate()
    );
  }

  static startOf(date: Date | string, unit: OpUnitType): Date {
    return dayjs(date).startOf(unit).toDate();
  }

  static endOf(date: Date | string, unit: OpUnitType): Date {
    return dayjs(date).endOf(unit).toDate();
  }

  /**
   *
   * year	y	January 1st, 00:00 this year
quarter	Q	beginning of the current quarter, 1st day of months, 00:00 ( dependent QuarterOfYear plugin )
month	M	the first day of this month, 00:00
week	w	the first day of this week, 00:00 (locale aware)
isoWeek		the first day of this week according to ISO 8601, 00:00 ( dependent IsoWeek plugin )
date	D	00:00 today
day	d	00:00 today
hour	h	now, but with 0 mins, 0 secs, and 0 ms
minute	m	now, but with 0 seconds and 0 milliseconds
second	s	now, but with 0 milliseconds
   * @param date
   * @param date
   * @param unit
   * @param
   * @param string
   */
  static isSame(
    date1: Date | string,
    date2: Date | string,
    unit: OpUnitType
  ): boolean {
    return dayjs(date1).isSame(dayjs(date2), unit);
  }

  static isBefore(
    date1: Date | string,
    date2: Date | string,
    unit?: OpUnitType
  ): boolean {
    return dayjs(date1).isBefore(dayjs(date2), unit);
  }

  static isAfter(
    date1: Date | string,
    date2: Date | string,
    unit?: OpUnitType
  ): boolean {
    return dayjs(date1).isAfter(dayjs(date2), unit);
  }

  static format(date: Date|string, format?: string): string {
    if (!format) {
      format = "YYYY-MM-DD HH:mm:ss";
    }
    return dayjs(date).format(format);
  }

  static parse(dateStr: string, format?: string): Date {
    if (format) {
      return dayjs(dateStr, [format], true).toDate();
    }
    return dayjs(
      dateStr,
      [
        "YYYY-MM-DD HH:mm:ss",
        "YYYY-MM-DDTHH:mm:ss",
        "YYYY-MM-DD HH:mm",
        "YYYY-MM-DD",
      ],
      true
    ).toDate();
  }

  static quarter(date: Date | string): number {
    return dayjs(date).quarter();
  }

  static startOfQuarter(date: Date | string, unit: OpUnitType): Date {
    const num = DateUtils.quarter(date);
    return dayjs().quarter(num).startOf(unit).toDate();
  }

  static endOfQuarter(date: Date | string, unit: OpUnitType): Date {
    const num = DateUtils.quarter(date);
    return dayjs().quarter(num).endOf(unit).toDate();
  }

  static getCNWeekDay(date: Date): string {
    const day = date.getDay();
    return CN_WEEK_DAYS[day];
  }

  static toCNDay(day: number): string {
    return CN_WEEK_DAYS[day];
  }

  static getYearsOld(date: Date): number {
    const now = new Date();
    const years = now.getFullYear() - date.getFullYear();
    return years;
  }

  static formatSeconds(s: number): string {
    if (s <= 0) {
      return "0秒";
    }
    const duration = dayjs.duration(s * 1000);
    const years = duration.years();
    const months = duration.months();
    const days = duration.days();
    const hours = duration.hours();
    const minutes =
      duration.minutes() % 60 < 10
        ? `0${duration.minutes() % 60}`
        : duration.minutes() % 60;
    const seconds =
      duration.seconds() % 60 < 10
        ? `0${duration.seconds() % 60}`
        : duration.seconds() % 60;
    const arr = [years, months, days, hours, minutes, seconds];
    const textArr = ["年", "月", "日", "时", "分", "秒"];
    let resultText = "";
    for (let i = 0; i < arr.length; i++) {
      const v = arr[i];
      if (v && v as number > 0) {
        resultText += v + textArr[i];
      }
    }
    return resultText;
  }

  static formatMilliseconds(s: number): string {
    if (s < 1000) {
      return `${s}毫秒`;
    }
    return DateUtils.formatSeconds(s / 1000);
  }

  static contentTimeText(
    dateTimeStamp: number | string | Date,
    format = "YYYY-MM-DD HH:mm"
  ) {
    let date: Date;
    if (typeof dateTimeStamp === "string") {
      date = DateUtils.parse(dateTimeStamp);
    } else if (typeof dateTimeStamp === "number") {
      date = new Date(dateTimeStamp);
    } else {
      date = dateTimeStamp as Date;
    }
    return DateUtils.format(date, format);
  }

  static messageTimeAgoText(dateTimeStamp: number | string) {
    if (typeof dateTimeStamp === "string") {
      const date = DateUtils.parse(dateTimeStamp);
      dateTimeStamp = date.getTime();
    }
    const { t } = window.$i18n;
    const minute = 1000 * 60; // 把分，时，天，周，半个月，一个月用毫秒表示
    const hour = minute * 60;
    const day = hour * 24;
    const week = day * 7;
    const now = new Date().getTime(); // 获取当前时间毫秒
    const diffValue = now - dateTimeStamp; // 时间差
    let result = "";

    if (diffValue < 0) {
      return;
    }
    const minC = diffValue / minute; // 计算时间差的分，时，天，周，月
    const hourC = diffValue / hour;
    const dayC = diffValue / day;
    const weekC = diffValue / week;
    if (weekC >= 1 && weekC <= 4) {
      result = ` ${parseInt(`${weekC}`, 10)} ${t("周")}${t("前")}`;
    } else if (dayC >= 1 && dayC <= 6) {
      result = ` ${parseInt(`${dayC}`, 10)} ${t("天")}${t("前")}`;
    } else if (hourC >= 1 && hourC <= 23) {
      result = ` ${parseInt(`${hourC}`, 10)} ${t("小时")}${t("前")}`;
    } else if (minC >= 1 && minC <= 59) {
      result = ` ${parseInt(`${minC}`, 10)} ${t("分钟")}${t("前")}`;
    } else if (diffValue >= 0 && diffValue <= minute) {
      result = `${t("刚刚")}`;
    } else {
      const datetime = new Date();
      datetime.setTime(dateTimeStamp);
      const Nyear = datetime.getFullYear();
      const Nmonth =
        datetime.getMonth() + 1 < 10
          ? `0${datetime.getMonth() + 1}`
          : datetime.getMonth() + 1;
      const Ndate =
        datetime.getDate() < 10 ? `0${datetime.getDate()}` : datetime.getDate();
      result = `${Nyear}-${Nmonth}-${Ndate}`;
    }
    return result;
  }

  static formatDuration(seconds: number): string {
    // 定义一些常量，表示不同的时间单位
    const MINUTE = 60;
    const HOUR = 60 * MINUTE;
    const DAY = 24 * HOUR;

    // 计算出天，小时，分钟，秒的数量
    const days = Math.floor(seconds / DAY);
    seconds %= DAY;
    const hours = Math.floor(seconds / HOUR);
    seconds %= HOUR;
    const minutes = Math.floor(seconds / MINUTE);
    seconds %= MINUTE;

    // 定义一个数组，用来存放格式化后的字符串
    const parts: string[] = [];

    // 根据不同的时间单位，添加相应的字符串到数组中
    if (days > 0) {
      parts.push(`${days}天`);
    }
    if (hours > 0) {
      parts.push(`${hours}小时`);
    }
    if (minutes > 0) {
      parts.push(`${minutes}分钟`);
    }
    if (seconds > 0) {
      parts.push(`${seconds}秒`);
    }

    // 如果数组为空，说明参数为0，返回"0秒"
    if (parts.length === 0) {
      return "0秒";
    }

    // 否则，用逗号和空格连接数组中的字符串，返回结果
    return parts.join("");
  }
}
