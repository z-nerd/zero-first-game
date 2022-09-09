import { GameObjects, Scene } from 'phaser';
import { Button } from '../../dom';

export class TestScene extends Scene {
    private button: any;
    private background: any;

    constructor() {
        super('test-scene');
    }
    

    create(): void {
        var btn = Button({
            style: {
                width: '30px',
                height: '30px',
                color: 'red',
            },
            text: 'zero'
        });
        this.background = this.add.tileSprite(0, 0, 800, 600, 'background');
        this.add.dom(300, 400, btn).addListener('click').on('click', () => {
            console.log('zero');
            
        });

        // this.button.onInputOver.add(this.over, this);
        // this.button.onInputOut.add(this.out, this);
        // this.button.onInputUp.add(this.up, this);
    }
    // up() {
    //     console.log('button up', arguments);
    // }
    
    // over() {
    //     console.log('button over');
    // }
    
    // out() {
    //     console.log('button out');
    // }
    
    // actionOnClick () {
    
    //     this.background.visible =! this.background.visible;
    
    // }
}