import { EVENTS_NAME, GameStatus, } from '../consts';
import { Actor } from './actor';
import { Text } from './text';
export class Player extends Actor {
  hpValue: Text;
  keyW: Phaser.Input.Keyboard.Key;
  keyA: Phaser.Input.Keyboard.Key;
  keyS: Phaser.Input.Keyboard.Key;
  keyD: Phaser.Input.Keyboard.Key;
  keySpace: Phaser.Input.Keyboard.Key;

  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y, 'king');
    if (!this.scene?.input?.keyboard)
      throw Error(`Can't get keyboard input!`);

    // KEYS
    this.keyW = this.scene?.input?.keyboard.addKey('W');
    this.keyA = this.scene?.input?.keyboard?.addKey('A');
    this.keyS = this.scene?.input?.keyboard?.addKey('S');
    this.keyD = this.scene?.input?.keyboard?.addKey('D');
    this.keySpace = this.scene?.input?.keyboard?.addKey(32);
    // PHYSICS
    this.getBody().setSize(30, 30);
    this.getBody().setOffset(8, 0);

    this.hpValue = new Text(this.scene, this.x, this.y - this.height, this.hp.toString())
      .setFontSize(12)
      .setOrigin(0.8, 0.5);

    this.initAnimations();

    this.on('destroy', () => {
      this.keySpace.removeAllListeners();
    });
  }

  public btnUpDownHandler(): void {
    window.dispatchEvent(new KeyboardEvent('keydown', {
      key: "w",
      keyCode: 87,
      which: 87,
    }));
  }

  public btnUpUpHandler(): void {
    window.dispatchEvent(new KeyboardEvent('keyup', {
      key: "w",
      keyCode: 87,
      which: 87,
    }));
  }

  public btnDownDownHandler(): void {
    window.dispatchEvent(new KeyboardEvent('keydown', {
      key: "s",
      keyCode: 83,
      which: 83,
    }));
  }

  public btnDownUpHandler(): void {
    window.dispatchEvent(new KeyboardEvent('keyup', {
      key: "s",
      keyCode: 83,
      which: 83,
    }));
  }

  public btnRightDownHandler(): void {
    window.dispatchEvent(new KeyboardEvent('keydown', {
      key: "d",
      keyCode: 68,
      which: 68,
    }));
  }
  public btnRightUpHandler(): void {
    window.dispatchEvent(new KeyboardEvent('keyup', {
      key: "d",
      keyCode: 68,
      which: 68,
    }));
  }

  public btnLeftDownHandler(): void {
    window.dispatchEvent(new KeyboardEvent('keydown', {
      key: "a",
      keyCode: 65,
      which: 65,
    }));
  }

  public btnLeftUpHandler(): void {
    window.dispatchEvent(new KeyboardEvent('keyup', {
      key: "a",
      keyCode: 65,
      which: 65,
    }));
  }

  public btnAttackHandler(): void {
    window.dispatchEvent(new KeyboardEvent('keydown', {
      key: " ",
      keyCode: 32,
      which: 32,
    }));

    setTimeout(() => {
      window.dispatchEvent(new KeyboardEvent('keyup', {
        key: " ",
        keyCode: 32,
        which: 32,
      }));
    }, 20);
  }

  initAnimations(): void {
    this.scene.anims.create({
      key: 'run',
      frames: this.scene.anims.generateFrameNames('a-king', {
        prefix: 'run-',
        end: 7,
      }),
      frameRate: 8,
    });
    this.scene.anims.create({
      key: 'attack',
      frames: this.scene.anims.generateFrameNames('a-king', {
        prefix: 'attack-',
        end: 2,
      }),
      frameRate: 8,
    });
  }

  update(): void {
    this.getBody().setVelocity(0);
    if (!this.body) throw Error(`Can't get Body!`);

    if (this.keyW?.isDown) {
      this.body.velocity.y = -110;
      !this.anims.isPlaying && this.anims.play('run', true);
    }
    if (this.keyA?.isDown) {
      this.body.velocity.x = -110;
      this.checkFlip();
      this.getBody().setOffset(48, 15);
      !this.anims.isPlaying && this.anims.play('run', true);
    }
    if (this.keyS?.isDown) {
      this.body.velocity.y = 110;
      !this.anims.isPlaying && this.anims.play('run', true);
    }
    if (this.keyD?.isDown) {
      this.body.velocity.x = 110;
      this.checkFlip();
      this.getBody().setOffset(15, 15);
      !this.anims.isPlaying && this.anims.play('run', true);
    }

    if (this.keySpace?.isDown) {
      this.anims.play('attack', true);
      this.scene.game.events.emit(EVENTS_NAME.attack);
    }

    // this.keySpace.on('down', (event: KeyboardEvent) => {
    //   this.anims.play('attack', true);
    //   console.log('zero');

    //   this.scene.game.events.emit(EVENTS_NAME.attack);
    // });

    this.hpValue.setPosition(this.x, this.y - this.height * 0.4);
    this.hpValue.setOrigin(0.8, 0.5);
  }

  public getDamage(value?: number): void {
    super.getDamage(value);
    this.hpValue.setText(this.hp.toString());

    if (this.hp <= 0) {
      this.scene.game.events.emit(EVENTS_NAME.gameEnd, GameStatus.LOSE);
    }
  }
}