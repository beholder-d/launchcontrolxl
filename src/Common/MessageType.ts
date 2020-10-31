/**
 * Message Type
 */
export enum MessageType {
    NOTE = 0,
    CC = 1
}
export type MessageTypeName = 'note' | 'cc';
export const messageTypeNameMap: { [key in MessageType]: MessageTypeName } = {
    [MessageType.NOTE]: 'note',
    [MessageType.CC]: 'cc'
};
export const messageNameTypeMap: { [key in MessageTypeName]: MessageType } = {
    'note': MessageType.NOTE,
    'cc': MessageType.CC
}
/**
 * Transform
 */
export const messageTypeName = (x: MessageType): MessageTypeName => messageTypeNameMap[x];
export const messageNameType = (x: MessageTypeName): MessageType => messageNameTypeMap[x];
export const messageTypeRange = (x: number): MessageType => x in MessageType ? x : MessageType.NOTE;
export const messageTypeNameRange = (x: string): MessageTypeName => x in messageNameTypeMap ? (x as MessageTypeName) : 'cc';