import { IotEvent } from "sdkwork-sdk-api-typescript";
import { EventResponseProtocol, Message, ResponseProtocol } from "../types";

export interface ResponseMessageConverter {
    convert(response: ResponseProtocol): Message

}
export interface ResponseEventConverter {
    convert(response: EventResponseProtocol): IotEvent
}
export interface ResponseToolCallConverter {
    convert(response: EventResponseProtocol): Event
}