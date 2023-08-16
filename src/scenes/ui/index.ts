import { Scene, GameObjects } from 'phaser';
import { Score, ScoreOperations } from '../../classes/score';
import { Text } from '../../classes/text';
import { EVENTS_NAME, GameStatus } from '../../consts';
import { GameConfig } from '../../main';
import { Button } from '../../dom';
import { isMobile } from '../../helpers/platform';
export class UIScene extends Scene {
  chestLootHandler: () => void;
  score!: Score;
  gameEndPhrase!: Text;
  gameEndHandler: (status: GameStatus) => void;
  btnUp!: GameObjects.DOMElement;
  btnDown!: GameObjects.DOMElement;
  btnLeft!: GameObjects.DOMElement;
  btnRight!: GameObjects.DOMElement;

  constructor() {
    super('ui-scene');

    this.chestLootHandler = () => {
      this.score.changeValue(ScoreOperations.INCREASE, 5);
      if (this.score.getValue() === GameConfig.winScore) {
        this.game.events.emit(EVENTS_NAME.gameEnd, 'win');
      }
    };

    this.gameEndHandler = (status) => {
      this.cameras.main.setBackgroundColor('rgba(0,0,0,0.6)');
      this.game.scene.pause('level-1-scene');
      this.gameEndPhrase = new Text(
        this,
        this.game.scale.width / 2,
        this.game.scale.height * 0.4,
        status === GameStatus.LOSE
          ? `WASTED!\nTOUCH TO RESTART`
          : `YOU ARE ROCK!\nTOUCH TO RESTART`,
      )
        .setAlign('center')
        .setColor(status === GameStatus.LOSE ? '#ff0000' : '#ffffff');
      this.gameEndPhrase.setPosition(
        this.game.scale.width / 2 - this.gameEndPhrase.width / 2,
        this.game.scale.height * 0.4,
      );

      this.input.on('pointerdown', () => {
        this.game.events.off(EVENTS_NAME.chestLoot, this.chestLootHandler);
        this.game.events.off(EVENTS_NAME.gameEnd, this.gameEndHandler);
        this.scene.get('level-1-scene').scene.restart();
        this.scene.restart();
      });
    };
  }

  initListeners(): void {
    this.game.events.on(EVENTS_NAME.chestLoot, this.chestLootHandler, this);
    this.game.events.once(EVENTS_NAME.gameEnd, this.gameEndHandler, this);
  }

  initButton(): void {
    var btnUp = Button({
      style: {
        width: '53px',
        height: '53px',
        color: 'red',
        background: 'url(assets/ui/up.png)',
        backgroundSize: '50% 50%',
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'center'
      },
      text: ''
    });

    var btnDown = Button({
      style: {
        width: '53px',
        height: '53px',
        color: 'red',
        background: 'url(assets/ui/down.png)',
        backgroundSize: '50% 50%',
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'center'
      },
      text: ''
    });

    var btnRight = Button({
      style: {
        width: '53px',
        height: '53px',
        color: 'red',
        background: 'url(assets/ui/right.png)',
        backgroundSize: '50% 50%',
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'center'
      },
      text: ''
    });


    var btnLeft = Button({
      style: {
        width: '53px',
        height: '53px',
        color: 'red',
        background: 'url(assets/ui/left.png)',
        backgroundSize: '50% 50%',
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'center'
      },
      text: ''
    });

    var btnAttack = Button({
      style: {
        width: '53px',
        height: '53px',
        color: 'red',
        background: 'url(assets/ui/attack.png)',
        backgroundSize: '50% 50%',
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'center'
      },
      text: ''
    });

    this.btnUp = this.add.dom(100, window.innerHeight - 150, btnUp).addListener('touchstart')
    this.btnUp.addListener('touchstart')
    this.btnUp.addListener('touchend')
    this.btnUp.on('touchstart', () => {
      this.game.events.emit(EVENTS_NAME.btnUpDown);
    })
    this.btnUp.on('touchend', () => {
      this.game.events.emit(EVENTS_NAME.btnUpUp);
    });

    this.btnDown = this.add.dom(100, window.innerHeight - 50, btnDown).addListener('touchstart')
    this.btnDown.addListener('touchstart')
    this.btnDown.addListener('touchend')
    this.btnDown.on('touchstart', () => {
      this.game.events.emit(EVENTS_NAME.btnDownDown);
    })
    this.btnDown.on('touchend', () => {
      this.game.events.emit(EVENTS_NAME.btnDownUp);
    });

    this.btnRight = this.add.dom(150, window.innerHeight - 100, btnRight)
    this.btnRight.addListener('touchstart')
    this.btnRight.addListener('touchend')
    this.btnRight.on('touchstart', () => {
      this.game.events.emit(EVENTS_NAME.btnRightDown);
    })
    this.btnRight.on('touchend', () => {
      this.game.events.emit(EVENTS_NAME.btnRightUp);
    });


    this.btnLeft = this.add.dom(50, window.innerHeight - 100, btnLeft)
    this.btnLeft.addListener('touchstart')
    this.btnLeft.addListener('touchend')

    this.btnLeft.on('touchstart', () => {
      this.game.events.emit(EVENTS_NAME.btnLeftDown);
    })
    this.btnLeft.on('touchend', () => {
      this.game.events.emit(EVENTS_NAME.btnLeftUp);
    });

    this.add.dom(window.innerWidth - 50, window.innerHeight - 50, btnAttack).addListener('touchstart')
      .on('touchstart', () => {
        this.game.events.emit(EVENTS_NAME.btnAttack);
      });
  }

  create(): void {
    this.score = new Score(this, 20, 20, 0);
    this.initListeners();
    if (isMobile()) this.initButton();
  }
}