import { Game, Types } from 'phaser';
import { Level1, LoadingScene, TestScene, UIScene } from './scenes';

declare global {
    interface Window {
        sizeChanged: () => void;
        game: Game;
    }
}

export type GameConfigType = Types.Core.GameConfig & {
    winScore: number;
};

export const GameConfig: GameConfigType = {
    winScore: 20,
    dom: {
        createContainer: true
    },
    title: 'Zero First Game',
    type: Phaser.WEBGL,
    parent: 'game',
    backgroundColor: '#351f1b',
    scale: {
        mode: Phaser.Scale.ScaleModes.NONE,
        width: window.innerWidth,
        height: window.innerHeight,
    },
    physics: {
        default: 'arcade',
        arcade: {
            debug: false,
        },
    },
    render: {
        antialiasGL: false,
        pixelArt: true,
    },
    callbacks: {
        postBoot: () => {
            window.sizeChanged();
        },
    },
    canvasStyle: `display: block; width: 100%; height: 100%;`,
    autoFocus: true,
    audio: {
        disableWebAudio: false,
    },
    scene: [LoadingScene, TestScene, Level1, UIScene],
};


const GameMain = (gameConfig: GameConfigType = GameConfig) => {
    window.sizeChanged = () => {
        if (window.game.isBooted) {
            setTimeout(() => {
                window.game.scale.resize(window.innerWidth, window.innerHeight);
                window.game.canvas.setAttribute(
                    'style',
                    `display: block; width: ${window.innerWidth}px; height: ${window.innerHeight}px;`,
                );
            }, 100);
        }
    };

    const game = new Game(gameConfig);
    
    window.onresize = () => window.sizeChanged();
    window.game = game;

    return game;
}

export default GameMain;