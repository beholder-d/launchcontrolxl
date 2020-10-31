/** 
 * Press Type 
 */
export enum ActionType {
    MOMENTARY = 0,
    TOGGLE = 1 
}
export type ActionTypeName = 'momentary' | 'toggle';
export const actionTypeNameMap: { [key in ActionType]: ActionTypeName } = {
    [ActionType.MOMENTARY]: 'momentary',
    [ActionType.TOGGLE]: 'toggle'
};
export const actionNameTypeMap: { [key in ActionTypeName]: ActionType } = {
    'momentary': ActionType.MOMENTARY,
    'toggle': ActionType.TOGGLE
}
// Transform
export const actionTypeName = (x: ActionType): ActionTypeName => actionTypeNameMap[x];
export const actionNameType = (x: ActionTypeName): ActionType => actionNameTypeMap[x];
export const actionTypeRange = (x: number): ActionType => x in ActionType ? x : ActionType.MOMENTARY;
export const actionTypeNameRange = (x: string): ActionTypeName => x in actionNameTypeMap ? (x as ActionTypeName) : 'momentary';