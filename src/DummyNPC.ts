import { asset } from './Assets';
import { BitmapFont } from './BitmapFont';
import dialogData from '../assets/dummy.texts.json';
import { DIALOG_FONT } from './constants';
import { entity } from './Entity';
import { GameScene } from './scenes/GameScene';
import { Greeting } from './Greeting';
import { NPC } from './NPC';
import { Point, Size } from './Geometry';

@entity("tree")
export class DummyNPC extends NPC {
    @asset(DIALOG_FONT)
    private static font: BitmapFont;

    public constructor(scene: GameScene, position: Point) {
        super(scene, position, new Size(20, 30));
        this.greeting = new Greeting(this.scene, this, dialogData);
    }

    draw(ctx: CanvasRenderingContext2D): void {
        ctx.save();
        DummyNPC.font.drawText(ctx, "NPC", this.position.x, -this.position.y - this.size.height - 10, "black", 0.5);
        ctx.strokeStyle = "black";
        ctx.strokeRect(this.position.x - Math.round(this.size.width / 2) - 0.5, -this.position.y - this.size.height - 0.5, this.size.width, this.size.height);
        ctx.restore();
        this.drawDialoguePrompt(ctx);
        this.drawGreeting(ctx);
    }

    update(dt: number): void {
        this.updateGreeting(dt);
    }

}
