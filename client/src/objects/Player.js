class Player {

	constructor(game, x, y){
		this.game = game
		this.sprite = this.game.add.sprite(x, y, 'chars')
		this.game.physics.enable(this.sprite, Phaser.Physics.ARCADE)
    	
//    	this.sprite.angle = 90;
//    	this.angle = 90;
//    	this.mod = 3;
//    	this.sprite.body.setSize(1,1,0,0);

        this.sprite.body.bounce.y = 0.2
        this.sprite.body.gravity.y = 700
        this.sprite.anchor.setTo(0.5)
        this.sprite.body.collideWorldBounds = false
        this.sprite.frame = 4
        this.sprite.animations.add('left', [4, 5], 10, true)
        this.sprite.animations.add('right', [4, 5], 10, true)
        this.maxSpeed = 240
        this.acceleration = 30
        this.canJump = true

        //this.game.input.mouse.capture = true;#

	}

	update(cursors, hitPlatform) {
        if (cursors.left.isDown) {       
            this.sprite.body.velocity.x -= this.acceleration
            if (this.sprite.body.velocity.x < -this.maxSpeed) {
            	this.sprite.body.velocity.x = -this.maxSpeed
            }
            this.sprite.animations.play('left')
            this.sprite.scale.setTo(1,1)
        } 
        else if (cursors.right.isDown) {
            this.sprite.body.velocity.x += this.acceleration
            if (this.sprite.body.velocity.x > this.maxSpeed) {
            	this.sprite.body.velocity.x = this.maxSpeed
            }
        	this.sprite.animations.play('right')
        	this.sprite.scale.setTo(-1,1)
        }
        else {
        	this.sprite.body.velocity.x = 0
        	this.sprite.animations.stop()
        	this.sprite.frame = 4
        }

        if (this.sprite.body.blocked.down) {
        	this.canJump = true
        }
        if (cursors.up.isDown) {
        	if (this.canJump && hitPlatform) {
        		this.canJump = false
        		this.sprite.body.velocity.y = -270
        	}
        }


	}

	updateMouse() {
		//this.game.physics.arcade.moveToPointer(this.sprite, 1400);
		this.sprite.x = this.game.input.x
		this.sprite.y = this.game.input.y


		if (this.game.input.activePointer.leftButton.isDown) {
			this.angle -= this.mod
			this.sprite.angle = this.angle
		}
		else if (this.game.input.activePointer.rightButton.isDown) {
			this.angle += this.mod
			this.sprite.angle =this.angle
		}

	}

}


export default Player;