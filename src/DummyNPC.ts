import { Dialog, Message } from "./Dialog";
import { NPC } from './NPC';
import { SpeechBubble } from "./SpeechBubble";

export class DummyNPC extends NPC {
    private activeDialog: Dialog | null = null;
    public activeSpeechBubble: SpeechBubble | null = null;
    private greetingText = "Hi";
    private greetingTextRange = 65;
    private greetingTextActive = false;
    private greetingTextOffsetY = 40;

    async load(): Promise<void> {
        this.width = 20;
        this.height = 30;
        this.hasDialog = true;
    }

    draw(ctx: CanvasRenderingContext2D): void {
        ctx.save();
        ctx.beginPath();
        ctx.strokeStyle = "black";
        ctx.strokeText("NPC", this.x - (this.width / 2), -this.y - this.height);
        ctx.strokeRect(this.x - (this.width / 2), -this.y - this.height, this.width, this.height);
        ctx.restore();
        this.activeSpeechBubble?.draw(ctx, this.x, this.y + 30);
    }

    drawTextBox(ctx: CanvasRenderingContext2D) {
        ctx.save();
        ctx.beginPath();
        ctx.strokeStyle = "white";
        if (this.activeSpeechBubble) {
            return;
        }
        ctx.strokeText(this.greetingText, this.x - (this.width / 2), -this.y - (this.height + this.greetingTextOffsetY));
        ctx.strokeRect(this.x - (this.width / 2), -this.y - this.height - this.greetingTextOffsetY - 15, this.width, 20);
        ctx.restore();
    }

    update(dt: number): void {
        const isInRange = this.game.player.distanceTo(this) < this.greetingTextRange;
        if (isInRange && !this.greetingTextActive) {
            this.showGreeting();
        } else if (!isInRange) {
            this.closeDialog();
        }
        this.greetingTextActive = isInRange;
    }

    showGreeting() {
        if (this.activeSpeechBubble) {
            this.activeSpeechBubble.y = this.y + this.greetingTextOffsetY;
            this.activeSpeechBubble.message = this.greetingText;
            this.activeSpeechBubble.actionPaths = null;
        } else {
            this.activeSpeechBubble = new SpeechBubble(this.game, this.x, this.y + this.greetingTextOffsetY, "white", false, this.greetingText);
        }
    }

    closeDialog() {
        this.activeDialog = null;
        this.activeSpeechBubble = null;
        this.game.player.activeSpeechBubble = null;
        this.game.player.isInDialog = false;
    }

    startDialog(): void {
        if (this.hasDialog && !this.activeDialog) {
            const someConversation: Array<Message> = [
                { entity: "player", text: "Hello block.\nDo you have a task for me?" },
                {
                    entity: "other", text: "Sure, Player 1. What do you want to do?",
                    actionPaths: new Map<string, Array<Message>>()
                        .set("Epic shit", [
                            { entity: "other", text: "Hell yeah we will rock this." },
                            { entity: "player", text: "Then let's get the party started." }
                        ])
                        .set("Lame shit", [
                            { entity: "other", text: "Okay. Yeah. Stop playing this game, bitch." },
                            { entity: "player", text: "Ok." }
                        ])
                },
                { entity: "player", text: "Sure." },
                { entity: "other", text: "You ready?" },
                { entity: "player", text: "Sure." },
                { entity: "other", text: "Thanks for your help." },
                { entity: "player", text: "You're welcome." },
                { entity: "other", text: "Bye." },
            ]
            this.activeDialog = new Dialog(someConversation, this.game.player, this);
            this.getNextConversationPart();
        } else if (this.activeDialog) {
            this.getNextConversationPart();
        }
    }

    getNextConversationPart(): void {
        if (this.activeDialog && this.activeDialog.getNextMessage()) {
            this.activeSpeechBubble = this.activeDialog.getSpeechBubbleForEntity();
            this.game.player.activeSpeechBubble = this.activeDialog.getSpeechBubbleForPlayer();
            this.game.player.isInDialog = true;
        } else {
            this.closeDialog();
        }
    }
}
