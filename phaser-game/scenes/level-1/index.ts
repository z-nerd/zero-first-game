import { Scene, Tilemaps } from 'phaser';
import { Enemy } from '../../classes/enemy';
import { Player } from '../../classes/player';
import { Text } from '../../classes/text';
import { EVENTS_NAME } from '../../consts';
import { Button } from '../../dom';
import { gameObjectsToObjectPoints } from '../../helpers/gameobject-to-object-point';
export class Level1 extends Scene {
  private chests!: Phaser.GameObjects.Sprite[];
  private player!: Player;
  private enemies!: Enemy[];
  private map!: Tilemaps.Tilemap;
  private tileset!: Tilemaps.Tileset;
  private wallsLayer!: Tilemaps.TilemapLayer;
  private plantsLayer!: Tilemaps.TilemapLayer;
  private groundLayer!: Tilemaps.TilemapLayer;

  constructor() {
    super('level-1-scene');
  }

  private showDebugWalls(): void {
    const debugGraphics = this.add.graphics().setAlpha(0.7);
    this.wallsLayer.renderDebug(debugGraphics, {
      tileColor: null,
      collidingTileColor: new Phaser.Display.Color(243, 234, 48, 255),
    });
  }

  private initListeners(): void {
    this.game.events.on(EVENTS_NAME.btnUpDown, this.player.btnUpDownHandler, this);
    this.game.events.on(EVENTS_NAME.btnUpUp, this.player.btnUpUpHandler, this);

    this.game.events.on(EVENTS_NAME.btnDownDown, this.player.btnDownDownHandler, this);
    this.game.events.on(EVENTS_NAME.btnDownUp, this.player.btnDownUpHandler, this);

    this.game.events.on(EVENTS_NAME.btnRightDown, this.player.btnRightDownHandler, this);
    this.game.events.on(EVENTS_NAME.btnRightUp, this.player.btnRightUpHandler, this);

    this.game.events.on(EVENTS_NAME.btnLeftDown, this.player.btnLeftDownHandler, this);
    this.game.events.on(EVENTS_NAME.btnLeftUp, this.player.btnLeftUpHandler, this);
    
    this.game.events.on(EVENTS_NAME.btnAttack, this.player.btnAttackHandler, this);
  }

  private initMap(): void {
    this.map = this.make.tilemap({ key: 'dungeon', tileWidth: 16, tileHeight: 16 });
    this.tileset = this.map.addTilesetImage('dungeon', 'tiles');

    this.groundLayer = this.map.createLayer('Ground', this.tileset, 0, 0);
    this.wallsLayer = this.map.createLayer('Walls', this.tileset, 0, 0);
    this.wallsLayer.setCollisionByProperty({ collides: true });
    this.physics.world.setBounds(0, 0, this.wallsLayer.width, this.wallsLayer.height);

    this.plantsLayer = this.map.createLayer('Plants', this.tileset, 0, 0);
    this.plantsLayer.setCollisionByProperty({ collides: true });
    this.physics.world.setBounds(0, 0, this.plantsLayer.width, this.plantsLayer.height);
    this.plantsLayer.setScale(0.5);
    this.plantsLayer.setPosition(120, 40);


    this.showDebugWalls();
  }

  private initChests(): void {
    const chestPoints = gameObjectsToObjectPoints(
      this.map?.filterObjects('Chests', obj => obj.name === 'ChestPoint'),
    );
    this.chests = chestPoints.map(chestPoint =>
      this.physics.add.sprite(chestPoint.x, chestPoint.y, 'tiles_spr', 595).setScale(1.5),
    );
    this.chests.forEach(chest => {
      this.physics.add.overlap(this.player, chest, (obj1, obj2) => {
        this.game.events.emit(EVENTS_NAME.chestLoot);
        obj2.destroy();
        this.cameras.main.flash();
      });
    });
  }

  private initCamera(): void {
    this.cameras.main.setSize(this.game.scale.width, this.game.scale.height);
    this.cameras.main.startFollow(this.player, true, 0.09, 0.09);
    this.cameras.main.setZoom(2.2);
  }

  private initEnemies(): void {
    const enemiesPoints = gameObjectsToObjectPoints(
      this.map.filterObjects('Enemies', (obj) => obj.name === 'EnemyPoint'),
    );
    this.enemies = enemiesPoints.map((enemyPoint) =>
      new Enemy(this, enemyPoint.x, enemyPoint.y, 'tiles_spr', this.player, 503)
        .setName(enemyPoint.id.toString())
        .setScale(1.5),
    );
    this.physics.add.collider(this.enemies, this.wallsLayer);
    this.physics.add.collider(this.enemies, this.enemies);
    this.physics.add.collider(this.player, this.enemies, (obj1, obj2) => {
      (obj1 as Player).getDamage(1);
    });
  }

  private initPlayer(): void {
    this.player = new Player(this, 150, 150);
    this.physics.add.collider(this.player, this.wallsLayer);
    this.physics.add.collider(this.player, this.plantsLayer);
  }

  create() {
    this.initMap();
    this.initPlayer();
    new Text(this, 210, 110, 'Zero First Game').setFontSize(25);
    this.initEnemies();
    this.initChests();
    this.initCamera();
    this.initListeners();
  }

  update(): void {
    this.player.update();
  }
}