// PhysicsSystem - Maneja física y detección de colisiones.
export class PhysicsSystem {
  constructor(canvas) {
    this.canvas = canvas;
  }

  // Aplica gravedad a una entidad.
  applyGravity(entity, gravity, dt) {
    entity.velocity += gravity;
    entity.y += entity.velocity;
  }

  // Aplica un impulso vertical. (salto)
  applyImpulse(entity, force) {
    entity.velocity = force;
  }

  // Mueve una entidad horizontalmente.
  moveHorizontal(entity, speed, dt) {
    entity.x -= speed;
  }

  // Verifica colisión AABB (Axis-Aligned Bounding Box) básica
  // entre el dragón y una tubería.
  checkCollision(dragon, pipe) {
    // Ajustes para hacer la colisión más precisa.
    const dragonLeft = dragon.x + 5;
    const dragonRight = dragon.x + dragon.width - 5;
    const dragonTop = dragon.y + 2;
    const dragonBottom = dragon.y + dragon.height - 2;

    const pipeLeft = pipe.x + 5;
    const pipeRight = pipe.x + pipe.width - 5;
    const pipeTopBottom = pipe.top - 2;
    const pipeBottomTop = pipe.bottom + 4;

    // Verificar si el dragón está en el rango horizontal de la tubería.
    const inHorizontalRange = dragonRight > pipeLeft && dragonLeft < pipeRight;

    if (!inHorizontalRange) return false;

    // Verificar colisión con tubería superior o inferior.
    const hitTopPipe = dragonTop < pipeTopBottom;
    const hitBottomPipe = dragonBottom > pipeBottomTop;

    return hitTopPipe || hitBottomPipe;
  }

  // Verifica colisión entre el dragón y un recolectable.
  checkCollisionWithCollectible (dragon, collectible) {
    const dragonLeft = dragon.x;
    const dragonRight = dragon.x + dragon.width;
    const dragonTop = dragon.y;
    const dragonBottom = dragon.y + dragon.height;

    const collectibleLeft = collectible.x;
    const collectibleRight = collectible.x + collectible.width;
    const collectibleTop = collectible.y;
    const collectibleBottom = collectible.y + collectible.height;

    // Verificar solapamiento en ambos ejes.
    const overlapX = dragonRight > collectibleLeft && dragonLeft < collectibleRight;
    const overlapY = dragonBottom > collectibleTop && dragonTop < collectibleBottom;

    return overlapX && overlapY;
  }

  // Verifica colisión circular. (más precisa para objetos redondos)
  checkCircularCollision(entity1, entity2) {
    // Calcular centros.
    const center1X = entity1.x + entity1.width / 2;
    const center1Y = entity1.y + entity1.height / 2;
    const center2X = entity2.x + entity2.width / 2;
    const center2Y = entity2.y + entity2.height / 2;

    // Calcular distancia entre centros.
    const dx = center2X - center1X;
    const dy = center2Y - center1Y;
    const distance = Math.sqrt(dx * dx + dy * dy);

    // Calcular radios. (promedio de ancho y alto dividido por 2)
    const radius1 = (entity1.width + entity1.height) / 4;
    const radius2 = (entity2.width + entity2.height) / 4;

    // Hay colisión si la distancia es menor que la suma de radios.
    return distance < (radius1 + radius2);
  }

  // Verifica si una entidad está fuera de los límites del canvas.
  isOutOfBounds(entity) {
    const top = entity.y < 0;
    const bottom = entity.y + entity.height > this.canvas.height;
    const left = entity.x + entity.width < 0;
    const right = entity.x > this.canvas.width;

    return { top, bottom, left, right, any: top || bottom || left || right };
  }

  // Mantiene una entidad dentro de los límites del canvas.
  clampToBounds(entity) {
    if (entity.y < 0) {
      entity.y = 0;
      entity.velocity = 0;
    }

    if (entity.y + entity.height > this.canvas.height) {
      entity.y = this.canvas.height - entity.height;
      entity.velocity = 0;
    }

    if (entity.x < 0) {
      entity.x = 0;
    }

    if (entity.x + entity.width > this.canvas.width) {
      entity.x = this.canvas.width - entity.width;
    }
  }

  // Calcula la distancia entre dos entidades.
  getDistance(entity1, entity2) {
    const dx = (entity2.x + entity2.width / 2) - (entity1.x + entity1.width / 2);
    const dy = (entity2.y + entity2.height / 2) - (entity1.y + entity1.height / 2);
    return Math.sqrt(dx * dx + dy * dy);
  }

  // Verifica si dos entidades están cerca. (útil para optimización)
  isNearby(entity1, entity2, threshold = 100) {
    return this.getDistance(entity1, entity2) < threshold;
  }

  // Debug: Dibuja los bounding boxes de colisión.
  debugDrawCollisionBox(ctx, entity, color = 'red') {
    ctx.strokeStyle = color;
    ctx.lineWidth = 2;
    ctx.strokeRect(entity.x, entity.y, entity.width, entity.height);
  }

  // Debug: Dibuja el círculo de colisión.
  debugDrawCollisionCircle(ctx, entity, color = 'blue') {
    const centerX = entity.x + entity.width / 2;
    const centerY = entity.y + entity.height / 2;
    const radius = (entity.width + entity.height) / 4;

    ctx.strokeStyle = color;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
    ctx.stroke();
  }
}