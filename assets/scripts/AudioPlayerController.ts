import { _decorator, Component, AudioPlayer, PlayerOptions, resources, AudioClip, Slider, Label, CCBoolean, ToggleContainer, Toggle, director,sys } from 'cc';
import { MINIGAME, NATIVE } from 'cc/env';
import {XSlider} from './XSlider'
const { ccclass, property } = _decorator;

@ccclass('AudioPlayerController')
export class AudioPlayerController extends Component {
    private _player: AudioPlayer | null = null;

    @property(XSlider)
    public progress: XSlider;
    @property(Label)
    public lDuration: Label;
    @property(Label)
    public lState: Label;
    @property(AudioClip)
    public clip: AudioClip;
    @property(Toggle)
    public dom: Toggle;
    @property(Toggle)
    public webAudio: Toggle;
    @property(Toggle)
    public innerCtx: Toggle;
    @property(Toggle)
    public loopToggle: Toggle;
    @property(Slider)
    public volumeProgress: Slider;
    @property(Slider)
    public panSlider: Slider;
    @property(Slider)
    public playbackRateSlider: Slider;
    start() {
        let noWebAudio: boolean;
        // Set backend chooser for each platform
        if (NATIVE) {
            this.innerCtx.interactable = false;
            this.dom.interactable = false;
            this.webAudio.isChecked = true;
            noWebAudio = false;
        } else if (MINIGAME) {
            this.webAudio.interactable = false;
            this.dom.interactable = false;
            this.innerCtx.isChecked = true;
            noWebAudio = true;
        } else {
            this.innerCtx.interactable = false;
            this.dom.isChecked = true;
            noWebAudio = true;
        }



        var options: PlayerOptions = {loop: false, volume: 1, noWebAudio};
        this._player = new AudioPlayer(this.clip, options);
        this.progress.onDragEnd((progress: number) => {
            console.log('On drag End');
            this._player.currentTime = progress * this.clip.getDuration();
        });
        this.lDuration.string = `Audio Duration: ${this.clip.getDuration()}`;
        this.lState.string = `Audio Player State: ${this._player.state.toString()}`;

        this.volumeProgress.node.on('slide', ()=>{
            this._player.volume = this.volumeProgress.progress;
        }, this);
        this.panSlider.node.on('slide', ()=>{
            let pan = (this.panSlider.progress - 0.5) * 2;
            console.log(pan);
            this._player.pan = pan;
        }, this);
        this.playbackRateSlider.node.on('slide', ()=>{
            this._player.playbackRate = this.playbackRateSlider.progress * 2;
        }, this);
    }

    update(deltaTime: number) {
        if (!this.progress.isDragging) {
            this.updateSlider(this._player, this.progress);    
        }
    }

    updateSlider (player: AudioPlayer, slider: Slider) {
        let currentTime = Number.parseFloat(player.currentTime.toFixed(2));
        let duration = Number.parseFloat(player.clip.getDuration().toFixed(2));
        slider.progress = currentTime / duration;
    }
    
    play() {
        this._player.play();
    }
    pause() {
        this._player.pause();
    }
    stop(){
        this._player.stop();
    }
    
    delete() {
        this._player.destroy();
        delete this._player;
    }

    setLoop() {
        this._player.loop  = !this._player.loop;
    }
    setPlayer (noWebAudio: boolean) {
        if (!this._player) {
            return;
        }
        const oldLoop = this._player.loop;
        const volume = this._player.volume;
        this._player.destroy();
        this._player = new AudioPlayer(this.clip, {
            loop: oldLoop,
            volume,
            noWebAudio
        });
    }
    setWebAudioPlayer() {
        this.setPlayer(false);
    }
    setDomPlayer() {
        this.setPlayer(true);
    }
    setInnerAudioCtxPlayer() {
        this.setPlayer(true);
    }
}


