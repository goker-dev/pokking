window.requestAnimationFrame = window.requestAnimationFrame
    || window.mozRequestAnimationFrame
    || window.webkitRequestAnimationFrame
    || window.msRequestAnimationFrame
    || function (f) {
        return setTimeout(f, 1000 / 60)
    } // simulate calling code 60

window.cancelAnimationFrame = window.cancelAnimationFrame
    || window.mozCancelAnimationFrame
    || function (requestID) {
        clearTimeout(requestID)
    } //fall back

let W, H, log = {}, root = '/game', board, images, G, ground, buffer, speed, map, king, eggs, aliens;

class Game {
    constructor(container, screenWidth, screenHeight) {
        console.log('New Game');
        log = {};
        this.FPS = 32;
        this.FRAME = 0;
        this.canvas = document.createElement('canvas');
        this.engine = this.canvas.getContext("2d");
        W = screenWidth;
        H = screenHeight;
        $('#game').css({width: W, height: H, overflow: 'hidden'});
        G = 1; // Gravity
        ground = H - 30;
        buffer = W / 2;
        speed = 8;
        images = {};
        eggs = [];
        aliens = [];

        this.time = new Date().getTime();
        this.chapters = ['/maps/chapter-001.json', '/maps/chapter-002.json'];


        //console.log('Initialize', this);

        this.canvas.setAttribute('width', W.toString());
        this.canvas.setAttribute('height', H.toString());
        $(container).html('').append(this.canvas);

        this.input = new Input();
        if (this.isTouchDevice())
            this.gamePad = new VirtualGamePad(this.canvas, 100, 100);

        log.keydown = [];
        log.keyup = [];
        log.score = 0;
        log.time = 0;


        $('#board').attr('data', root + '/images/board.svg')
            .on('load', (e) => {
                let svg = e.target.contentDocument;
                board = {
                    humans: svg.getElementById('humans'),
                    journey: svg.getElementById('journey'),
                    aliens: svg.getElementById('aliens'),
                    eggs: svg.getElementById('eggs')
                };
                board.humans.innerHTML = "0";
                board.aliens.innerHTML = "0";
                board.eggs.innerHTML = "0";
                //this.item = new GameItem(50, 50, 50, 50);
                map = new Map(0, 0, W, H);
                this.background = new Background(0, 0, W, H);
                king = new King(100, 100, 110, 120);

                Object.assign(images, Map.images());
                Object.assign(images, Background.images());
                Object.assign(images, King.images());
                Object.assign(images, Egg.images());
                Object.assign(images, Alien.images());
                Object.assign(images, VirtualGamePad.images());

                this.preload().then((value) => {
                    images = {}
                    for (const i in value)
                        Object.assign(images, value[i]);
                    console.log('All images are loaded!');
                    map.init(root + this.chapters[0]);
                    this.background.init();
                    king.init();
                    this.update();
                }, reason => {
                    console.log('images load error', reason);
                });

            });
    }

    isTouchDevice() {
        try {
            document.createEvent("TouchEvent");
            return true;
        } catch (e) {
            return false;
        }
    }

    preload() {
        const promises = [];
        Object.keys(images).map((key, index) => {
            let item = images[key];
            promises.push(new Promise((resolve, reject) => {
                    let img = new Image();
                    img.onload = () => resolve({[key]: img});
                    img.onerror = () => reject({[key]: item});
                    img.src = root + item;
                })
            );
        });
        return Promise.all(promises);
    }

    update() {
        if (this.gamePad)
            this.gamePad.update(this.input);

        this.engine.clearRect(0, 0, W, H);
        this.FRAME = (this.FRAME + 1) % this.FPS;
        let horizontal = this.input.getHorizontal();
        let vertical = this.input.getVertical();
        let fire = this.input.getFire();

        this.background.update(this.engine, this.FRAME, horizontal, vertical, fire);
        map.update(this.engine, this.FRAME, horizontal, vertical, fire);
        king.update(this.engine, this.FRAME, horizontal, vertical, fire);
        //this.item.update(this.engine, this.FRAME, horizontal, vertical, fire);
        if (this.gamePad)
            this.gamePad.render(this.engine);

        if (map.isEnd) {
            this.input.removeEventListener();
        } else {
            requestAnimationFrame(() => {
                this.update();
            });
        }
    }
}

class Input {
    constructor() {
        this.keys = [];
        this.keyDownBound = (e) => this.keyDown(e);
        this.keyUpBound = (e) => this.keyUp(e);
        this.addEventListener()
    }

    addEventListener() {
        document.addEventListener('keydown', this.keyDownBound);
        document.addEventListener('keyup', this.keyUpBound);
    }

    removeEventListener() {
        for (let i in this.keys)
            this.keys[i] = false;
        document.removeEventListener('keydown', this.keyDownBound);
        document.removeEventListener('keyup', this.keyUpBound);
    }

    keyDown(e) {
        if (!this.keys[e.code]) {
            log.keydown.push({
                code: e.code,
                key: this.keys[e.code],
                timestamp: new Date().getTime()
            });
        }
        this.keys[e.code] = true;
    }

    keyUp(e) {
        if (this.keys[e.code]) {
            log.keyup.push({
                code: e.code,
                key: this.keys[e.code],
                timestamp: new Date().getTime()
            });
        }
        this.keys[e.code] = false;
    }

    getHorizontal() {
        let r = this.keys['ArrowRight'];
        let l = this.keys['ArrowLeft'];
        return r && l ? 0 : r ? 1 : l ? -1 : 0;
    }

    getVertical() {
        let u = this.keys['ArrowUp'];
        let d = this.keys['ArrowDown'];
        return u && d ? 0 : d ? 1 : u ? -1 : 0;
    }

    getFire() {
        return this.keys['Space'];
    }
}

class VirtualGamePad {
    constructor(canvas, w, h) {
        this.w = w;
        this.h = h;
        this.left = 20;
        this.right = W - 10 - w;
        this.bottom = H - 20 - h;
        canvas.addEventListener('touchstart', (e) => {
            e.preventDefault();
            this.clientX = e.targetTouches[0].pageX;
            this.clientY = e.targetTouches[0].pageY;
            this.attackX = e.targetTouches[1] ? e.targetTouches[1].pageX : e.targetTouches[0].pageX;
            this.attackY = e.targetTouches[1] ? e.targetTouches[1].pageY : e.targetTouches[0].pageY;
        });
        canvas.addEventListener('touchend', (e) => {
            e.preventDefault();
            this.clientX = 0;
            this.clientY = 0;
            this.attackX = 0;
            this.attackY = 0;
        });
        canvas.addEventListener('touchmove', (e) => {
            e.preventDefault();
            this.clientX = e.targetTouches[0].pageX;
            this.clientY = e.targetTouches[0].pageY;
            this.attackX = e.targetTouches[1] ? e.targetTouches[1].pageX : e.targetTouches[0].pageX;
            this.attackY = e.targetTouches[1] ? e.targetTouches[1].pageY : e.targetTouches[0].pageY;
        });
        window.addEventListener('deviceorientation', (e) => {
            e.preventDefault();
            this.goRight = e.beta > 5;
            this.goLeft = e.beta < -5;
        });
        this.direction = 0;
        this.attack = 500;
    }

    isLeft() {
        return this.goLeft;
    }

    isRight() {
        return this.goRight;
    }

    isUp() {
        return this.clientX > this.left && this.clientX < this.left + this.w && this.clientY > this.bottom && this.clientY < this.bottom + this.h
    }

    // isDown() {
    //     return this.clientX > this.left + this.w / 3 && this.clientX < this.left + this.w * 2 / 3 && this.clientY > this.bottom + this.h / 2 && this.clientY < this.bottom + this.h
    // }

    isAttack() {
        return this.attackX > this.right && this.attackX < this.right + this.w && this.attackY > this.bottom && this.attackY < this.bottom + this.h
    }

    static images() {
        return {"controllers": "/images/controllers.png"};
    }

    update(input) {
        this.direction = 0;
        input.keys['ArrowRight'] = false;
        input.keys['ArrowLeft'] = false;
        input.keys['ArrowUp'] = false;
        input.keys['ArrowDown'] = false;
        input.keys['Space'] = false;
        if (this.isRight()) {
            //console.log('RIGHT')
            input.keys['ArrowRight'] = true;
        }
        if (this.isLeft()) {
            //console.log('LEFT');
            input.keys['ArrowLeft'] = true;
        }
        if (this.isUp()) {
            //console.log('UP');
            this.direction = 100
            input.keys['ArrowUp'] = true;
        }
        // if (this.isDown()) {
        //     console.log('DOWN');
        //     this.direction = 300
        //     input.keys['ArrowDown'] = true;
        // }
        if (this.isAttack()) {
            //console.log('ATTACK');
            this.attack = 600
            input.keys['Space'] = true;
        } else {
            this.attack = 500
        }
    }

    render(engine) {

        engine.drawImage(images['controllers'], this.direction, 0, 100, 100, this.left, this.bottom, this.w, this.h);
        engine.drawImage(images['controllers'], this.attack, 0, 100, 100, this.right, this.bottom, this.w, this.h);
    }
}

class GameItem {
    constructor(x, y, w, h) {
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
        this.color = "rgba(11,11,255,1)";
    }

    update(engine, frame, horizontal, vertical, fire) {
        this.x += speed * horizontal;
        this.y += speed * vertical;
        this.color = fire ? "rgba(255,11,11,1)" : "rgba(11,11,255,1)";
        this.render(engine);
    }

    render(engine) {
        engine.beginPath();
        engine.rect(this.x, this.y, this.w, this.h);
        engine.fillStyle = this.color;
        engine.fill();
        engine.closePath();
    }
}

class Background extends GameItem {
    constructor(x, y, w, h) {
        super(x, y, w, h);
        this.i = 0;
        this.timer = 0;
    }

    static images() {
        return {"background0": "/images/bg-default-1.jpg", "background1": "/images/bg-default-2.jpg"};
    }

    init() {
        this.bg = images['background0'];
        let r = Math.max(this.w / this.bg.width, this.h / this.bg.height);
        this.dw = this.bg.width * r;
        this.dh = this.bg.height * r;
        this.x = Math.abs(Math.min(((this.w - this.dw) / 2), 0));
        this.y = Math.abs(Math.min(this.h - this.dh, 0));
        //console.log('background.loaded', this.w, this.h, this.dw, this.dh, r, this.x, this.y);
    }

    update(engine, frame, horizontal, vertical, fire) {
        if (!king.stop && !map.isEnd && !map.isStart && (horizontal != 0) && king.isInBuffer()) {
            if (!this.timer) {
                this.i = (this.i + 1) % 2;
            }
            this.timer = (this.timer + 1) % 3;
        }
        this.render(engine)
    }

    render(engine) {
        engine.drawImage(images['background' + this.i], this.x, this.y, this.bg.width, this.bg.height, 0, 0, this.dw, this.dh);
    }
}

class Map extends GameItem {
    constructor(x, y, w, h) {
        super(x, y, w, h);
        this.i = 0;
        this.timer = 0;
        this.humans = 0;
        this.eggs = [];
        this.aliens = [];
    }

    static images() {
        return {"ground": "/images/ground.png", "landscape": "/images/landscape.png", "flags": "/images/flags.png"};
    }

    init(chapter) {
        $.getJSON(chapter, (data) => {
            let buffer = W / 2;
            ground = H - 30;

            log.map = data;
            //console.log('Map init', data);
            eggs, aliens = [];
            this.title = data.title;
            this.x = buffer;
            this.w = data.journey;// + W;
            this.step = 1;//data.journey / this.w;
            this.buffer = (buffer / this.step) >> 0;
            this.humans = data.humans;
            this.maxTime = data.time;
            //add aliens on end of the map as count of  non-broken eggs in previous chapters
            this.aliens = [];
            for (let i in this.eggs) {
                this.aliens.push({x: this.w, y: ground, ammo: 1});
            }
            this.eggs = [];
            for (let i in data.eggs) {
                this.eggs.push({x: data.eggs[i].location, y: ground - 50, w: 50, h: 50});
            }
            for (let i in data.aliens) {
                this.aliens.push({x: data.aliens[i].location, y: ground, w: 100, h: 150, ammo: data.aliens[i].ammo});
            }
            for (let i in this.eggs) {
                eggs[i] = new Egg(this.eggs[i].x, this.eggs[i].y, this.eggs[i].w, this.eggs[i].h);
            }
            for (let i in this.aliens) {
                aliens[i] = new Alien(this.aliens[i].x, this.aliens[i].y, this.aliens[i].w, this.aliens[i].h, this.aliens[i].ammo);
            }
            this.startTime = new Date().getTime();
            log.start = this.startTime;
            //console.log('background.loaded', this.w, this.h, this.dw, this.dh, r, this.x, this.y);
            //console.log('EGGS', this.eggs, eggs);
            //console.log('ALIENS', this.aliens, aliens);
        });
    }

    update(engine, frame, horizontal, vertical, fire) {
        let buffer = W / 2;
        if (!king.stop && !this.isEnd && horizontal > 0)
            if (-this.x < (this.w - buffer)) {
                this.x -= speed;
                king.buffer = Math.max(king.buffer, king.journey - this.buffer);
            } else this.x = -(this.w - buffer);
        if (!king.stop && !this.isStart && horizontal < 0 && king.isInBuffer()) {
            //console.log('this.x', this.x)
            if (this.x - buffer < 0) {
                this.x += speed;
            }
        }

        king.journey = (Math.abs(this.x - buffer) * this.step) >> 0;
        this.isEnd = (king.journey == this.w);
        if (this.isEnd && !this.finished) {
            this.finished = true;
            this.finishTime = new Date().getTime();
            log.finish = this.finishTime;
            log.eggs = eggs.length;
            log.aliens = aliens.length;
            log.score = board.humans.innerHTML;
            log.time = this.startToFinish();
            //console.log('FINISH', this.startTime, this.finishTime, this.startToFinish(), $('#score'));
            //console.log('LOG', log);
            //$('#log').val(JSON.stringify(log));
            $('#message').addClass('text-center text-warning').html('You saved <strong>' + board.humans.innerHTML + '</strong> people.');
            $('#score').modal({backdrop: 'static', keyboard: false}).modal('show')
        }
        this.isStart = (king.journey == 0);
        board.humans.innerHTML = this.humansCounter();
        board.eggs.innerHTML = eggs.length;
        board.aliens.innerHTML = aliens.length;

        this.render(engine);
        // eggs and aliens are must be rendered after the map;
        for (let i in eggs) {
            eggs[i].x = this.x + eggs[i].distance;
            eggs[i].update(i, engine, frame, horizontal, vertical, fire);
        }
        for (let i in aliens) {
            aliens[i].x = this.x + aliens[i].distance;
            aliens[i].update(i, engine, frame, horizontal, vertical, fire);
        }
    }

    render(engine) {
        engine.beginPath();
        engine.fillStyle = engine.createPattern(images['ground'], "repeat");
        engine.save();
        engine.translate(this.x - this.buffer, ground);
        engine.fillRect(0, 0, this.w + W, this.h);
        engine.restore();
        engine.fill();
        engine.beginPath();
        engine.fillStyle = engine.createPattern(images['landscape'], "repeat");
        engine.save();
        engine.translate(this.x - this.buffer, ground - 200);
        engine.fillRect(0, 0, this.w + W, 200);
        engine.restore();
        engine.fill();

        // start
        engine.drawImage(images['flags'], 0, 0, 80, 80, this.x - 40, ground - 80, 80, 80);
        // buffer - walking back distance
        if (king.buffer)
            engine.drawImage(images['flags'], 80, 0, 80, 80, this.x + king.buffer - 40 - king.w / 2, ground - 80, 80, 80);
        // finish
        engine.drawImage(images['flags'], 160, 0, 80, 80, this.x + this.w - 40, ground - 80, 80, 80);

    }

    finish() {

    }

    isFinished() {
        return (king.journey == this.w);
    }

    startToFinish() {
        return this.finishTime - this.startTime
    }

    time() {
        var t = this.finished ? this.finishTime : new Date().getTime();
        return Math.ceil((t - this.startTime) / 1000)
    }

    easeInQuart(t) {
        return t * t * t * t
    }

    humansCounter() {
        return Math.ceil(this.humans - (this.humans * this.easeInQuart(Math.min(1, this.time() / this.maxTime))))
    }
}


class King extends GameItem {
    constructor(x, y, w, h) {
        super(x, y, w, h);
        this.i = 0;
        this.color = "#00A";
        this.sx = 0;
        this.sy = 0;
        this.sw = 75;
        this.sh = 33;
        this.dx = 100;
        this.dy = 100;
        this.dw = 75;
        this.dh = 33;
        this.by = 0;
        this.speedX = 0;
        this.speedY = 0;
        this.arm = [];
        this.weapon = [];
        this.attack = 0;
        this.life = 100;
        this.journey = 0;
        this.buffer = 0;
        this.stop = false;
        this.map = {
            "arm": {
                "default": [[0, 47, 57, 37, 69, 34, 57, 37]],
                "attack": [[0, 0, 60, 47, 65, 26, 57, 47], [0, 47, 57, 37, 69, 34, 57, 37], [0, 84, 57, 24, 66, 46, 57, 24],
                    [0, 109, 60, 25, 63, 51, 60, 25], [0, 135, 60, 33, 61, 53, 60, 33]]
            },
            "sword": {
                "default": [[0, 49, 58, 36, 117, 13, 58, 36]],
                "attack": [[0, 0, 58, 48, 106, -11, 58, 48], [0, 49, 58, 36, 117, 13, 58, 36], [0, 85, 60, 27, 120, 35, 60, 27],
                    [0, 112, 63, 17, 120, 60, 63, 17], [0, 129, 63, 22, 115, 70, 63, 22]]
            }
        }
    }

    static images() {
        return {
            "head": "/images/head.png",
            "torso": "/images/torso.png",
            "arm": "/images/arm.png",
            "sword": "/images/sword.png",
            "legs": "/images/legs.png"
        };
    }

    init() {
        this.dx = buffer - (this.w / 2);
        this.arm = this.map['arm']['default'][0];
        this.weapon = this.map['sword']['default'][0];
    }

    update(engine, frame, horizontal, vertical, fire) {
        if (!this.stop && horizontal > 0) {
            this.sx = (this.sx + this.sw) % 600;
            //console.log('KING RIGHT', king.journey, map.buffer, king.buffer);
            //if (!this.stop && this.dx < W / 2)
            //    this.dx += speed;
        }
        if (!this.stop && horizontal < 0 && this.isInBuffer()) {
            //this.sx = (this.sx - this.sw) >= 0 ? (this.sx - this.sw) : 525;

            //console.log('KING LEFT', king.journey, map.buffer, king.buffer);
            //if (map.x <= this.bufferX)
            //this.stop = true;
            //if (this.dx > this.w)
            //this.dx -= speed;
        }
        if (!this.stop && vertical < 0 && this.y + this.h >= ground) {
            this.speedY = -15;
        }
        if (!this.stop && fire) {
            this.arm = this.map['arm']['attack'][this.attack];
            this.weapon = this.map['sword']['attack'][this.attack];
            this.attack = (this.attack + 1) % 4;
        }
        if (!this.stop && this.speedY < 0) {
            this.y += this.speedY;
        }
        if (!this.stop && this.y + this.h < ground) {
            this.speedY += G;
            if (this.y + this.speedY > ground - this.h)
                this.y = ground - this.h;
            else
                this.y += this.speedY;
        }

        board.journey.innerHTML = this.journey;
        this.render(engine);
    }

    render(engine) {

        if (this.isParallized && Math.floor(Date.now() / 200) % 2) {
            engine.globalAlpha = 0.4;
        } else engine.globalAlpha = 1;
        engine.drawImage(images['head'], 0, 0, 76, 67, this.dx, this.y, 76, 67);

        engine.drawImage(images['sword'], this.weapon[0], this.weapon[1], this.weapon[2],
            this.weapon[3], this.weapon[4] + this.dx, this.weapon[5] + this.y,
            this.weapon[6], this.weapon[7]);

        engine.drawImage(images['arm'], this.arm[0], this.arm[1], this.arm[2],
            this.arm[3], this.arm[4] + this.dx, this.arm[5] + this.y,
            this.arm[6], this.arm[7]);

        engine.drawImage(images['torso'], 0, 0, 76, 52, this.dx - 7, this.y + 45, 76, 52);
        engine.drawImage(images['legs'], this.sx, this.sy, this.sw, this.sh, this.dx, this.y + 88, this.dw, this.dh);
        engine.globalAlpha = 1;
    }

    parallize() {
        this.isParallized = true;
        king.stop = true;
        //console.log('king stop', king.stop);
        setTimeout(function () {
            king.isParallized = false;
            king.stop = false;
        }, 2000)
    }

    isAttacking() {
        return this.attack == 1;
    }

    isInBuffer() {
        //console.log('king buffer', king.journey, king.buffer, king.journey > king.buffer);
        return king.journey > king.buffer
    }
}


class Egg extends GameItem {
    constructor(x, y, w, h) {
        super(x, y, w, h);
        this.distance = x;
        this.i = Math.floor(Math.random() * 13) + 1;
    }

    static images() {
        return {"egg": "/images/eggs.png"};
    }

    update(i, engine, frame, horizontal, vertical, fire) {
        if (king.dx < this.x + this.w && king.dx + king.dw > this.x &&
            king.y < this.y + this.h && king.y + king.h > this.y) {

            if (king.speedY > 0 && (king.y + king.h > this.y) && (king.y + king.h < this.y + this.h)) {
                //console.log('top collision')
                if (!this.isDying)
                    king.speedY -= 20;
                //console.log('speedY', king.speedY)
                this.die(i);
            }

            if (!this.isDying && !king.isParallized && king.speedY > 0 && (king.dx + king.dw - this.x > 1)) {
                //console.log('front collision', king.dx, king.w, this.x)
                king.parallize();
                this.die(i);
            }

            //console.log('AHHH')
        }
        this.render(engine);
    }

    render(engine) {
        if (this.isDying) {
            if (Math.floor(Date.now() / 200) % 2)
                engine.globalAlpha = 0.4;
            engine.drawImage(images['egg'], 650, 0, this.w, this.h, this.x, this.y, this.w, this.h);
            engine.globalAlpha = 1;
        } else {
            if (Math.floor(Date.now() / 200) % 2) this.i++;
            engine.drawImage(images['egg'], (this.w * (this.i % 13)), 0, this.w, this.h, this.x, this.y, this.w, this.h);
        }
    }

    die(i) {
        if (this.isDying) return;
        this.isDying = true;
        setTimeout(function () {
            eggs.splice(i, 1);
        }, 300);
    }
}

class Alien extends GameItem {
    constructor(x, y, w, h, ammo) {
        super(x, y, w, h);
        this.distance = x;
        this.y = y - h;
        // this.w = 100;
        // this.h = 150;
        this.ammo = ammo;
        this.i = Math.floor(Math.random() * 13) + 1;
        this.life = 10;
        this.walk = 0;
        this.speedY = 1;
        this.bullets = [];
    }

    static images() {
        return {"alienBody": "/images/alien.png", "alienLegs": "/images/alien-legs.png"};
    }

    init() {
    }

    update(i, engine, frame, horizontal, vertical, fire) {
        this.walk = (this.walk + 1) % 24;
        if (this.walk == 12) this.distance -= 10;

        // this show
        // fire
        if (this.x < W) {
            if (!frame && this.bullets.length < 2 && this.ammo) {
                //console.log('alien', i, this.ammo, this.bullets.length);
                this.bullets.push(new Bullet(this.x + 5, ground - 78, 10, 4, this.w));
                this.ammo--;
            }
        }

        if (king.dx + king.dw < this.x && king.dx + king.dw + king.sw > this.x) {
            // console.log('you can attack', king.isAttacking())
            if (fire && this.life && king.isAttacking())
                this.life -= 1;
            //console.log(this.w * Math.floor((10 - this.life)))
        }

        if (this.life <= 0) {
            this.life = 0;
            this.die(i);
        }

        if (king.dx < this.x + this.w && king.dx + king.dw > this.x &&
            king.y < this.y + this.h && king.y + king.h > this.y) {
            if (king.speedY > 0 && (king.y + king.h > this.y) && (king.y + king.h < this.y + this.h)) {
                //console.log('alien top collision')
                //king.speedY -= 20;
                //console.log('speedY', king.speedY)
                king.parallize();
                //king.dx -= 100;
                king.y -= 30;
                this.distance += 100;
                //this.die(i);
            }
            if (!king.isParallized && king.speedY > 0 && (king.dx + king.dw - this.x > 1)) {
                //console.log('alien front collision', king.dx, king.w, this.x)
                king.parallize();
                //king.y -= 50;
                //map.x += 100;
                this.distance += 150;
                this.y -= 25;
                //this.die(i);
            }
        }

        if (this.speedY < 0) {
            this.y += this.speedY;
        }
        if (this.y + this.h < ground) {
            this.speedY += G;
            if (this.y + this.speedY > ground - this.h)
                this.y = ground - this.h;
            else
                this.y += this.speedY;
        }

        for (let i in this.bullets) {
            this.bullets[i].update(i, this.bullets, engine, frame, horizontal, vertical, fire);
        }
        this.render(engine)
    }

    render(engine) {
        if (this.isDying) {
            engine.globalAlpha = 1;
            if (Math.floor(Date.now() / 200) % 2)
                engine.globalAlpha = 0.4;
        }
        if (this.life < 10) {
            engine.drawImage(images['alienBody'], this.w * Math.floor((10 - this.life)), 0, this.w, 115, this.x, this.y, this.w, 115);
        } else {
            engine.drawImage(images['alienBody'], 0, 0, this.w, 115, this.x, this.y, this.w, 115);
        }
        engine.drawImage(images['alienLegs'], (this.w * (this.walk)), 0, this.w, 49, this.x, this.y + 103, this.w, 49);
    }

    die(i) {
        if (this.isDying) return;
        this.isDying = true;
        setTimeout(function () {
            aliens.splice(i, 1);
        }, 300);
    }
}

class Bullet extends GameItem {
    constructor(x, y, w, h, range) {
        super(x, y, w, h);
        this.distance = x;
        this.r = range || 1000; // range
        this.speedX = 3;
        this.speedY = 0;
        this.rangeOut = false;
    }

    static images() {
        return {};
    }

    update(i, bullets, engine, frame, horizontal, vertical, fire) {
        if (this.rangeOut || this.x < 0) {
            this.remove(i, bullets);
        } else if (!king.stop && horizontal > 0) {
            this.distance -= this.speedX + speed;
        } else if (!king.stop && horizontal < 0 && king.isInBuffer()) {
            this.distance -= this.speedX - speed;
        } else {
            this.distance -= this.speedX;
        }
        this.x = this.distance;
        // if the king has shoot
        if (king.dx < this.x + this.w && king.dx + king.w > this.x &&
            king.y < this.y + this.h && king.y + king.h > this.y) {
            if ((king.dx + king.w - this.x > 1)) {
                //console.log('the king shooted', king.dx, this.x, king.journey)
                //king.life -= 5;
                king.parallize();
                this.rangeOut = true;
                this.remove(i, bullets);
            }
        }
        if (this.y + this.h < ground) {
            this.speedY += G * .001;
            if (this.y + this.speedY > ground - this.h)
                this.remove(i, bullets);
            else
                this.y += this.speedY;
        }
        this.render(engine)
    }

    render(engine) {
        engine.beginPath();
        engine.rect(this.x, this.y, this.w, this.h);
        engine.fillStyle = this.getColor();
        engine.fill();
    }

    remove(i, bullets) {
        bullets.splice(i, 1);
    }

    getColor() {
        // this.color = {};
        // this.color.r = Math.round(Math.random() * 255);
        // this.color.g = Math.round(Math.random() * 255);
        // this.color.b = Math.round(Math.random() * 255);
        // this.color.opacity = .8;
        // return "rgba(" + this.color.r + ", " + this.color.g + ", " + this.color.b + ", " + this.color.opacity + ")";
        return "rgba(255,11,11,1)";
    }

}