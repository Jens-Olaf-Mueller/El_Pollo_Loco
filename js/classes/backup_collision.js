    /**
     * handle all enemy-collisions ANCHOR Enemycollision
     */
    function checkEnemyCollisions () {        
        this.level.Enemies.forEach((enemy) => {
            if (enemy.isAlive()) {          
                if (this.Pepe.isColliding(enemy) == COLL_TOP) {
                    if (this.Pepe.isAboveGround()) {
                        if (enemy instanceof Chicken || enemy instanceof Chicklet) {
                            // killed a friendly chicken ?!
                            if (enemy.isFriendly) {
                                for (let i = 0; i < this.levelNo * 2; i++) {
                                    this.level.createChicklets(1, enemy.X + random(70,300))
                                }                            
                            }
                            Sounds.play(enemy.type);
                            enemy.remove('dead');                        
                            this.enlargeChickens(parseInt(gameSettings.chickenEnlargement));
                            this.Pepe.score += this.levelNo * 10;
                            
                        } else if (enemy instanceof Spider || enemy instanceof Scorpion) { 
                            Sounds.play('splat');
                            this.Pepe.score += parseInt(this.levelNo * enemy.damage);
                            enemy.remove('dead');
                        }
                    } else if (!enemy.isFriendly) {
                        // if we met a snake and can shoot it...
                        if (enemy instanceof Snake && this.keyboard.SPACE && this.Pepe.canShoot()) {
                            this.Pepe.shoot();
                            if (this.Pepe.hitSuccessful()) {
                                this.Pepe.score += parseInt(this.levelNo * enemy.damage);
                                enemy.remove('dead');
                            }
                        } else {
                            this.Pepe.hit(enemy.damage);
                            if (!this.Pepe.isDead()) Sounds.play('ouch');
                        }                    
                    }
                    // play sounds of bees and snakes... 
                    if (enemy instanceof Bees || enemy instanceof Snake) Sounds.play(enemy.type);
                }
            }
        });
    }