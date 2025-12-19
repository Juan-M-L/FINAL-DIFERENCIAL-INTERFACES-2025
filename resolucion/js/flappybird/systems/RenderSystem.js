// RenderSystem - Maneja todo el renderizado del juego.
// Dibuja entidades animadas, sprites, y elementos de UI.
export class RenderSystem {
  constructor(ctx, canvas) {
    this.ctx = ctx;
    this.canvas = canvas;
  }

  // Limpia el canvas completamente.
  clear() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }

  // Dibuja una entidad animada usando su spritesheet.
  // Funciona con cualquier entidad que tenga:
  // - currentFrame, x, y, width, height.
  // - spriteConfig. (frameWidth, frameHeight, etc.)
  drawEntity(entity, image) {
    if (!image || !image.complete) return;
    if (!entity.spriteConfig) {
      // Si no tiene config de sprite, dibujar imagen completa.
      this.ctx.drawImage(image, entity.x, entity.y, entity.width, entity.height);
      return;
    }

    const cfg = entity.spriteConfig;
    const frameIndex = entity.currentFrame || 0;
    const framesPerRow = cfg.framesPerRow || 1;
    const gap = cfg.gapBetweenFrames || 0;
    const fw = cfg.frameWidth;
    const fh = cfg.frameHeight;

    // Calcular posición del frame en el spritesheet.
    const sx = gap + (frameIndex % framesPerRow) * (fw + gap);
    const sy = Math.floor(frameIndex / framesPerRow) * (fh + gap);

    // Dibujar el frame.
    this.ctx.drawImage(
      image,
      sx, sy,           // Posición en el spritesheet
      fw, fh,           // Tamaño del frame
      entity.x, entity.y, // Posición en el canvas
      entity.width, entity.height // Tamaño en el canvas
    );
  }

  // Dibuja una tubería. (top y bottom)
  drawPipe(pipe, images) {
    const { pipeTop, pipeBottom } = images;

    // Dibujar tubería superior.
    if (pipeTop && pipeTop.complete) {
      this.ctx.drawImage(
        pipeTop,
        pipe.x,
        0,
        pipe.width,
        pipe.top
      );
    }

    // Dibujar tubería inferior.
    if (pipeBottom && pipeBottom.complete) {
      this.ctx.drawImage(
        pipeBottom,
        pipe.x,
        pipe.bottom,
        pipe.width,
        this.canvas.height - pipe.bottom
      );
    }
  }

  // Dibuja un rectángulo. (útil para UI o debug)
  drawRect(x, y, width, height, color) {
    this.ctx.fillStyle = color;
    this.ctx.fillRect(x, y, width, height);
  }

  // Dibuja texto.
  drawText(text, x, y, options = {}) {
    const {
      font = '20px Arial',
      color = 'white',
      align = 'left',
      baseline = 'top'
    } = options;

    this.ctx.font = font;
    this.ctx.fillStyle = color;
    this.ctx.textAlign = align;
    this.ctx.textBaseline = baseline;
    this.ctx.fillText(text, x, y);
  }

  // Dibuja texto con sombra/outline.
  drawTextWithShadow(text, x, y, options = {}) {
    const {
      font = '20px Arial',
      color = 'white',
      shadowColor = 'black',
      shadowBlur = 4,
      align = 'left'
    } = options;

    this.ctx.font = font;
    this.ctx.textAlign = align;
    
    // Sombra.
    this.ctx.shadowColor = shadowColor;
    this.ctx.shadowBlur = shadowBlur;
    this.ctx.fillStyle = color;
    this.ctx.fillText(text, x, y);
    
    // Reset shadow.
    this.ctx.shadowBlur = 0;
  }

  // Dibuja un panel de UI con fondo semi-transparente.
  drawPanel(x, y, width, height, bgColor = 'rgba(0,0,0,0.5)', borderRadius = 0) {
    this.ctx.fillStyle = bgColor;
    
    if (borderRadius > 0) {
      this.drawRoundedRect(x, y, width, height, borderRadius);
      this.ctx.fill();
    } else {
      this.ctx.fillRect(x, y, width, height);
    }
  }

  // Dibuja un rectángulo con esquinas redondeadas.
  drawRoundedRect(x, y, width, height, radius) {
    this.ctx.beginPath();
    this.ctx.moveTo(x + radius, y);
    this.ctx.lineTo(x + width - radius, y);
    this.ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
    this.ctx.lineTo(x + width, y + height - radius);
    this.ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
    this.ctx.lineTo(x + radius, y + height);
    this.ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
    this.ctx.lineTo(x, y + radius);
    this.ctx.quadraticCurveTo(x, y, x + radius, y);
    this.ctx.closePath();
  }

  // Dibuja una imagen simple.
  drawImage(image, x, y, width, height) {
    if (!image || !image.complete) return;
    this.ctx.drawImage(image, x, y, width, height);
  }

  // Dibuja un círculo. (útil para debug o efectos)
  drawCircle(x, y, radius, color, fill = true) {
    this.ctx.beginPath();
    this.ctx.arc(x, y, radius, 0, Math.PI * 2);
    
    if (fill) {
      this.ctx.fillStyle = color;
      this.ctx.fill();
    } else {
      this.ctx.strokeStyle = color;
      this.ctx.stroke();
    }
  }

  // Dibuja una línea.
  drawLine(x1, y1, x2, y2, color = 'white', width = 1) {
    this.ctx.strokeStyle = color;
    this.ctx.lineWidth = width;
    this.ctx.beginPath();
    this.ctx.moveTo(x1, y1);
    this.ctx.lineTo(x2, y2);
    this.ctx.stroke();
  }

  // Aplica un fade. (útil para transiciones)
  drawFade(alpha = 0.5, color = 'black') {
    this.ctx.fillStyle = color;
    this.ctx.globalAlpha = alpha;
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    this.ctx.globalAlpha = 1;
  }

  // Guarda el estado del contexto.
  save() {
    this.ctx.save();
  }

  // Restaura el estado del contexto.
  restore() {
    this.ctx.restore();
  }

  // Aplica una transformación de escala.
  scale(x, y) {
    this.ctx.scale(x, y);
  }

  // Aplica una rotación.
  rotate(angle) {
    this.ctx.rotate(angle);
  }

  // Aplica una traslación.
  translate(x, y) {
    this.ctx.translate(x, y);
  }

  // Debug: Muestra información de rendimiento.
  drawDebugInfo(fps, entities) {
    this.drawPanel(10, this.canvas.height - 80, 200, 70);
    this.drawText(`FPS: ${Math.round(fps)}`, 20, this.canvas.height - 70, {
      color: 'lime',
      font: '16px monospace'
    });
    this.drawText(`Entities: ${entities}`, 20, this.canvas.height - 50, {
      color: 'lime',
      font: '16px monospace'
    });
  }
}