import Point from "@danehansen/point";

const MATTER_COLOR = "#fff";
const ANTIMATTER_COLOR = "#000";
const DENSITY = 1;

export function createParticle() {
  return {
    color: 0,
    destX: 0,
    destY: 0,
    mass: 0,
    radius: 0.5,
    x: 0,
    xVel: 0,
    y: 0,
    yVel: 0
  };
}

export function moveParticle(particle) {
  const { destX, destY } = particle;
  particle.xVel = destX - particle.x;
  particle.yVel = destY - particle.y;
  particle.x = destX;
  particle.y = destY;
}

export function setParticleMass(particle, num, pixelRatio) {
  particle.mass = num;
  particle.radius =
    Math.pow(Math.abs(num) / DENSITY / ((4 / 3) * Math.PI), 1 / 3) * pixelRatio;
  particle.color = num > 0 ? MATTER_COLOR : ANTIMATTER_COLOR;
}

export function velocitate(particle) {
  particle.destX += particle.xVel;
  particle.destY += particle.yVel;
}

export function collisionCheck(particleA, particleB) {
  //make sure both items have mass
  if (!particleA.mass || !particleB.mass) {
    return false;
  }
  //get our shit local
  const aStartX = particleA.x;
  const aEndX = particleA.destX;
  const aStartY = particleA.y;
  const aEndY = particleA.destY;
  const aRadius = particleA.radius;
  const bStartX = particleB.x;
  const bEndX = particleB.destX;
  const bStartY = particleB.y;
  const bEndY = particleB.destY;
  const bRadius = particleB.radius;
  //rough check
  const aLeft = Math.min(aStartX, aEndX) - aRadius;
  14.6;
  const aTop = Math.min(aStartY, aEndY) - aRadius;
  -14.7;
  const aRight = Math.max(aStartX, aEndX) + aRadius;
  24.1;
  const aBottom = Math.max(aStartY, aEndY) + aRadius;
  -3.5;
  const bLeft = Math.min(bStartX, bEndX) - bRadius;
  10.1;
  const bTop = Math.min(bStartY, bEndY) - bRadius;
  0.13;
  const bRight = Math.max(bStartX, bEndX) + bRadius;
  17.2;
  const bBottom = Math.max(bStartY, bEndY) + bRadius;
  7.2;
  if (aLeft > bRight || bLeft > aRight || aTop > bBottom || bTop > aBottom) {
    return false;
  }
  //fine check
  const avx = aEndX - aStartX;
  const avy = aEndY - aStartY;
  const bvx = bEndX - bStartX;
  const bvy = bEndY - bStartY;
  let cpa = closestPointOfApproach(
    aStartX,
    aStartY,
    avx,
    avy,
    bStartX,
    bStartY,
    bvx,
    bvy
  );
  const maxRadius = Math.max(aRadius, bRadius);
  if (cpa > 1) {
    // closest point of approach is in the future. check to see if end of this iteration is within the boundry
    const dist = Math.sqrt(
      Math.pow(aEndX - bEndX, 2) + Math.pow(aEndY - bEndY, 2)
    );
    if (dist < maxRadius) {
      return true;
    } else {
      return false;
    }
  } else {
    cpa = Math.max(cpa, 0);
    //closest approach happened on this iteration. find distance at its time.
    const aClosest = Point.interpolate(
      particleA,
      { x: particleA.destX, y: particleA.destY },
      cpa
    );
    const bClosest = Point.interpolate(
      particleB,
      { x: particleB.destX, y: particleB.destY },
      cpa
    );
    const dist = Point.distance(aClosest, bClosest);
    if (dist < maxRadius) {
      return true;
    } else {
      return false;
    }
  }
}

function closestPointOfApproach(ax, ay, avx, avy, bx, by, bvx, bvy) {
  const vxDiff = avx - bvx;
  const vyDiff = avy - bvy;
  const c = vxDiff * vxDiff + vyDiff * vyDiff;
  /*if (c < 0.00000001) {
      return 0.0;
  }*/
  const xDiff = ax - bx;
  const yDiff = ay - by;
  return -(xDiff * vxDiff + yDiff * vyDiff) / c;
}

export function combine(particleA, particleB, pixelRatio) {
  const m1 = particleA.mass;
  const m2 = particleB.mass;
  const m2a = Math.abs(m2);
  const ratio = m2a / (Math.abs(m1) + m2a);
  particleA.x = interpolate(particleA.x, particleB.x, ratio);
  particleA.y = interpolate(particleA.y, particleB.y, ratio);
  particleA.destX = interpolate(particleA.destX, particleB.destX, ratio);
  particleA.destY = interpolate(particleA.destY, particleB.destY, ratio);
  setParticleMass(particleA, m1 + m2, pixelRatio);
  setParticleMass(particleB, 0, pixelRatio);
}

function interpolate(num1, num2, f) {
  const diff = num2 - num1;
  const result = num1 + diff * f;
  return num1 + diff * f;
}
