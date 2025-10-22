import { SubtitleFormat } from './subtitles';
import { SubtitleParser } from './subtitles';
import { SubtitleGenerator } from './subtitles';
import { LrcSubtitleParser } from './lrc_subtitle_parser';
import { SrtSubtitleParser } from './srt_subtitle_parser';
import { LrcSubtitleGenerator } from './lrc_subtitle_generator';
import { SrtSubtitleGenerator } from './srt_subtitle_generator';

/**
 * 字幕处理器工厂
 * <p>
 * 用于创建字幕解析器和生成器的工厂类
 * </p>
 */
export class SubtitleProcessorFactory {
    /**
     * 根据字幕格式创建对应的解析器
     * 
     * @param format 字幕格式
     * @return 对应的字幕解析器
     */
    static createParser(format: SubtitleFormat): SubtitleParser {
        switch (format) {
            case SubtitleFormat.LRC:
            case SubtitleFormat.KAR:
            case SubtitleFormat.ID3:
                return new LrcSubtitleParser();
            case SubtitleFormat.SRT:
                return new SrtSubtitleParser();
            default:
                throw new Error(`Unsupported subtitle format: ${format}`);
        }
    }
    
    /**
     * 根据字幕格式创建对应的生成器
     * 
     * @param format 字幕格式
     * @return 对应的字幕生成器
     */
    static createGenerator(format: SubtitleFormat): SubtitleGenerator {
        switch (format) {
            case SubtitleFormat.LRC:
            case SubtitleFormat.KAR:
            case SubtitleFormat.ID3:
                return new LrcSubtitleGenerator();
            case SubtitleFormat.SRT:
                return new SrtSubtitleGenerator();
            default:
                throw new Error(`Unsupported subtitle format: ${format}`);
        }
    }
}