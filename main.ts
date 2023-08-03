enum ActionKind {
    RunningLeft,
    RunningRight,
    Idle,
    IdleLeft,
    IdleRight,
    JumpingLeft,
    JumpingRight,
    CrouchLeft,
    CrouchRight,
    Flying,
    Walking,
    Jumping
}
namespace SpriteKind {
    export const Bumper = SpriteKind.create()
    export const Goal = SpriteKind.create()
    export const Coin = SpriteKind.create()
    export const Flier = SpriteKind.create()
}
function animaciones_d_hollow () {
    animacion_de_mov_i_y_d()
    vistas()
    animacion_de_abajo()
    animacion_de_salto()
}
sprites.onOverlap(SpriteKind.Player, SpriteKind.Bumper, function (sprite, otherSprite) {
    if (sprite.vy > 0 && !(sprite.isHittingTile(CollisionDirection.Bottom)) || sprite.y < otherSprite.top) {
        otherSprite.destroy(effects.ashes, 250)
        otherSprite.vy = -50
        sprite.vy = -2 * pixelsToMeters
        info.changeScoreBy(1)
        music.powerUp.play()
    } else {
        info.changeLifeBy(-1)
        sprite.say("Ow!", invincibilityPeriod)
        music.powerDown.play()
    }
    pause(invincibilityPeriod)
})
scene.onOverlapTile(SpriteKind.Player, assets.tile`ESPADA`, function (sprite, location) {
    info.changeLifeBy(1)
    currentLevel += 1
    if (cuando_sig_nivel()) {
        game.splash("Sig nivel desbloqueado")
        diseño_de_niveles(currentLevel)
    } else {
        game.over(true, effects.confetti)
    }
})
function dobles () {
    // else if: either fell off a ledge, or double jumping
    if (hueco_1.isHittingTile(CollisionDirection.Bottom)) {
        hueco_1.vy = -4 * pixelsToMeters
    } else if (canDoubleJump) {
        doubleJumpSpeed = -3 * pixelsToMeters
        // Good double jump
        if (hueco_1.vy >= -40) {
            doubleJumpSpeed = -4.5 * pixelsToMeters
            hueco_1.startEffect(effects.trail, 500)
            scene.cameraShake(2, 250)
        }
        hueco_1.vy = doubleJumpSpeed
        canDoubleJump = false
    }
}
controller.up.onEvent(ControllerButtonEvent.Pressed, function () {
    dobles()
})
function animacion_de_salto () {
    // Because there isn't currently an easy way to say "play this animation a single time
    // and stop at the end", this just adds a bunch of the same frame at the end to accomplish
    // the same behavior
    mainJumpLeft = animation.createAnimation(ActionKind.JumpingLeft, 100)
    animation.attachAnimation(hueco_1, mainJumpLeft)
    mainJumpLeft.addAnimationFrame(img`
        . . . . . . . . . . . . . . . . 
        . . f f . . . . . f f f . . . . 
        . f 1 f f f f f f f 1 f f . . . 
        . f 1 1 1 1 1 1 1 1 1 f f f . . 
        . f 1 1 f f 1 1 f f 1 1 f f f . 
        . f 1 1 f f 1 1 f f 1 1 1 f f . 
        . f 1 1 1 1 f f 1 1 1 1 1 f . . 
        . f 1 1 1 1 1 1 1 1 1 1 1 f . . 
        . f f f f f f f f f f f f f . . 
        1 1 1 f f f . . . f f f 1 1 1 . 
        1 1 f f f f . . . f f f f 1 1 . 
        1 f f f f f f f f f f f f f 1 . 
        . . . f f f f f f f f f f . . . 
        . . . . f 1 f . . f 1 f . . . . 
        . . . . f 1 f . . f 1 f . . . . 
        . . . . 1 1 1 . . 1 1 1 . . . . 
        `)
    mainJumpLeft.addAnimationFrame(img`
        . . . . . . . . . . . . . . . . 
        . . f f . . . . . f f f . . . . 
        . f 1 f f f f f f f 1 f f . . . 
        . f 1 1 1 1 1 1 1 1 1 f f f . . 
        . f 1 1 f f 1 1 f f 1 1 f f f . 
        . f 1 1 f f 1 1 f f 1 1 1 f f . 
        . f 1 1 1 1 f f 1 1 1 1 1 f . . 
        . f 1 1 1 1 1 1 1 1 1 1 1 f . . 
        . f f f f f f f f f f f f f . . 
        1 1 1 f f f . . . f f f 1 1 1 . 
        1 f f f f f . . . f f f f f 1 . 
        1 f f f f f f f f f f f f f 1 . 
        . . . f f 1 f f f f 1 f f . . . 
        . . . . f 1 f . . f 1 f . . . . 
        . . . . 1 1 1 . . 1 1 1 . . . . 
        . . . . . . . . . . . . . . . . 
        `)
    for (let index = 0; index < 30; index++) {
        mainJumpLeft.addAnimationFrame(img`
            . . f f . . . . . f f f . . . . 
            . f 1 f f f f f f f 1 f f . . . 
            . f 1 1 1 1 1 1 1 1 1 f f f . . 
            . f 1 1 f f 1 1 f f 1 1 f f f . 
            . f 1 1 f f 1 1 f f 1 1 1 f f . 
            . f 1 1 1 1 f f 1 1 1 1 1 f . . 
            . f 1 1 1 1 1 1 1 1 1 1 1 f . . 
            . f f f f f f f f f f f f f . . 
            1 1 1 f f f . . . f f f 1 1 1 . 
            1 f f f f f . . . f f f f f 1 . 
            . f f f f 1 f f f f 1 f f f . . 
            . . . f f 1 f . . f 1 f f . . . 
            . . . . 1 1 1 . . 1 1 1 . . . . 
            . . . . . . . . . . . . . . . . 
            . . . . . . . . . . . . . . . . 
            . . . . . . . . . . . . . . . . 
            `)
    }
    mainJumpRight = animation.createAnimation(ActionKind.JumpingRight, 100)
    animation.attachAnimation(hueco_1, mainJumpRight)
    mainJumpRight.addAnimationFrame(img`
        . . . . . . . . . . . . . . . . 
        . . . . f f f . . . . . f f . . 
        . . . f f 1 f f f f f f f 1 f . 
        . . f f f 1 1 1 1 1 1 1 1 1 f . 
        . f f f 1 1 f f 1 1 f f 1 1 f . 
        . f f 1 1 1 f f 1 1 f f 1 1 f . 
        . . f 1 1 1 1 1 f f 1 1 1 1 f . 
        . . f 1 1 1 1 1 1 1 1 1 1 1 f . 
        . . f f f f f f f f f f f f f . 
        . 1 1 1 f f f . . . f f f 1 1 1 
        . 1 1 f f f f . . . f f f f 1 1 
        . 1 f f f f f f f f f f f f f 1 
        . . . f f f f f f f f f f . . . 
        . . . . f 1 f . . f 1 f . . . . 
        . . . . f 1 f . . f 1 f . . . . 
        . . . . 1 1 1 . . 1 1 1 . . . . 
        `)
    mainJumpRight.addAnimationFrame(img`
        . . . . . . . . . . . . . . . . 
        . . . . f f f . . . . . f f . . 
        . . . f f 1 f f f f f f f 1 f . 
        . . f f f 1 1 1 1 1 1 1 1 1 f . 
        . f f f 1 1 f f 1 1 f f 1 1 f . 
        . f f 1 1 1 f f 1 1 f f 1 1 f . 
        . . f 1 1 1 1 1 f f 1 1 1 1 f . 
        . . f 1 1 1 1 1 1 1 1 1 1 1 f . 
        . . f f f f f f f f f f f f f . 
        . 1 1 1 f f f . . . f f f 1 1 1 
        . 1 f f f f f . . . f f f f f 1 
        . 1 f f f f f f f f f f f f f 1 
        . . . f f 1 f f f f 1 f f . . . 
        . . . . f 1 f . . f 1 f . . . . 
        . . . . 1 1 1 . . 1 1 1 . . . . 
        . . . . . . . . . . . . . . . . 
        `)
    for (let index = 0; index < 30; index++) {
        mainJumpRight.addAnimationFrame(img`
            . . . . f f f . . . . . f f . . 
            . . . f f 1 f f f f f f f 1 f . 
            . . f f f 1 1 1 1 1 1 1 1 1 f . 
            . f f f 1 1 f f 1 1 f f 1 1 f . 
            . f f 1 1 1 f f 1 1 f f 1 1 f . 
            . . f 1 1 1 1 1 f f 1 1 1 1 f . 
            . . f 1 1 1 1 1 1 1 1 1 1 1 f . 
            . . f f f f f f f f f f f f f . 
            . 1 1 1 f f f . . . f f f 1 1 1 
            . 1 f f f f f . . . f f f f f 1 
            . . f f f 1 f f f f 1 f f f f . 
            . . . f f 1 f . . f 1 f f . . . 
            . . . . 1 1 1 . . 1 1 1 . . . . 
            . . . . . . . . . . . . . . . . 
            . . . . . . . . . . . . . . . . 
            . . . . . . . . . . . . . . . . 
            `)
    }
}
sprites.onOverlap(SpriteKind.Player, SpriteKind.Coin, function (sprite, otherSprite) {
    otherSprite.destroy(effects.trail, 250)
    otherSprite.y += -3
    info.changeScoreBy(3)
    music.baDing.play()
})
function inicio_de_nivel (level: number) {
    effects.clouds.startScreenEffect()
    playerStartLocation = tiles.getTilesByType(assets.tile`aqui`)[0]
    tiles.placeOnTile(hueco_1, playerStartLocation)
    tiles.setTileAt(playerStartLocation, assets.tile`tile0`)
    CREACION_DE_ENEMIGOS()
    spawnGoals()
}
controller.A.onEvent(ControllerButtonEvent.Pressed, function () {
    dobles()
})
function jugador (player2: Sprite) {
    player2.ay = gravity
    scene.cameraFollowSprite(player2)
    controller.moveSprite(player2, 100, 0)
    player2.z = 5
    info.setLife(3)
    info.setScore(0)
}
function clearGame () {
    for (let value of sprites.allOfKind(SpriteKind.Bumper)) {
        value.destroy()
    }
    for (let value2 of sprites.allOfKind(SpriteKind.Coin)) {
        value2.destroy()
    }
    for (let value3 of sprites.allOfKind(SpriteKind.Goal)) {
        value3.destroy()
    }
    for (let value4 of sprites.allOfKind(SpriteKind.Flier)) {
        value4.destroy()
    }
}
function diseño_de_niveles (level: number) {
    clearGame()
    if (level == 0) {
        tiles.setTilemap(tilemap`level`)
    } else if (level == 1) {
        tiles.setTilemap(tilemap`level_6`)
    } else if (level == 2) {
        tiles.setTilemap(tilemap`level_0`)
    } else if (level == 3) {
        tiles.setTilemap(tilemap`level_2`)
    } else if (level == 4) {
        tiles.setTilemap(tilemap`level_1`)
    } else if (level == 5) {
        tiles.setTilemap(tilemap`level_3`)
    } else if (level == 6) {
        tiles.setTilemap(tilemap`level_5`)
    } else if (level == 7) {
        tiles.setTilemap(tilemap`level_4`)
    }
    inicio_de_nivel(level)
}
function vistas () {
    mainIdleLeft = animation.createAnimation(ActionKind.IdleLeft, 100)
    animation.attachAnimation(hueco_1, mainIdleLeft)
    mainIdleLeft.addAnimationFrame(img`
        . . . . . . . . . . . . . . . . 
        . . f f . . . . . f f f . . . . 
        . f 1 f f f f f f f 1 f f . . . 
        . f 1 1 1 1 1 1 1 1 1 f f f . . 
        . f 1 1 f f 1 1 f f 1 1 f f f . 
        . f 1 1 f f 1 1 f f 1 1 1 f f . 
        . f 1 1 1 1 f f 1 1 1 1 1 f . . 
        . f 1 1 1 1 1 1 1 1 1 1 1 f . . 
        . f f f f f f f f f f f f f . . 
        1 1 1 f f f . . . f f f 1 1 1 . 
        1 1 f f f f . . . f f f f 1 1 . 
        1 f f f f f f f f f f f f f 1 . 
        . . . f f f f f f f f f f . . . 
        . . . . f 1 f . . f 1 f . . . . 
        . . . . f 1 f . . f 1 f . . . . 
        . . . . 1 1 1 . . 1 1 1 . . . . 
        `)
    mainIdleRight = animation.createAnimation(ActionKind.IdleRight, 100)
    animation.attachAnimation(hueco_1, mainIdleRight)
    mainIdleRight.addAnimationFrame(img`
        . . . . . . . . . . . . . . . . 
        . . . . f f f . . . . . f f . . 
        . . . f f 1 f f f f f f f 1 f . 
        . . f f f 1 1 1 1 1 1 1 1 1 f . 
        . f f f 1 1 f f 1 1 f f 1 1 f . 
        . f f 1 1 1 f f 1 1 f f 1 1 f . 
        . . f 1 1 1 1 1 f f 1 1 1 1 f . 
        . . f 1 1 1 1 1 1 1 1 1 1 1 f . 
        . . f f f f f f f f f f f f f . 
        . 1 1 1 f f f . . . f f f 1 1 1 
        . 1 1 f f f f . . . f f f f 1 1 
        . 1 f f f f f f f f f f f f f 1 
        . . . f f f f f f f f f f . . . 
        . . . . f 1 f . . f 1 f . . . . 
        . . . . f 1 f . . f 1 f . . . . 
        . . . . 1 1 1 . . 1 1 1 . . . . 
        `)
}
function espectro_animacion () {
    flierFlying = animation.createAnimation(ActionKind.Flying, 100)
    flierFlying.addAnimationFrame(img`
        . . . f f f . . . . f f f . . . 
        . . . f c f . . . . f c f . . . 
        . . . f c c f f f f c c f . . . 
        . . . f c c c c c c c c f . . . 
        . . f c c c c c c c c c c f . . 
        f . f c f f f f f f f f c f . f 
        f f c c f 1 1 f f 1 1 f c c f f 
        f c c c f 1 1 1 1 1 1 f c c c f 
        f c c c f 1 1 f f 1 1 f c c c f 
        . f c c f f f f f f f f c c f . 
        . . f c c c c c c c c c c f . . 
        . . . f c c c c c c c c f . . . 
        . . . . f f f f f f f f . . . . 
        . . . . . f . . . . f . . . . . 
        . . . . . . . . . . . . . . . . 
        . . . . . . . . . . . . . . . . 
        `)
    flierFlying.addAnimationFrame(img`
        . . . . . . . . . . . . . . . . 
        . . . . . . . . . . . . . . . . 
        . . . f f f . . . . f f f . . . 
        . . . f c f . . . . f c f . . . 
        . . . f c c f f f f c c f . . . 
        . . . f c c c c c c c c f . . . 
        . . f c c c c c c c c c c f . . 
        . . f c f f f f f f f f c f . . 
        . f c c f 1 1 f f 1 1 f c c f . 
        f c c c f 1 1 1 1 1 1 f c c c f 
        f c c c f 1 1 f f 1 1 f c c c f 
        f f c c f f f f f f f f c c f f 
        f . f c c c c c c c c c c f . f 
        f . f f c c c c c c c c f . . . 
        . . . . f f f f f f f f . . . . 
        . . . . . f . . . . f . . . . . 
        `)
    flierFlying.addAnimationFrame(img`
        . . . . . . . . . . . . . . . . 
        . . . f f f . . . . f f f . . . 
        . . . f c f . . . . f c f . . . 
        . . . f c c f f f f c c f . . . 
        . . . f c c c c c c c c f . . . 
        . . f c c c c c c c c c c f . . 
        f . f c f f f f f f f f c f . f 
        f f c c f 1 1 f f 1 1 f c c f f 
        f c c c f 1 1 1 1 1 1 f c c c f 
        f c c c f 1 1 f f 1 1 f c c c f 
        f f c c f f f f f f f f c c f f 
        f . f c c c c c c c c c c f . f 
        . . . f c c c c c c c c f . . . 
        . . . . f f f f f f f f . . . . 
        . . . . . f . . . . f . . . . . 
        . . . . . . . . . . . . . . . . 
        `)
    flierIdle = animation.createAnimation(ActionKind.Idle, 100)
    flierIdle.addAnimationFrame(img`
        . . . . . . . . . . . . . . . . 
        . . . f f f . . . . f f f . . . 
        . . . f c f . . . . f c f . . . 
        . . . f c c f f f f c c f . . . 
        . . . f c c c c c c c c f . . . 
        . . f c c c c c c c c c c f . . 
        f . f c f f f f f f f f c f . f 
        f f c c f 1 1 f f 1 1 f c c f f 
        f c c c f 1 1 1 1 1 1 f c c c f 
        f c c c f 1 1 f f 1 1 f c c c f 
        f f c c f f f f f f f f c c f f 
        f . f c c c c c c c c c c f . f 
        . . . f c c c c c c c c f . . . 
        . . . . f f f f f f f f . . . . 
        . . . . . f . . . . f . . . . . 
        . . . . . . . . . . . . . . . . 
        `)
}
function CREACION_DE_ENEMIGOS () {
    // enemy that moves back and forth
    for (let value5 of tiles.getTilesByType(assets.tile`masa de carne`)) {
        bumper = sprites.create(assets.image`lqs`, SpriteKind.Bumper)
        tiles.placeOnTile(bumper, value5)
        tiles.setTileAt(value5, assets.tile`tile0`)
        bumper.ay = gravity
        if (Math.percentChance(50)) {
            bumper.vx = Math.randomRange(30, 60)
        } else {
            bumper.vx = Math.randomRange(-60, -30)
        }
    }
    // enemy that flies at player
    for (let value6 of tiles.getTilesByType(assets.tile`espectro`)) {
        flier = sprites.create(img`
            . . . . . . . . . . . . . . . . 
            . . . f f f . . . . f f f . . . 
            . . . f c f . . . . f c f . . . 
            . . . f c c f f f f c c f . . . 
            . . . f c c c c c c c c f . . . 
            . . f c c c c c c c c c c f . . 
            f . f c f f f f f f f f c f . f 
            f f c c f 1 1 f f 1 1 f c c f f 
            f c c c f 1 1 1 1 1 1 f c c c f 
            f c c c f 1 1 f f 1 1 f c c c f 
            f f c c f f f f f f f f c c f f 
            f . f c c c c c c c c c c f . f 
            . . . f c c c c c c c c f . . . 
            . . . . f f f f f f f f . . . . 
            . . . . . f . . . . f . . . . . 
            . . . . . . . . . . . . . . . . 
            `, SpriteKind.Flier)
        tiles.placeOnTile(flier, value6)
        tiles.setTileAt(value6, assets.tile`tile0`)
        animation.attachAnimation(flier, flierFlying)
        animation.attachAnimation(flier, flierIdle)
    }
    // enemy that moves back and forth
    for (let value5 of tiles.getTilesByType(assets.tile`wasa`)) {
        bumper = sprites.create(assets.image`slime`, SpriteKind.Bumper)
        tiles.placeOnTile(bumper, value5)
        tiles.setTileAt(value5, assets.tile`tile0`)
        bumper.ay = gravity
        if (Math.percentChance(50)) {
            bumper.vx = Math.randomRange(30, 60)
        } else {
            bumper.vx = Math.randomRange(-60, -30)
        }
    }
}
function animacion_de_abajo () {
    mainCrouchLeft = animation.createAnimation(ActionKind.CrouchLeft, 100)
    animation.attachAnimation(hueco_1, mainCrouchLeft)
    mainCrouchLeft.addAnimationFrame(img`
        . . . . . . . . . . . . . . . . 
        . . . . . . . . . . . . . . . . 
        . . . . . . . . . . . . . . . . 
        . . f f . . . . . f f f . . . . 
        . f 1 f f f f f f f 1 f f . . . 
        . f 1 1 1 1 1 1 1 1 1 f f f . . 
        . f 1 1 f f 1 1 f f 1 1 f f f . 
        . f 1 1 f f 1 1 f f 1 1 1 f f . 
        . f 1 1 1 1 f f 1 1 1 1 1 f . . 
        . f 1 1 1 1 1 1 1 1 1 1 1 f . . 
        . f f f f f f f f f f f f f . . 
        1 1 1 f f f . . . f f f 1 1 1 . 
        1 f f f f f . . . f f f f f 1 . 
        . f f f f 1 f f f f 1 f f f . . 
        . . . f f 1 f . . f 1 f f . . . 
        . . . . 1 1 1 . . 1 1 1 . . . . 
        `)
    mainCrouchRight = animation.createAnimation(ActionKind.CrouchRight, 100)
    animation.attachAnimation(hueco_1, mainCrouchRight)
    mainCrouchRight.addAnimationFrame(img`
        . . . . . . . . . . . . . . . . 
        . . . . . . . . . . . . . . . . 
        . . . . . . . . . . . . . . . . 
        . . . . f f f . . . . . f f . . 
        . . . f f 1 f f f f f f f 1 f . 
        . . f f f 1 1 1 1 1 1 1 1 1 f . 
        . f f f 1 1 f f 1 1 f f 1 1 f . 
        . f f 1 1 1 f f 1 1 f f 1 1 f . 
        . . f 1 1 1 1 1 f f 1 1 1 1 f . 
        . . f 1 1 1 1 1 1 1 1 1 1 1 f . 
        . . f f f f f f f f f f f f f . 
        . 1 1 1 f f f . . . f f f 1 1 1 
        . 1 f f f f f . . . f f f f f 1 
        . . f f f 1 f f f f 1 f f f f . 
        . . . f f 1 f . . f 1 f f . . . 
        . . . . 1 1 1 . . 1 1 1 . . . . 
        `)
}
sprites.onOverlap(SpriteKind.Player, SpriteKind.Flier, function (sprite, otherSprite) {
    info.changeLifeBy(-1)
    sprite.say("Ow!", invincibilityPeriod * 1.5)
    music.powerDown.play()
    pause(invincibilityPeriod * 1.5)
})
controller.down.onEvent(ControllerButtonEvent.Pressed, function () {
    if (!(hueco_1.isHittingTile(CollisionDirection.Bottom))) {
        hueco_1.vy += 80
    }
})
function INSTRUCCIONES () {
    game.setDialogFrame(img`
        . f f f f f f f f f f f f f . . 
        f f 1 1 1 1 1 1 1 1 1 1 1 f f . 
        f 1 1 f f f f f f f f f 1 1 f . 
        f 1 f f 1 1 1 1 1 1 1 f f 1 f . 
        f 1 f 1 1 1 1 1 1 1 1 1 f 1 f . 
        f 1 f 1 1 1 1 1 1 1 1 1 f 1 f . 
        f 1 f 1 1 1 1 1 1 1 1 1 f 1 f . 
        f 1 f 1 1 1 1 1 1 1 1 1 f 1 f . 
        f 1 f 1 1 1 1 1 1 1 1 1 f 1 f . 
        f 1 f 1 1 1 1 1 1 1 1 1 f 1 f . 
        f 1 f 1 1 1 1 1 1 1 1 1 f 1 f . 
        f 1 f f 1 1 1 1 1 1 1 f f 1 f . 
        f 1 1 f f f f f f f f f 1 1 f . 
        f f 1 1 1 1 1 1 1 1 1 1 1 f f . 
        . f f f f f f f f f f f f f . . 
        . . . . . . . . . . . . . . . . 
        `)
    game.setDialogCursor(img`
        . . . . . . . . . . . . . . . . 
        . . . . . . . . . . . . . . . . 
        . . . . . . . . . . . . . . . . 
        . . . . . . . . . . . . . . . . 
        . . . . . . . . . . . . . . . . 
        . . . . . . . . . . . . . . . . 
        . . . . . . . . . . . . . . . . 
        . . . . . . . . . . . . . . . . 
        . . . . . . . . . . . . . . . . 
        . . . . . . . . . . . . . . . . 
        . . . . . . . . . . . . . . . . 
        . . . . . . . . . . . . . . . . 
        . . . . . . . . . . . . . . . . 
        . . . . . . . . . . . . . . . . 
        . . . . . . . . . . . . . . . . 
        . . . . . . . . . . . . . . . . 
        `)
    instrucciones("*Bienvenido al mundo \"Hueco\"*")
    instrucciones("Para brincar pulsa el boton \"A\"")
    instrucciones("Doble brinco mantener presionado el boton \"A\"")
}
function cuando_sig_nivel () {
    return currentLevel != levelCount
}
function animacion_de_mov_i_y_d () {
    mainRunLeft = animation.createAnimation(ActionKind.RunningLeft, 100)
    animation.attachAnimation(hueco_1, mainRunLeft)
    mainRunLeft.addAnimationFrame(img`
        . . . . . . . . . . . . . . . . 
        . . . . . . f f f . . . . . . . 
        . . . f f f f 1 f f f f f . . . 
        . . . f 1 1 1 1 1 1 f f f . . . 
        . . . f 1 f f 1 1 1 1 f f . . . 
        . . . f 1 f f 1 1 1 1 1 f . . . 
        . . . f f 1 1 1 1 1 1 1 f . . . 
        . . . f 1 1 1 1 1 1 1 1 f . . . 
        . . . f f f f f f f f f f . . . 
        . . . . . f f f f 1 f f f . . . 
        . . . . . . f 1 1 1 f f f . . . 
        . . . . . . f 1 f f f f . . . . 
        . . . . . . f f f f f . . . . . 
        . . . . . . . f 1 f . . . . . . 
        . . . . . . . f 1 f . . . . . . 
        . . . . . . . 1 1 1 . . . . . . 
        `)
    mainRunLeft.addAnimationFrame(img`
        . . . . . . . . . . . . . . . . 
        . . . . . f f f . . . . . . . . 
        . . f f f f 1 f f f f f . . . . 
        . . f 1 1 1 1 1 1 f f f . . . . 
        . . f 1 f f 1 1 1 1 f f . . . . 
        . . f 1 f f 1 1 1 1 1 f . . . . 
        . . f f 1 1 1 1 1 1 1 f . . . . 
        . . f 1 1 1 1 1 1 1 1 f . . . . 
        . . f f f f f f f f f f . . . . 
        . . . . f f f f 1 f f f . . . . 
        . . . . f 1 1 1 1 f f f . . . . 
        . . . . . f f f f f f . . . . . 
        . . . . . f f f f . . . . . . . 
        . . . . . f 1 f . . . . . . . . 
        . . . . . f 1 f . . . . . . . . 
        . . . . . 1 1 1 . . . . . . . . 
        `)
    mainRunRight = animation.createAnimation(ActionKind.RunningRight, 100)
    animation.attachAnimation(hueco_1, mainRunRight)
    mainRunRight.addAnimationFrame(img`
        . . . . . . . . . . . . . . . . 
        . . . . . . . . f f f . . . . . 
        . . . . f f f f f 1 f f f f . . 
        . . . . f f f 1 1 1 1 1 1 f . . 
        . . . . f f 1 1 1 1 f f 1 f . . 
        . . . . f 1 1 1 1 1 f f 1 f . . 
        . . . . f 1 1 1 1 1 1 1 f f . . 
        . . . . f 1 1 1 1 1 1 1 1 f . . 
        . . . . f f f f f f f f f f . . 
        . . . . f f f 1 f f f f . . . . 
        . . . . f f f 1 1 1 f . . . . . 
        . . . . . f f f f 1 f . . . . . 
        . . . . . . f f f f f . . . . . 
        . . . . . . . f 1 f . . . . . . 
        . . . . . . . f 1 f . . . . . . 
        . . . . . . . 1 1 1 . . . . . . 
        `)
    mainRunRight.addAnimationFrame(img`
        . . . . . . . . . . . . . . . . 
        . . . . . . . . . f f f . . . . 
        . . . . . f f f f f 1 f f f f . 
        . . . . . f f f 1 1 1 1 1 1 f . 
        . . . . . f f 1 1 1 1 f f 1 f . 
        . . . . . f 1 1 1 1 1 f f 1 f . 
        . . . . . f 1 1 1 1 1 1 1 f f . 
        . . . . . f 1 1 1 1 1 1 1 1 f . 
        . . . . . f f f f f f f f f f . 
        . . . . . f f f 1 f f f f . . . 
        . . . . . f f f 1 1 1 1 f . . . 
        . . . . . . f f f f f f . . . . 
        . . . . . . . . f f f f . . . . 
        . . . . . . . . . f 1 f . . . . 
        . . . . . . . . . f 1 f . . . . 
        . . . . . . . . . 1 1 1 . . . . 
        `)
}
function Accion_animaciones () {
    animaciones_d_hollow()
    ojos_nomedas()
    espectro_animacion()
}
function instrucciones (text: string) {
    game.showLongText(text, DialogLayout.Bottom)
    music.baDing.play()
    info.changeScoreBy(1)
}
function ojos_nomedas () {
    coinAnimation = animation.createAnimation(ActionKind.Idle, 150)
    coinAnimation.addAnimationFrame(img`
        . . . . . . . . . . . . . . . . 
        . . . . . . . . . . . . . . . . 
        . . . . . . . . . . . . . . . . 
        . . . . . . . . . . . . . . . . 
        . . . . . . . . . . . . . . . . 
        . . . . . . . . . . . . . . . . 
        . . . . . . . . . . . . . . . . 
        . . . . . . . . . . . . . . . . 
        . . . . . . . . . . . . . . . . 
        . . . . . . . . . . . . . . . . 
        . . . . . . . . . . . . . . . . 
        . . . . . . . . . . . . . . . . 
        . . . . . . . . . . . . . . . . 
        . . . . . . . . . . . . . . . . 
        . . . . . . . . . . . . . . . . 
        . . . . . . . . . . . . . . . . 
        `)
    coinAnimation.addAnimationFrame(img`
        . . . . . . . . . . . . . . . . 
        . . . . . . . . . . . . . . . . 
        . . . . . . . . . . . . . . . . 
        . . . . . . . . . . . . . . . . 
        . . . . . . f f f f . . . . . . 
        . . . . f f f 1 1 f f f . . . . 
        . . . f 1 1 1 f f 1 1 1 f . . . 
        . . . f 1 1 1 f f 1 1 1 f . . . 
        . . . f 1 1 1 f f 1 1 1 f . . . 
        . . . f 1 1 1 f f 1 1 1 f . . . 
        . . . . f f f 1 1 f f f . . . . 
        . . . . . . f f f f . . . . . . 
        . . . . . . . . . . . . . . . . 
        . . . . . . . . . . . . . . . . 
        . . . . . . . . . . . . . . . . 
        . . . . . . . . . . . . . . . . 
        `)
    coinAnimation.addAnimationFrame(img`
        . . . . . . . . . . . . . . . . 
        . . . . . . . . . . . . . . . . 
        . . . . . . . . . . . . . . . . 
        . . . . . . . . . . . . . . . . 
        . . . . . . . . . . . . . . . . 
        . . . . . . . . . . . . . . . . 
        . . . . . . f f f f . . . . . . 
        . . . f f f f 1 1 f f f f . . . 
        . . . f 1 1 1 f f 1 1 1 f . . . 
        . . . f 1 1 1 f f 1 1 1 f . . . 
        . . . f f f f 1 1 f f f f . . . 
        . . . . . . f f f f . . . . . . 
        . . . . . . . . . . . . . . . . 
        . . . . . . . . . . . . . . . . 
        . . . . . . . . . . . . . . . . 
        . . . . . . . . . . . . . . . . 
        `)
    coinAnimation.addAnimationFrame(img`
        . . . . . . . . . . . . . . . . 
        . . . . . . . . . . . . . . . . 
        . . . . . . . . . . . . . . . . 
        . . . . . . . . . . . . . . . . 
        . . . . . . . . . . . . . . . . 
        . . . . . . . . . . . . . . . . 
        . . . . . . . . . . . . . . . . 
        . . . . . . . . . . . . . . . . 
        . . . . . . f f f f . . . . . . 
        . . . f f f f 1 1 f f f f . . . 
        . . . f f f f 1 1 f f f f . . . 
        . . . . . . f f f f . . . . . . 
        . . . . . . . . . . . . . . . . 
        . . . . . . . . . . . . . . . . 
        . . . . . . . . . . . . . . . . 
        . . . . . . . . . . . . . . . . 
        `)
    coinAnimation.addAnimationFrame(img`
        . . . . . . . . . . . . . . . . 
        . . . . . . . . . . . . . . . . 
        . . . . . . . . . . . . . . . . 
        . . . . . . . . . . . . . . . . 
        . . . . . . . . . . . . . . . . 
        . . . . . . . . . . . . . . . . 
        . . . . . . . . . . . . . . . . 
        . . . . . . . . . . . . . . . . 
        . . . . . . . . . . . . . . . . 
        . . . . . . . f f . . . . . . . 
        . . . f f f f 1 1 f f f f . . . 
        . . . f f f f 1 1 f f f f . . . 
        . . . . . . . f f . . . . . . . 
        . . . . . . . . . . . . . . . . 
        . . . . . . . . . . . . . . . . 
        . . . . . . . . . . . . . . . . 
        `)
    coinAnimation.addAnimationFrame(img`
        . . . . . . . . . . . . . . . . 
        . . . . . . . . . . . . . . . . 
        . . . . . . . . . . . . . . . . 
        . . . . . . . . . . . . . . . . 
        . . . . . . . . . . . . . . . . 
        . . . . . . . . . . . . . . . . 
        . . . . . . . . . . . . . . . . 
        . . . . . . . . . . . . . . . . 
        . . . . . . f f f f . . . . . . 
        . . . f f f f 1 1 f f f f . . . 
        . . . f f f f 1 1 f f f f . . . 
        . . . . . . f f f f . . . . . . 
        . . . . . . . . . . . . . . . . 
        . . . . . . . . . . . . . . . . 
        . . . . . . . . . . . . . . . . 
        . . . . . . . . . . . . . . . . 
        `)
    coinAnimation.addAnimationFrame(img`
        . . . . . . . . . . . . . . . . 
        . . . . . . . . . . . . . . . . 
        . . . . . . . . . . . . . . . . 
        . . . . . . . . . . . . . . . . 
        . . . . . . f f f f . . . . . . 
        . . . . f f f 1 1 f f f . . . . 
        . . . f 1 1 1 f f 1 1 1 f . . . 
        . . . f 1 1 1 f f 1 1 1 f . . . 
        . . . f 1 1 1 f f 1 1 1 f . . . 
        . . . f 1 1 1 f f 1 1 1 f . . . 
        . . . . f f f 1 1 f f f . . . . 
        . . . . . . f f f f . . . . . . 
        . . . . . . . . . . . . . . . . 
        . . . . . . . . . . . . . . . . 
        . . . . . . . . . . . . . . . . 
        . . . . . . . . . . . . . . . . 
        `)
}
function spawnGoals () {
    for (let value7 of tiles.getTilesByType(assets.tile`ojojojojojojoj`)) {
        coin = sprites.create(img`
            . . . . . . . . . . . . . . . . 
            . . . . . . . . . . . . . . . . 
            . . . . . . . . . . . . . . . . 
            . . . . . . . . . . . . . . . . 
            . . . . . . . . . . . . . . . . 
            . . . . . . . . . . . . . . . . 
            . . . . . . . . . . . . . . . . 
            . . . . . . . . . . . . . . . . 
            . . . . . . . . . . . . . . . . 
            . . . . . . . . . . . . . . . . 
            . . . . . . . . . . . . . . . . 
            . . . . . . . . . . . . . . . . 
            . . . . . . . . . . . . . . . . 
            . . . . . . . . . . . . . . . . 
            . . . . . . . . . . . . . . . . 
            . . . . . . . . . . . . . . . . 
            `, SpriteKind.Coin)
        tiles.placeOnTile(coin, value7)
        animation.attachAnimation(coin, coinAnimation)
        animation.setAction(coin, ActionKind.Idle)
        tiles.setTileAt(value7, assets.tile`tile0`)
    }
}
let heroFacingLeft = false
let coin: Sprite = null
let coinAnimation: animation.Animation = null
let mainRunRight: animation.Animation = null
let mainRunLeft: animation.Animation = null
let mainCrouchRight: animation.Animation = null
let mainCrouchLeft: animation.Animation = null
let flier: Sprite = null
let bumper: Sprite = null
let flierIdle: animation.Animation = null
let flierFlying: animation.Animation = null
let mainIdleRight: animation.Animation = null
let mainIdleLeft: animation.Animation = null
let playerStartLocation: tiles.Location = null
let mainJumpRight: animation.Animation = null
let mainJumpLeft: animation.Animation = null
let doubleJumpSpeed = 0
let canDoubleJump = false
let currentLevel = 0
let levelCount = 0
let gravity = 0
let pixelsToMeters = 0
let invincibilityPeriod = 0
let hueco_1: Sprite = null
hueco_1 = sprites.create(img`
    . . . . . . . . . . . . . . . . 
    . . . . f f f . . . . . f f . . 
    . . . f f 1 f f f f f f f 1 f . 
    . . f f f 1 1 1 1 1 1 1 1 1 f . 
    . f f f 1 1 f f 1 1 f f 1 1 f . 
    . f f 1 1 1 f f 1 1 f f 1 1 f . 
    . . f 1 1 1 1 1 f f 1 1 1 1 f . 
    . . f 1 1 1 1 1 1 1 1 1 1 1 f . 
    . . f f f f f f f f f f f f f . 
    . 1 1 1 f f f . . . f f f 1 1 1 
    . 1 1 f f f f . . . f f f f 1 1 
    . 1 f f f f f f f f f f f f f 1 
    . . . f f f f f f f f f f . . . 
    . . . . f 1 f . . f 1 f . . . . 
    . . . . f 1 f . . f 1 f . . . . 
    . . . . 1 1 1 . . 1 1 1 . . . . 
    `, SpriteKind.Player)
// how long to pause between each contact with a
// single enemy
invincibilityPeriod = 600
pixelsToMeters = 30
gravity = 9.81 * pixelsToMeters
scene.setBackgroundImage(assets.image`fonhdp`)
Accion_animaciones()
jugador(hueco_1)
levelCount = 8
currentLevel = 0
diseño_de_niveles(currentLevel)
INSTRUCCIONES()
// set up hero animations
game.onUpdate(function () {
    if (hueco_1.vx < 0) {
        heroFacingLeft = true
    } else if (hueco_1.vx > 0) {
        heroFacingLeft = false
    }
    if (hueco_1.isHittingTile(CollisionDirection.Top)) {
        hueco_1.vy = 0
    }
    if (controller.down.isPressed()) {
        if (heroFacingLeft) {
            animation.setAction(hueco_1, ActionKind.CrouchLeft)
        } else {
            animation.setAction(hueco_1, ActionKind.CrouchRight)
        }
    } else if (hueco_1.vy < 20 && !(hueco_1.isHittingTile(CollisionDirection.Bottom))) {
        if (heroFacingLeft) {
            animation.setAction(hueco_1, ActionKind.JumpingLeft)
        } else {
            animation.setAction(hueco_1, ActionKind.JumpingRight)
        }
    } else if (hueco_1.vx < 0) {
        animation.setAction(hueco_1, ActionKind.RunningLeft)
    } else if (hueco_1.vx > 0) {
        animation.setAction(hueco_1, ActionKind.RunningRight)
    } else {
        if (heroFacingLeft) {
            animation.setAction(hueco_1, ActionKind.IdleLeft)
        } else {
            animation.setAction(hueco_1, ActionKind.IdleRight)
        }
    }
})
// Flier movement
game.onUpdate(function () {
    for (let value8 of sprites.allOfKind(SpriteKind.Flier)) {
        if (Math.abs(value8.x - hueco_1.x) < 60) {
            if (value8.x - hueco_1.x < -5) {
                value8.vx = 25
            } else if (value8.x - hueco_1.x > 5) {
                value8.vx = -25
            }
            if (value8.y - hueco_1.y < -5) {
                value8.vy = 25
            } else if (value8.y - hueco_1.y > 5) {
                value8.vy = -25
            }
            animation.setAction(value8, ActionKind.Flying)
        } else {
            value8.vy = -20
            value8.vx = 0
            animation.setAction(value8, ActionKind.Idle)
        }
    }
})
// Reset double jump when standing on wall
game.onUpdate(function () {
    if (hueco_1.isHittingTile(CollisionDirection.Bottom)) {
        canDoubleJump = true
    }
})
// bumper movement
game.onUpdate(function () {
    for (let value9 of sprites.allOfKind(SpriteKind.Bumper)) {
        if (value9.isHittingTile(CollisionDirection.Left)) {
            value9.vx = Math.randomRange(30, 60)
        } else if (value9.isHittingTile(CollisionDirection.Right)) {
            value9.vx = Math.randomRange(-60, -30)
        }
    }
})
