document.addEventListener("DOMContentLoaded", function(event) {
    var _this, $core = $('#core');
    var Seite11 = {
        Assets: {
            baseURL: App.content.baseURL,
            mp3Player: true,
            defaultItems: true,
            image: {
                r1: '1.png',
                r2: '2.png',
                weiter: 'weiter.png',
                kontrol: 'kontrol.png',
            },
            audio: {}
        },
        config: _extends(Minti.mintibuchConfig, {})
    };
    Seite11.PlayScene = function() {
        this.total = 0;
        this.counter = 0;
        this.init = function () {
            _this = this;
            this.bg = this.add.image(0, 0, 'bg');
            this.isControlled = false;
            var pageData = App.content.data;
            this.headers = pageData.headers;
            this.data = pageData.data;
            this.LENGTH = 0;
            this.data.forEach(function (sub){ sub.forEach(function (){ _this.LENGTH++; }); });
            for(var key in Minti.Scene) {
                if( ! Minti.Scene.hasOwnProperty(key)) continue;
                this[key] = Minti.Scene[key].bind(this);
            }
        };
        this.create = function () {
            this.arrangeDefaultButtons(this.headers[0]);
            this.mp3Player = new Minti.PhaserHelper.MP3Player(this, 'default', undefined, {});
            this.arrangeScene();
        };
        this.arrangeScene = function () {
            this.pic = this.add.image(this.world.centerX, this.world.centerY + 30, 'r'+(this.counter+1));
            this.pic.anchor.set(.5);

            this.prev = this.add.button(110, 930, 'weiter', this.changePage, this);
            this.prev.anchor.set(.5);
            this.prev.scale.set(.85);
            this.prev.scale.x *= -1;

            this.next = this.add.button(this.world.width - this.prev.x, this.prev.y, 'weiter', this.changePage, this);
            this.next.anchor.set(.5);
            this.next.scale.set(.85);

            this.text = this.add.text(this.world.centerX, this.next.y, (this.counter+1)+' / 2',
                {font: '50px Amaranth'});
            this.text.anchor.set(.5);

            this.control = this.add.button(1625.6, 84.8, 'kontrol', this.controlFunc, this);
            this.control.visible = false;


            this.addPage();
        };
        this.addPage = function() {
            $('.dcevap').remove();
            var $inps = $('.input');
            $inps.remove();
            var subData = this.data[this.counter];
            for (var i = 0; i < subData.length; i++) {
                var datum = subData[i];
                $('#core').append('<input data-place="'+i+'" id="in'+i+'" type="text" class="input"><div id="dc'+i+'" class="dcevap"></div>');
                var _inp = $('#in'+i), _dc = $('#dc'+i);
                _inp.css(datum[1]);
                _dc.css({ top: parseFloat(datum[1].top.replace('%', '')) + 2.5 +'%', left: datum[1].left });
                if(datum[2] !== '') { _inp.val(datum[2]); }
                if(this.isControlled) {
                    if(datum[2] === datum[0]) {
                        _inp.css({color: '#009900'});
                    }
                    else {
                        _inp.css({color: '#EE0000'});
                        _dc.html(datum[0]);
                    }
                }
            }
            $inps = $('.input');
            if(!this.isControlled) {
                $inps.on('input', function (e){
                    if($(this).val() !== '') {
                        var id = parseInt($(this).attr('id').replace('in', ''));
                        _this.data[_this.counter][id][2] = $(this).val();
                    }
                });
                setTimeout(function (){
                    $inps.each(function(){
                        if($(this).val().length === 0) {
                            $(this).select();
                            return false;
                        }
                    });
                }, 1);
            }
            else {
                $inps.attr('disabled', true);
            }
            changeEvent();
        };
        this.changePage = function(e) {
            this.counter += Math.round(e.scale.x);
            (this.counter < 0) ? this.counter = 1 : this.counter;
            (this.counter > 1) ? this.counter = 0 : this.counter;
            this.pic.loadTexture('r'+(this.counter+1), 0);
            this.text.setText((this.counter+1)+' / 2');
            if(!this.isControlled){
                this.control.visible = this.counter;
            }
            this.addPage();
        };
        this.controlFunc = function(e) {
            this.isControlled = true; e.kill();
            this.data.forEach(function (sub){
                sub.forEach(function (ch){ if(ch[0] === ch[2]) { _this.total += 1000 / _this.LENGTH; } });
            });
            this.puanText.setText(Math.round(this.total));
            this.addPage();
        };
    };
    var core = new Phaser.Game(Seite11.config);
    core.state.add('Boot', new Minti.PhaserHelper.BootState('Preload'), true);
    core.state.add('Preload', new Minti.PhaserHelper.PreloadState('PlayScene', Seite11.Assets, core));
    core.state.add('PlayScene', Seite11.PlayScene);
    addEvents(function () {
        $('.dcevap').css({ 'fontSize': (($core.width() * (mintibuchInputFontSize - .5)) / 1920) + 'em' });
    })
});