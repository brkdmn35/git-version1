document.addEventListener("DOMContentLoaded", function(event) {
    var _this, $body = $('body'),
        _avS = $body.find('img.user-image').attr('src'), _avB;
    if(_avS === undefined) { _avS = ''; }
    _avB = _avS.replace('_3.png', '.png');
    pointFontSize =3;
    mintibuchInputFontSize=3;
    var Seite12 = {
        Assets: {
            baseURL: App.content.baseURL,
            mp3Player: false,
            defaultItems: true,
            image: {
                avatarS: _avS,
                avatarB: _avB,
                subBg: 'subBg.jpg',
                start: 'start.png',
                table: 'table.png',
                place: 'place.png',
                weiter: 'weiter.png',
                control: 'kontrol.png',
                question: 'question.png',
                questionBg: 'questionBg.png',
                place_selected: 'place_selected.png',

                x2up: 'x2up.png',
                x3up: 'x3up.png',
                x2back: 'x2back.png',
                x2backT: 'x2backT.png',
                x3forward: 'x3forward.png'
            },
            script: Minti.PhaserHelper.getFilters(['BlurX', 'BlurY']),
            atlas: {
                dice: ['dice@1.5x.png', 'dice@1.5x.min.json']
            },
            json: {
                'data': 'data.json'
            }
        },
        config: _extends(Minti.mintibuchConfig, {})
    };
    Seite12.PlayScene = function() {
        this.total = 0;
        this.counter = 0;
        this.init = function () {
            _this = this;
            this.add.image(0, 0, 'bg');
            var pageData = App.content.data;
            this.headers = pageData.headers;
            for(var key in Minti.Scene) {
                if( ! Minti.Scene.hasOwnProperty(key)) continue;
                this[key] = Minti.Scene[key].bind(this);
            }
        };
        this.create = function () {
            this.arrangeDefaultButtons(this.headers[0]);
            this.arrangeScene();
        };
        this.arrangeScene = function () {
            var getText = Minti.PhaserHelper.getText;
            this.show = core.add.group(this.world, 'show');
            this.show.counters = { question: 0, corr: 0, wron: 0 };
            this.show.create(0, 0, 'questionBg');
            this.dice = new Dice(core, core.world.centerX - 50, core.world.centerY, [core.add.filter("BlurX"), core.add.filter("BlurY")]);
            this.show.add(this.dice);
            this.show.create(core.world.centerX / 2 - 50, core.world.centerY, 'avatarB').anchor.set(.5);
            this.show.create(core.world.centerX / 2 + core.world.centerX + 50, core.world.centerY, 'table').anchor.set(.5);
            this.show.add(getText(this, 1488.4102564102564, 323.3434650455927, .5, 0, {font: '90px Amaranth'}));
            this.show.add(getText(this, 1488.4102564102564, 582.6747720364742, .5, 0, {font: '90px Amaranth'}));
            this.show.add(getText(this, 1488.4102564102564, 842.0060790273557, .5, 0, {font: '90px Amaranth'}));
            this.show.visible = false;

            this.part = core.add.group(this.world, 'part');
            var sub = this.part.create(957.2820512820513, 612.7355623100303, 'subBg');
            sub.anchor.set(.5);
            this.places = core.add.group(this.part, 'places');
            var data = core.cache.getJSON('data');
            var start = this.places.create(parseFloat(data.start.position.x), parseFloat(data.start.position.y), data.start.key);
            start.anchor.set(.5);
            start.index = 1;
            core.add.tween(start.scale).from({x:0, y:0}, 350, 'Back.easeOut', true);
            var _qes = Minti.Utils.shuffle($.extend(true, data.questions, {}));
            var specials = [{ key: 'x2back', action: -2 }, { key: 'x3up', action: 3 }, { key: 'x2backT', action: -2 }, { key: 'x3forward', action: 3 }, { key: 'x2up', action: -2 }];
            _qes.splice(core.rnd.integerInRange(3, 14), 0, specials[0]);
            _qes.splice(core.rnd.integerInRange(15, 18), 0, specials[1]);
            _qes.splice(core.rnd.integerInRange(22, 28), 0, specials[2]);
            _qes.splice(core.rnd.integerInRange(28, 33), 0, specials[3]);
            _qes.splice(core.rnd.integerInRange(35, 39), 0, specials[4]);

            var _wd = core.cache.getImage('place').width - 7.3;
            for (var i = 0,farkx = _wd, farky = 0; i < _qes.length; i++) {
                var obj = _qes[i];
                var sp = this.places.create(parseFloat(data.start.position.x)+farkx, parseFloat(data.start.position.y)+farky, 'place');
                sp.anchor.set(.5);
                sp.index = i+2;
                if(obj.word) {
                    sp.addChild(getText(this, 0, 0, .5, obj.word, {font: 'bold 25px Amaranth', fill: data.colors[obj.color]}));
                    sp.action = 'question';
                    sp.data = {question: obj.question, ans: obj.answer};
                }
                if(obj.key) {
                    sp.addChild(core.make.sprite(0, 0, obj.key));
                    sp.children[0].anchor.set(.5);
                    sp.action = 'sendTo';
                    sp.data = obj.action;
                }
                if(i < 13) { farkx += _wd; }
                if(i > 12 && i < 20) { farky -= core.cache.getImage('place').width - 7.6; }
                if(i >= 20 && i < 34) { farkx -= _wd; }
                if(i > 33) { farky += core.cache.getImage('place').width - 7.6; }
                var a = core.add.tween(sp.scale).from({x:0, y:0}, 350, 'Back.easeOut', true, 350 + (i * 100));
                if(i === _qes.length - 1) {
                    a.onComplete.add(function () { core.add.tween(this.player.scale).to({x:.4, y:.4}, 350, 'Back.easeOut', true).onComplete.add(function () { this.rollADice(); }, this); }, this);
                }
            }
            this.player = this.places.create(202.41025641025644, 986.9604863221883, 'avatarS');
            this.player.anchor.set(.5);
            this.player.scale.set(0);
            this.player.currentIndex = 1;
        };
        this.sendPlayer = function (ind) {
            var _this = this, targ;
            targ = this.places.children.find(function (value) { return value.index === (_this.player.currentIndex+ind) });
            if(targ) {
                core.add.tween(this.player).to({x: targ.x}, 500, 'Linear', true);
                core.add.tween(this.player).to({y: targ.y}, 500, 'Cubic.easeIn', true).onComplete.addOnce(function () {
                    this.player.currentIndex = targ.index;
                    if(targ.children[0].text) {
                        this.setAction(targ.action, targ.data, targ.children[0].text, targ.children[0].style.fill);
                        targ.loadTexture('place_selected', 0);
                        this.willChangeBack = targ;
                    } else {
                        this.setAction(targ.action, targ.data);
                    }
                }, this);
            }
            else {
                if(this.player.currentIndex+ind > 42) {
                    targ = this.places.children.find(function (value) { return value.index === 1 });
                    core.add.tween(this.player).to({x: targ.x}, 500, 'Linear', true);
                    core.add.tween(this.player).to({y: targ.y}, 500, 'Cubic.easeIn', true).onComplete.add(function () {
                        this.world.bringToTop(this.show);
                        this.show.visible = true;
                        this.total = (1000 / this.show.counters.question) * this.show.counters.corr;
                        this.puanText.setText(Math.round(this.total));
                        new PopUp(core);
                    }, this);
                }
            }
        };
        this.setAction = function (action, data, text, fill) {
            this.temp = core.add.group();
            this.temp.y -= 320;
            this.temp.data = data;
            switch(action) {
                case 'question':
                    var q = this.temp.create(core.world.centerX, core.world.centerY, 'question');
                    core.add.tween(q.scale).from({x:0, y:0}, 450, 'Back.easeOut', true).onComplete.addOnce(function () {
                        $('#core').append('<input type="text" class="input">');
                        var cnt = this.temp.create(1659.6410256410256, 560.1702127659573, 'control');
                        cnt.anchor.set(.5);
                        cnt.inputEnabled = true;
                        cnt.input.useHandCursor = true;
                        cnt.events.onInputDown.add(this.checkAnswer, this);
                        var qq = Minti.PhaserHelper.getText(this, 165.82051282051282, 478.7325227963526, {x: 0, y: .5}, data.question, {font: '45px Amaranth'});
                        this.temp.add(qq);
                        var dd = Minti.PhaserHelper.getText(this, qq.x + qq.width + 30, qq.y, {x: 0, y: .5}, '('+text+')', {font: '45px Amaranth'});
                        dd.addColor(fill, 1); dd.addColor('#000', dd.text.length - 1);
                        this.temp.add(dd);
                        var ans = Minti.PhaserHelper.getText(this, 190.4358974358974, 630.5440729483282, {x: 0, y: .5}, data.ans.split('|')[0], {font: '40px Amaranth', fill: '#009900'});
                        ans.visible = false;
                        this.temp.add(ans);
                        this.temp.ans = ans;
                        $('.input').focus();
                        changeEvent();
                    }, this);
                    this.temp.setAll('anchor.x', .5);
                    this.temp.setAll('anchor.y', .5);
                    break;
                case 'sendTo':
                    if(data < 0) {
                        this.ys.play();
                        this.ys.onStop.addOnce(function () { this.sendPlayer(data); }, this);
                    }
                    else {
                        this.ds.play();
                        this.ds.onStop.addOnce(function () { this.sendPlayer(data); }, this);
                    }
                    break;
            }
        };
        this.checkAnswer = function (e) {
            e.destroy();
            $inp = $('.input');
            $inp.attr('disabled', true);
            var cnt = this.temp.create(1659.6410256410256, 560.1702127659573, 'weiter');
            cnt.anchor.set(.5);
            cnt.inputEnabled = true;
            cnt.input.useHandCursor = true;
            cnt.events.onInputDown.addOnce(this.rollADice, this);
            var uval = $inp.val().mtrim();
            this.show.counters.question++;
            var kont = this.temp.data.ans.split('|'), correct = false;
            for (var i = 0; i < kont.length; i++) {
                var kontElement = kont[i];
                if(kontElement === uval) { correct = true; break; }
            }
            if(correct) {
                this.show.counters.corr++;
                this.ds.play(); this.gl.play();
                $inp.css({color: '#009900'});
            }
            else {
                this.show.counters.wron++;
                this.ys.play();
                $inp.css({color: '#EE0000'});
                this.temp.ans.visible = true;
            }
            this.show.children[4].setText(this.show.counters.question);
            this.show.children[5].setText(this.show.counters.corr);
            this.show.children[6].setText(this.show.counters.wron);
        };
        this.rollADice = function () {
            if(this.temp) { this.temp.destroy(true); $('.input').remove(); }
            if(this.willChangeBack) { this.willChangeBack.loadTexture('place', 0); }
            var _this = this;
            this.show.visible = true;
            core.world.bringToTop(this.show);
            core.add.tween(this.dice.scale).from({x: 0, y: 0}, 350, 'Back.easeOut', true).onComplete.addOnce(function () {
                this.dice.events.onInputDown.addOnce(function () {
                    var time = core.time.create(true);
                    var aa = 0;
                    time.loop(100, function () {
                        this.dice.frame = core.rnd.pick([0,1,2,3,4,5]);
                        aa++;
                        if(aa === 15) {
                            time.stop();
                            this.dice.isPlaying = false;
                            this.dice.filters = null;
                            this.dice.angle = 0;
                            setTimeout(function () { _this.show.visible = false; _this.sendPlayer(_this.dice.frame+1); core.world.bringToTop(_this.part); }, 750, this);
                        }
                    }, this);
                    this.dice.isPlaying = true;
                    this.dice.filters = [this.dice.blurX, this.dice.blurY];
                    time.start();
                }, this);
            }, this);
        };
    };

    function Dice(game, x, y, blur) {
        Phaser.Sprite.call(this, game, x, y, 'dice');
        this.game = game;
        this.anchor.set(.5);
        this.blurX = blur[0];
        this.blurY = blur[1];
        this.inputEnabled = true;
        this.input.useHandCursor = true;
        this.frame = 0;
    }
    Dice.prototype = Object.create(Phaser.Sprite.prototype);
    Dice.prototype.constructor = Dice;
    Dice.prototype.update = function () {
        if (this.isPlaying) {
            this.angle = core.rnd.angle();
        }
    };
    addEvents();

    var core = new Phaser.Game(Seite12.config);
    core.state.add('Boot', new Minti.PhaserHelper.BootState('Preload'), true);
    core.state.add('Preload', new Minti.PhaserHelper.PreloadState('PlayScene', Seite12.Assets, core));
    core.state.add('PlayScene', Seite12.PlayScene);
});