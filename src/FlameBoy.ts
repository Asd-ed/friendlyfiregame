import { entity } from "./Entity";
import { Game } from "./game";
import { Sprites, getSpriteIndex } from "./Sprites";
import { loadImage } from "./graphics";
import { FLAMEBOY_ANIMATION } from "./constants";
import { NPC } from './NPC';
import { Face, EyeType, FaceModes } from './Face';

@entity("flameboy")
export class FlameBoy extends NPC {
    private sprites!: Sprites;
    private spriteIndex = 0;

    public constructor(game: Game, x: number, y:number) {
        super(game, x, y, 26, 54);
        this.face = new Face(this, EyeType.FLAMEBOY, 1, 0, 5);
        this.defaultFaceMode = FaceModes.BORED
        this.face.setMode(this.defaultFaceMode);
    }

    public async load(): Promise<void> {
        this.sprites = new Sprites(await loadImage("sprites/flameboy.png"), 6, 1);
    }

    draw(ctx: CanvasRenderingContext2D): void {
        ctx.save();
        ctx.translate(this.x, -this.y + 1);
        this.sprites.draw(ctx, this.spriteIndex);
        ctx.restore();
        this.drawFace(ctx, false);
        this.speechBubble.draw(ctx);
    }

    update(dt: number): void {
        super.update(dt);
        this.spriteIndex = getSpriteIndex(0, FLAMEBOY_ANIMATION);
        this.speechBubble.update(this.x, this.y);
    }
}
