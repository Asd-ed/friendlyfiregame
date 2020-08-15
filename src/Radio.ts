import { Aseprite } from './Aseprite';
import { asset } from './Assets';
import { entity, Entity } from './Entity';
import { GameScene } from './scenes/GameScene';
import { Point, Size } from './Geometry';
import { RenderingLayer } from './Renderer';

@entity("radio")
export class Radio extends Entity {
    @asset("sprites/radio.aseprite.json")
    private static sprite: Aseprite;

    public constructor(scene: GameScene, position: Point) {
        super(scene, position, new Size(24, 24), false);
    }

    draw(ctx: CanvasRenderingContext2D): void {
        this.scene.renderer.addAseprite(Radio.sprite, "idle", this.position, RenderingLayer.ENTITIES)
        if (this.scene.showBounds) this.drawBounds();
    }

    update(dt: number): void {}
}
