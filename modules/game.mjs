import { Camera } from './camera.mjs';
import { Player } from './player.mjs';
import { KeyboardInput } from './keyboard-input.mjs';
import { Rectangle } from './rectangle.mjs';

class Game {
    constructor(canvas) {
        this.canvas = canvas;
        this.context = canvas.getContext('2d');

        this.camera = new Camera();

        this.players = [new Player('../assets/player/player.png'), new Player('../assets/player/player.png', { x: 30, y: 0 })];
        this.objects = this.players;
        this.objects.push(new Rectangle('../assets/player/player.png', { x: 0, y: 50 }, { w: 200, h: 1 }));
        this.objects.push(new Rectangle('../assets/player/player.png', { x: -20, y: -10 }, { w: 50, h: 1 }));
        this.objects.push(new Rectangle('../assets/player/player.png', { x: 50, y: 35 }, { w: 10, h: 70 }));

        this.input = new KeyboardInput(this.players[0]);
    }

    iter() {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);

        this.input.check();

        for (let i = 0; i < this.objects.length; i++) {
            this.objects[i].iter();
        }

        for (let i = 0; i < this.objects.length; i++) {
            if (this.objects[i].detectObject) {
                for (let j = 0; j < this.objects.length; j++) {
                    this.objects[i].detectObject(this.objects[j]);
                }
            }
            this.objects[i].move();
            this.draw(this.objects[i]);
        }

        this.camera.pos.x = (this.players[0].pos.x + this.players[1].pos.x) / 2;
        this.camera.pos.y = (this.players[0].pos.y + this.players[1].pos.y) / 2;

        let xz = Math.max(Math.min(0.75 * this.dim().w / Math.abs(this.players[0].pos.x - this.players[1].pos.x), 4), 2);
        let yz = Math.max(Math.min(0.75 * this.dim().h / Math.abs(this.players[0].pos.y - this.players[1].pos.y), 4), 2);
        this.camera.zoom = Math.min(xz, yz);
    }

    draw(object) {
        this.context.drawImage(object.image, this.rel(object).x, this.rel(object).y, this.rel(object).w, this.rel(object).h);
    }

    rel(object) {
        return {
            x: this.dim().w + (object.pos.x - object.dim.w / 2 - this.camera.pos.x) * this.camera.zoom,
            y: this.dim().h + (object.pos.y - object.dim.h / 2 - this.camera.pos.y) * this.camera.zoom,
            w: object.dim.w * this.camera.zoom,
            h: object.dim.h * this.camera.zoom
        }
    }

    dim() {
        return {
            w: this.canvas.style.width.slice(0, -2) / 2,
            h: this.canvas.style.height.slice(0, -2) / 2
        }
    }
}

export { Game, Camera, Player };