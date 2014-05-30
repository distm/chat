var Chat = {
    boxes: [],
    config: {},
    
    init: function(conf){
        var defaults = {
            userMode: "user"
        };

        // apply config
        this.config = $.extend({}, defaults, conf);

        // init
        this.init_ID();
        this.init_minMax();
        this.init_inputEvent();
    },
    
    init_ID: function(){
        var me = this;
        $(".n-chat-box").each(function(){
            var n = Math.round(Math.random()*1000),
                id = "chat-box-"+ n;
            $(this).attr("id", id);
            me.boxes[n] = $(this);
        });
    },
    
    init_minMax: function(){
        var me = this;
        $(document.body).on("click", ".n-btn-minmax", function(){
            var $t = $(this),
                $box = $t.closest(".n-chat-box"),
                $box_id = $box.attr("id"),
                $box_index = $box_id.match(/\d+/g)[0],
                $body = $box.find(".n-chat-box-body"),
                $input_ct = $box.find(".n-chat-box-input");
                
            if(/minimized/i.test($t.attr("class"))){
                $t.removeClass("minimized");
                $body.show();
                $input_ct.show();
                me.boxes[$box_index].attr("data-minimized", false);
            } else {
                $t.addClass("minimized");
                $body.hide();
                $input_ct.hide();
                me.boxes[$box_index].attr("data-minimized", true);
            }
        });
    },
    
    init_inputEvent: function(){
        var me = this;
        $(document.body).on("keyup", ".n-chat-box-input > input", function(e){
            // element
            var $el = $(this),
                $box_id = $el.closest(".n-chat-box").attr("id"),
                $box_index = $box_id.match(/\d+/g)[0];
            
            // char code
            var c = e.keyCode || e.which;
            
            // value
            var v = $.trim($el.val());
            
            if(v.length>0 && c===13){
                me.send(v, me.boxes[$box_index]);
            }
        });
    },
    
    send: function(msg, $box){
        var me = this,
            $msg_ct = $box.find(".n-chat-msg"),
            $input = $box.find("input");
        
        if(! me.config.nickname || ! me.config.email){
            me.popupRegister();
            return false;
        }
        
        // clear value
        $input.val("");
        
        // apply msg
        var msg_line = $('<div class="n-chat-msg-line">').html(msg);
        $msg_ct.append(msg_line).scrollTop($msg_ct.prop("scrollHeight"));
        
        // send message
    },
    
    popupRegister: function(){
        var $popup = $("#popup-register");
        if(! $popup.length){
            var tpl = [
                '<div class="modal" id="popup-register">',
                    '<div class="modal-dialog">',
                        '<div class="modal-content">',
                            '<div class="modal-header">',
                                '<button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>',
                                '<h4 class="modal-title">Silahkan isi Nama dan Email!</h4>',
                            '</div>',
                            '<div class="modal-body">',
                                '<div class="row">',
                                    '<div class="col-md-6">',
                                        '<label>Nama</label>',
                                        '<input type="text" class="form-control" />',
                                    '</div>',
                                    '<div class="col-md-6">',
                                        '<label>Email</label>',
                                        '<input type="email" class="form-control" />',
                                    '</div>',
                                '</div>',
                            '</div>',
                            '<div class="modal-footer">',
                                '<button type="button" class="btn btn-primary">Lanjut</button>',
                                '<button type="button" class="btn btn-default" data-dismiss="modal">Batal</button>',
                            '</div>',
                        '</div>',
                    '</div>',
                '</div>'
            ].join("");
            $(document.body).append(tpl);
            $popup = $("#popup-register");
        }
        
        $popup.modal({backdrop:'static'});
    }
};