import { _decorator, Slider, EventTouch } from "cc";

const { ccclass, property } = _decorator;
@ccclass
export class XSlider extends Slider {
    // public _preload () {
    //     super.__preload();
    // }
    
    public isDragging = false;
    public onDragStart(callback: (progress: number) => void){
        this._onDragStart = callback;
    }
    public onDragMove(callback: (progress: number) => void) {
        this._onDragMove = callback;
    }
    public onDragEnd(callback: (progress: number) => void) {
        this._onDragEnd = callback;
    }
    protected _onHandleDragStart(event?: EventTouch) {
        super._onHandleDragStart(event);
        console.log(`[Slider]: Dragging start`);
        this.isDragging = true;
        this._onDragStart && this._onDragStart(this.progress);
    }
    protected _onTouchBegan(event?: EventTouch) {
        super._onTouchBegan(event);
        console.log(`[Slider]: Dragging start`);
        this.isDragging = true;
        this._onDragStart && this._onDragStart(this.progress);
    }
    protected _onTouchMoved (event?: EventTouch) {
        super._onTouchMoved(event);
        console.log(`[Slider]: Dragging, alias touch move.`);
        this._onDragMove && this._onDragMove(this.progress);
    }
    protected _onTouchEnded(event?: EventTouch) {
        super._onTouchEnded(event);
        this.isDragging = false;
        console.log(`[Slider]: Touch End`);
        this._onDragEnd && this._onDragEnd(this.progress);
    }
    protected _onTouchCancelled(event?: any) {
        super._onTouchCancelled(event);
        this.isDragging = false;
        console.log(`[Slider]: Touch End`);
        this._onDragEnd && this._onDragEnd(this.progress);
    }
    private _onDragStart: (progress: number) => void = null;
    private _onDragMove: (progress: number) => void = null;
    private _onDragEnd: (progress: number) => void = null;
}